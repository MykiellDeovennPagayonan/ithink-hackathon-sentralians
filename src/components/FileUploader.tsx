/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

type FileWithPreview = File & { preview: string };

interface FileUploaderProps {
  onUploadStart: () => void;
  onUploadComplete: (imageUrl: string) => void;
  onUploadError: () => void;
}

export default function FileUploader({
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (uploadedFiles) => {
      if (uploadedFiles.length > 0) {
        const url = uploadedFiles[0].url;
        console.log("Uploaded file URL:", url);
        setUploadedImageUrl(url);
      }
      setFiles([]);
      onUploadComplete(uploadedFiles[0].url);
    },
    onUploadError: (error: any) => {
      console.error("Upload error:", error);
      onUploadError();
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const mapped = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(mapped);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleRemoveImage = () => {
    setFiles([]);
    setUploadedImageUrl(null);
  };

  return (
    // Make sure this component itself can stretch in its parent:
    <div className="flex flex-col space-y-4 h-full">
      {/* Dropzone / Preview Container */}
      <div
        {...getRootProps()}
        className="flex-1 flex h-full w-full"
      >
        <input {...getInputProps()} className="h-full" />

        {files.length > 0 ? (
          <div className="relative h-full w-full border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={files[0].preview || "/placeholder.svg"}
              alt="Uploaded solution"
              width={128}
              height={128}
              className="w-full h-full object-contain bg-white"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : uploadedImageUrl ? (
          // Preview of the already‐uploaded image (fills entire dropzone)
          <div className="relative h-full w-full border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={files[0].preview || "/placeholder.svg"}
              alt="Uploaded solution"
              width={128}
              height={128}
              className="w-full h-full object-contain bg-white"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          // Initial “drop area” state (fills entire dropzone)
          <div
            className={`
              h-full w-full p-4 md:p-8 lg:p-12 border-2 border-dashed border-gray-300 rounded-lg 
              flex flex-col items-center justify-center 
              cursor-pointer hover:border-gray-400 transition-colors
              ${isDragActive ? "bg-gray-50" : ""}
            `}
          >
            <Upload className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
            <div className="text-center text-gray-500">
              <p className="text-sm sm:text-lg font-medium mb-1">
                {isDragActive ? "Drop the image here" : "Drop your image here"}
              </p>
              <p className="text-xs sm:text-sm">or click to browse files</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        className="h-10 sm:h-12 text-sm sm:text-lg flex items-center justify-center"
        onClick={() => {
          if (files.length === 0) return;
          onUploadStart();
          startUpload(files);
        }}
        disabled={files.length === 0 || isUploading}
      >
        {isUploading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" /> Upload Image
          </>
        )}
      </Button>
    </div>
  );
}
