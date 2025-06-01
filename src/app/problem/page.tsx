"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowLeft, Upload, Camera, X, Send } from "lucide-react";
import Link from "next/link";
import CameraCapture from "@/components/camera-capture";
import { mockProblems } from "@/mockdata/problems";
import Image from "next/image";

interface MathJax {
  typesetPromise: (elements?: Element[]) => Promise<void>;
  startup: {
    defaultReady: () => void;
  };
}

declare global {
  interface Window {
    MathJax: MathJax;
  }
}

export default function ProblemPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mathRendered, setMathRendered] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const equationRef = useRef<HTMLDivElement>(null);

  // Find the problem by ID
  const problem = mockProblems.find((p) => p.id === id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !problem) return;

    const renderMath = async () => {
      const checkMathJax = () => {
        return window.MathJax && window.MathJax.typesetPromise;
      };

      if (checkMathJax()) {
        try {
          await window.MathJax.typesetPromise(
            [equationRef.current].filter(Boolean) as Element[]
          );
          setMathRendered(true);
        } catch (err) {
          console.log("MathJax error:", err);
        }
      } else {
        // Wait for MathJax to load
        const interval = setInterval(async () => {
          if (checkMathJax()) {
            clearInterval(interval);
            try {
              await window.MathJax.typesetPromise(
                [equationRef.current].filter(Boolean) as Element[]
              );
              setMathRendered(true);
            } catch (err) {
              console.log("MathJax error:", err);
            }
          }
        }, 100);

        return () => clearInterval(interval);
      }
    };

    renderMath();
  }, [isMounted, problem]); // Updated dependency array

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    closeCamera();
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    // In a real app, this would send the image to AI for analysis
    alert(
      "Solution submitted! The AI will analyze your work and provide feedback."
    );
  };

  // Show error state if no ID provided
  if (!id) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              No problem ID was provided in the URL.
            </p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if problem not found
  if (!problem) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            <Link href="/explore">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The problem with ID &quot;{id}&quot; could not be found.
            </p>
            <Link href="/explore">
              <Button>Browse Problems</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the equation content until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            <Link href="/explore">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-160px)]">
            <div className="flex flex-col">
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading problem...</div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col">
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-gray-500">
                    Loading submission area...
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Link href="/explore">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-160px)]">
          {/* Left Side - Problem Display */}
          <div className="flex flex-col order-1 lg:order-1">
            <Card className="flex-1">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2 leading-tight">
                      {problem.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {problem.category}
                      </Badge>
                      <Badge
                        className={`text-xs sm:text-sm ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Created by {problem.createdBy}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Problem Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {problem.description}
                  </p>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Problem:
                  </h3>
                  <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col justify-center overflow-hidden">
                    <div className="w-full max-w-full">
                      {!mathRendered && (
                        <div className="text-gray-500 text-xs sm:text-sm mb-2 text-center">
                          Rendering equation...
                        </div>
                      )}
                      <div
                        ref={equationRef}
                        className="w-full overflow-x-auto overflow-y-hidden mb-4"
                        style={{
                          opacity: mathRendered ? 1 : 0,
                          transition: "opacity 0.3s ease-in-out",
                          fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
                          lineHeight: "1.6",
                        }}
                      >
                        <div className="min-w-max px-2 py-1 text-center">{`$$${problem.latexEquation}$$`}</div>
                      </div>

                      {/* Instructions Section */}
                      {problem.instructions && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p className="text-blue-700 font-medium text-sm sm:text-base text-center">
                            {problem.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Submission Area */}
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
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 sm:h-12 text-sm"
                    onClick={openCamera}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>

                {/* Image Preview/Drop Zone */}
                <div className="flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
                  {uploadedImage ? (
                    <div className="relative h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded solution"
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
                    <div
                      className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={handleUploadClick}
                    >
                      <div className="text-center text-gray-500 p-4">
                        <Upload className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                        <p className="text-sm sm:text-lg font-medium mb-1">
                          Drop your solution here
                        </p>
                        <p className="text-xs sm:text-sm">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  className="h-10 sm:h-12 text-sm sm:text-lg"
                  disabled={!uploadedImage || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Solution
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Camera Modal */}
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
