/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Upload, X, Loader2 } from "lucide-react";
// import CameraCapture from "@/components/camera-capture";

type FileWithPreview = File & { preview: string };

interface UploadImageProps {
  onUploadComplete: (imageUrl: string) => void;
  onUploadError?: () => void;
  onUploadStart?: () => void;
  initialImageUrl?: string;
  className?: string;
  showCamera?: boolean;
  showDropZone?: boolean;
  uploadButtonText?: string;
  placeholder?: string;
  minHeight?: string;
}

export default function UploadImage({
  onUploadComplete,
  onUploadError,
  onUploadStart,
  initialImageUrl = "",
  className = "",
  showCamera = true,
  showDropZone = true,
  uploadButtonText = "Upload Image",
  placeholder = "Drop your image here or click to browse files",
  minHeight = "min-h-[200px]",
}: UploadImageProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] =
    useState<string>(initialImageUrl);
  // const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (uploadedFiles) => {
      if (uploadedFiles.length > 0) {
        const url = uploadedFiles[0].url;
        console.log("Uploaded file URL:", url);
        setUploadedImageUrl(url);
        onUploadComplete(url);
      }
      setFiles([]);
    },
    onUploadError: (error: any) => {
      console.error("Upload error:", error);
      onUploadError?.();
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
    setUploadedImageUrl("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    disabled: !showDropZone,
  });

  const handleUploadClick = useCallback((e?: React.MouseEvent) => {
    // Prevent event bubbling that might interfere with other handlers
    e?.preventDefault();
    e?.stopPropagation();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFiles([fileWithPreview]);
        setUploadedImageUrl("");
      }
    };
    input.click();
  }, []);

  // const openCamera = useCallback((e?: React.MouseEvent) => {
  //   // Prevent event bubbling
  //   e?.preventDefault();
  //   e?.stopPropagation();
  //   setIsCameraOpen(true);
  // }, []);

  // const closeCamera = useCallback(() => {
  //   setIsCameraOpen(false);
  // }, []);

  // const handleCameraCapture = useCallback(
  //   async (imageDataUrl: string) => {
  //     try {
  //       const response = await fetch(imageDataUrl);
  //       const blob = await response.blob();
  //       const file = new File([blob], "camera-capture.jpg", {
  //         type: "image/jpeg",
  //       });

  //       const fileWithPreview = Object.assign(file, {
  //         preview: imageDataUrl,
  //       });

  //       setFiles([fileWithPreview]);
  //       setUploadedImageUrl("");
  //       closeCamera();
  //     } catch (error) {
  //       console.error("Error processing camera capture:", error);
  //       closeCamera();
  //     }
  //   },
  //   [closeCamera]
  // );

  const handleManualUpload = useCallback(() => {
    if (files.length === 0) return;
    onUploadStart?.();
    startUpload(files);
  }, [files, onUploadStart, startUpload]);

  const handleRemoveImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setFiles([]);
      setUploadedImageUrl("");
      onUploadComplete("");
    },
    [onUploadComplete]
  );

  const currentImage = files.length > 0 ? files[0].preview : uploadedImageUrl;
  const hasFileToUpload = files.length > 0 && !uploadedImageUrl;
  const hasUploadedImage = uploadedImageUrl !== "";

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Upload/Camera Buttons */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 sm:h-12 text-sm"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
          {showCamera && (
            <Button
              type="button"
              variant="outline"
              className="h-10 sm:h-12 text-sm"
              onClick={openCamera}
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          )}
        </div> */}

        {/* Image Preview/Drop Zone */}
        <div className={`flex-1 ${minHeight}`}>
          <div {...(showDropZone ? getRootProps() : {})} className="h-full">
            {showDropZone && <input {...getInputProps()} />}

            {currentImage ? (
              <div className="relative h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={currentImage || "/placeholder.svg"}
                  alt="Image preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain bg-white"
                  style={{ maxWidth: "100%", height: "auto" }}
                />

                {/* Loading overlay when uploading */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Uploading...
                      </p>
                    </div>
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  {hasUploadedImage ? (
                    <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Uploaded
                    </div>
                  ) : hasFileToUpload ? (
                    <div className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Ready to upload
                    </div>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${
                  showDropZone
                    ? "cursor-pointer hover:border-gray-400 transition-colors"
                    : ""
                } ${isDragActive ? "bg-gray-50 border-gray-400" : ""}`}
                onClick={showDropZone ? handleUploadClick : undefined}
              >
                <div className="text-center text-gray-500 p-4">
                  <Upload className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                  <p className="text-sm sm:text-lg font-medium mb-1">
                    {isDragActive ? "Drop the image here" : placeholder}
                  </p>
                  {showDropZone && (
                    <p className="text-xs sm:text-sm">
                      or click to browse files
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button - Only show when there's a file to upload */}
        {hasFileToUpload && (
          <Button
            type="button"
            className="w-full h-10 sm:h-12 text-sm sm:text-lg"
            onClick={handleManualUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {uploadButtonText}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Camera Dialog */}
      {/* {showCamera && (
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogContent
            className="max-w-none w-full h-full p-0 bg-black border-0"
            aria-describedby="camera-description"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={closeCamera}
          >
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Camera for capturing photo</DialogTitle>
              </VisuallyHidden>
              <VisuallyHidden>
                <DialogDescription id="camera-description">
                  Use your device camera to take a photo. Position your content
                  within the guide frame and tap the capture button.
                </DialogDescription>
              </VisuallyHidden>
            </DialogHeader>

            <CameraCapture
              isOpen={isCameraOpen}
              onCaptureComplete={handleCameraCapture}
              onCloseCamera={closeCamera}
            />
          </DialogContent>
        </Dialog>
      )} */}
    </>
  );
}
