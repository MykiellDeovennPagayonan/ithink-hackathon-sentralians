/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "../utils/uploadthing";

type FileWithPreview = File & { preview: string };

export default function CustomDropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res: any) => {
      console.log("Upload completed:", res);
      setFiles([]);
    },
    onUploadError: (error: any) => {
      console.error("Upload error:", error);
    },
  });

  // When the user drops or selects files, update state and generate a preview URL.
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Map each File to a FileWithPreview to show a thumbnail if needed
    const mapped = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(mapped);
  }, []);

  // Initialize React Dropzone behavior
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [], // only allow images
    },
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Dropzone box */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-72 h-72 border-2 border-dashed rounded-md cursor-pointer transition-colors 
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <input {...getInputProps()} />
        {files.length === 0 ? (
          <p className="text-gray-500 text-center px-4">
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop an image, or click to select"}
          </p>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={files[0].preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
            <p className="text-sm text-gray-700">{files[0].name}</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <button
          onClick={() => startUpload(files)}
          disabled={isUploading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      )}
    </div>
  );
}
