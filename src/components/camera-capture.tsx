/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Camera } from "lucide-react";

interface CameraCaptureProps {
  isOpen: boolean;
  onCaptureComplete?: (imageDataUrl: string) => void;
  onCloseCamera?: () => void;
}

interface CameraDevice {
  deviceId: string;
  label: string;
  facingMode?: "user" | "environment";
}

export default function CameraCapture({
  isOpen,
  onCaptureComplete,
  onCloseCamera,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Detect available cameras
  const detectCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      const cameras: CameraDevice[] = videoDevices.map((device, index) => {
        // Try to determine facing mode from label
        const label = device.label.toLowerCase();
        let facingMode: "user" | "environment" | undefined;

        if (
          label.includes("front") ||
          label.includes("user") ||
          label.includes("selfie")
        ) {
          facingMode = "user";
        } else if (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        ) {
          facingMode = "environment";
        }

        return {
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
          facingMode,
        };
      });

      setAvailableCameras(cameras);
      setHasMultipleCameras(cameras.length > 1);

      // For mobile devices, prefer back camera if available
      if (cameras.length > 1) {
        const backCameraIndex = cameras.findIndex(
          (camera) => camera.facingMode === "environment"
        );
        if (backCameraIndex !== -1) {
          setCurrentCameraIndex(backCameraIndex);
        }
      }

      return cameras;
    } catch (err) {
      console.error("Error detecting cameras:", err);
      return [];
    }
  };

  const switchCamera = () => {
    if (hasMultipleCameras) {
      setCurrentCameraIndex(
        (prevIndex) => (prevIndex + 1) % availableCameras.length
      );
    }
  };

  // Immediate camera stop function
  const stopCameraImmediate = () => {
    const stream = streamRef.current;
    if (stream) {
      // Stop all tracks immediately
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(
          "Immediately stopped camera track:",
          track.kind,
          track.readyState
        );
      });

      // Clear video source immediately
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Force reload to clear any cached stream
      }

      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      detectCameras().then(() => {
        startCamera();
      });
    } else {
      // Immediate cleanup when closing
      stopCameraImmediate();
    }

    // Cleanup function for component unmount
    return () => {
      stopCameraImmediate();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && availableCameras.length > 0) {
      startCamera();
    }
  }, [currentCameraIndex]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop existing stream immediately before starting new one
      stopCameraImmediate();

      let constraints: MediaStreamConstraints;

      if (availableCameras.length > 0 && availableCameras[currentCameraIndex]) {
        // Use specific camera device
        constraints = {
          video: {
            deviceId: { exact: availableCameras[currentCameraIndex].deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
      } else {
        // Fallback to default camera with facing mode preference
        constraints = {
          video: {
            facingMode: "environment", // Prefer back camera
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError(
            "Camera access denied. Please allow camera permissions and try again."
          );
        } else if (err.name === "NotFoundError") {
          setError("No camera found. Please connect a camera and try again.");
        } else if (err.name === "NotReadableError") {
          setError("Camera is already in use by another application.");
        } else {
          setError(
            "Unable to access camera. Please check your camera settings."
          );
        }
      } else {
        setError("Unable to access camera. Please check permissions.");
      }
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

        // Use optional chaining to avoid serialization issues
        onCaptureComplete?.(imageDataUrl);
      }
    }
  };

  const handleClose = () => {
    // Immediate camera stop - no delays
    stopCameraImmediate();

    // Call close callback immediately
    onCloseCamera?.();
  };

  const getCurrentCameraLabel = () => {
    if (availableCameras.length > 0 && availableCameras[currentCameraIndex]) {
      return availableCameras[currentCameraIndex].label;
    }
    return "Camera";
  };

  const getCurrentCameraFacingMode = () => {
    if (availableCameras.length > 0 && availableCameras[currentCameraIndex]) {
      return availableCameras[currentCameraIndex].facingMode;
    }
    return undefined;
  };

  if (!isOpen) {
    return null;
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white p-8">
        <div className="text-center max-w-md">
          <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-4">Camera Error</h3>
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={startCamera}
              variant="outline"
              className="bg-white/10 border-white/30 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="bg-white/10 border-white/30 text-white"
            >
              Close
            </Button>
          </div>

          {/* Camera info for debugging */}
          {availableCameras.length > 0 && (
            <div className="mt-6 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Available cameras:</p>
              {availableCameras.map((camera, index) => (
                <p key={camera.deviceId} className="text-xs text-gray-300">
                  {index + 1}. {camera.label}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen  h-full bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{
          transform:
            getCurrentCameraFacingMode() === "user" ? "scaleX(-1)" : "none",
        }}
      />

      {/* Camera Guide Overlay - Fixed positioning and sizing */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 py-20">
          {/* Guide Container with proper spacing */}
          <div className="relative flex flex-col items-center justify-center max-w-full max-h-full">
            {/* Guide text - positioned above frame */}
            <div className="mb-4 text-center">
              <p className="text-white text-sm sm:text-base font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                Position your paper solution here
              </p>
            </div>

            {/* Main guide square - responsive but not too large */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[26rem] xl:h-[26rem] border-2 border-white/80 rounded-lg relative flex-shrink-0">
              {/* Corner indicators */}
              <div className="absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>

              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-0.5 bg-white/60"></div>
                <div className="w-0.5 h-12 bg-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {/* Grid lines for better paper alignment */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical grid lines */}
                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/25"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/25"></div>
                {/* Horizontal grid lines */}
                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/25"></div>
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/25"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <div className="text-lg">Starting camera...</div>
          {availableCameras.length > 0 && (
            <div className="text-sm text-gray-300 mt-2">
              Loading {getCurrentCameraLabel()}
            </div>
          )}
        </div>
      )}

      {/* Top Controls */}
      {!isLoading && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Only show switch button if multiple cameras are available */}
          {hasMultipleCameras && (
            <Button
              variant="ghost"
              size="sm"
              onClick={switchCamera}
              className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0 backdrop-blur-sm"
              aria-label="Switch camera"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* Camera Info Indicator */}
      {!isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm max-w-xs truncate backdrop-blur-sm">
            {getCurrentCameraLabel()}
            {hasMultipleCameras && (
              <span className="ml-2 text-xs opacity-75">
                ({currentCameraIndex + 1}/{availableCameras.length})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls - Fixed positioning */}
      {!isLoading && (
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center justify-center mb-4">
            <Button
              onClick={capturePhoto}
              className="bg-white/90 text-black hover:bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0 border-4 border-white/50 backdrop-blur-sm shadow-lg"
              aria-label="Capture photo"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-2 border-gray-400" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-white text-sm sm:text-base font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm inline-block mb-2">
              Tap capture when ready
            </p>
            {hasMultipleCameras && (
              <p className="text-white text-sm sm:text-base font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm inline-block mb-2">
                Tap the rotate button to switch cameras
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
