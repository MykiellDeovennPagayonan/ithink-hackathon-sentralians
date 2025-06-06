/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Upload, Camera, X, Send, Loader2 } from "lucide-react";
import CameraCapture from "@/components/camera-capture";

type FileWithPreview = File & { preview: string };

interface SubmissionAreaProps {
  onUploadStart: () => void;
  onUploadComplete: (imageUrl: string) => void;
  onUploadError: () => void;
  onSubmit: (imageUrl: string) => void;
  isSubmitting?: boolean;
}

export default function SubmissionArea({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onSubmit,
  isSubmitting = false,
}: SubmissionAreaProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (uploadedFiles) => {
      if (uploadedFiles.length > 0) {
        const url = uploadedFiles[0].url;
        console.log("Uploaded file URL:", url);
        setUploadedImageUrl(url);
        onUploadComplete(url);
        onSubmit(url)
      }
      setFiles([]);
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
    setUploadedImageUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFiles([fileWithPreview]);
        setUploadedImageUrl(null);
      }
    };
    input.click();
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCameraCapture = async (imageDataUrl: string) => {
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
    
    const fileWithPreview = Object.assign(file, {
      preview: imageDataUrl,
    });
    
    setFiles([fileWithPreview]);
    setUploadedImageUrl(null);
    closeCamera();
  };

  const handleManualUpload = () => {
    if (files.length === 0) return;
    onUploadStart();
    startUpload(files);
  };

  const handleRemoveImage = () => {
    setFiles([]);
    setUploadedImageUrl(null);
  };

  const handleSubmit = () => {
    if (uploadedImageUrl) {
      onSubmit(uploadedImageUrl);
    }
  };

  const currentImage = files.length > 0 ? files[0].preview : uploadedImageUrl;
  const hasFileToUpload = files.length > 0 && !uploadedImageUrl;
  const hasUploadedImage = uploadedImageUrl !== null;

  return (
    <>
      <div className="flex flex-col order-2 lg:order-2">
        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Submit Your Solution
            </CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm">
              Upload a photo of your handwritten solution or take a picture
              with your camera
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
            {/* Upload/Camera Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-10 sm:h-12 text-sm"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <Button
                variant="outline"
                className="h-10 sm:h-12 text-sm"
                onClick={openCamera}
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Image Preview/Drop Zone */}
            <div className="flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
              <div {...getRootProps()} className="h-full">
                <input {...getInputProps()} />
                
                {currentImage ? (
                  <div className="relative h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={currentImage || "/placeholder.svg"}
                      alt="Solution preview"
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
                          <p className="text-sm font-medium text-gray-700">Uploading...</p>
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
                    className={`h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
                      isDragActive ? "bg-gray-50 border-gray-400" : ""
                    }`}
                    onClick={handleUploadClick}
                  >
                    <div className="text-center text-gray-500 p-4">
                      <Upload className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                      <p className="text-sm sm:text-lg font-medium mb-1">
                        {isDragActive ? "Drop the image here" : "Drop your solution here"}
                      </p>
                      <p className="text-xs sm:text-sm">
                        or click to browse files
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button - Only show when there's a file to upload */}
            {hasFileToUpload && (
              <Button
                className="h-10 sm:h-12 text-sm sm:text-lg"
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
                    Upload Image
                  </>
                )}
              </Button>
            )}

            {hasUploadedImage && (
              <Button
                className="h-10 sm:h-12 text-sm sm:text-lg"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCamera();
          }
        }}
      >
        <DialogContent
          className="max-w-none w-full h-full p-0 bg-black border-0 [&>button]:hidden"
          aria-describedby="camera-description"
        >
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Camera for capturing solution photo</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden>
              <DialogDescription id="camera-description">
                Use your device camera to take a photo of your solution.
                Position your work within the guide frame and tap the capture
                button.
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
    </>
  );
}