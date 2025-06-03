/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CameraCapture from "@/components/camera-capture";

interface ImageUploaderProps {
  onImageSelected?: (image: string | null) => void;
  className?: string;
  defaultImage?: string | null;
  disabled?: boolean;
}

export default function ImageUploader({
  onImageSelected,
  className = "",
  defaultImage = null,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    defaultImage
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (image: string | null) => {
    setUploadedImage(image);
    onImageSelected?.(image);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (disabled || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    handleImageChange(imageDataUrl);
    setIsCameraOpen(false);
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    handleImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCamera = () => {
    if (disabled) return;
    setIsCameraOpen(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload/Camera Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-10 sm:h-12 text-sm"
          onClick={handleUploadClick}
          disabled={disabled}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        <Button
          variant="outline"
          className="h-10 sm:h-12 text-sm"
          onClick={openCamera}
          disabled={disabled}
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </div>

      {/* Image Preview/Drop Zone */}
      <div className="flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
        {uploadedImage ? (
          <div className="relative h-full border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded solution"
              className="w-full h-full object-contain bg-white"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            {!disabled && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center transition-colors ${
              disabled
                ? "cursor-not-allowed bg-gray-50"
                : "cursor-pointer hover:border-gray-400"
            }`}
            onClick={disabled ? undefined : handleUploadClick}
          >
            <div className="text-center text-gray-500 p-4">
              {disabled ? (
                <>
                  <Lock className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                  <p className="text-sm sm:text-lg font-medium mb-1">
                    Authentication Required
                  </p>
                  <p className="text-xs sm:text-sm">
                    Please log in to upload solutions
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                  <p className="text-sm sm:text-lg font-medium mb-1">
                    Drop your solution here
                  </p>
                  <p className="text-xs sm:text-sm">or click to browse files</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCameraOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-none w-full h-full p-0 bg-black border-0 [&>button]:hidden">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Camera for capturing solution photo</DialogTitle>
            </VisuallyHidden>
            <DialogDescription className="sr-only">
              Use your device camera to take a photo of your solution. Position
              your work within the guide frame and tap the capture button.
            </DialogDescription>
          </DialogHeader>

          <CameraCapture
            isOpen={isCameraOpen}
            onCaptureComplete={handleCameraCapture}
            onCloseCamera={() => setIsCameraOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
