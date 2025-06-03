"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ImageUploader from "./image-uploader";

interface SolutionSubmissionProps {
  onSubmit?: (imageData: string) => Promise<void>;
  className?: string;
}

export default function SolutionSubmission({
  onSubmit,
  className = "",
}: SolutionSubmissionProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentImage || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(currentImage);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`flex-1 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">
          Submit Your Solution
        </CardTitle>
        <p className="text-gray-600 text-xs sm:text-sm">
          Upload a photo of your handwritten solution or take a picture with
          your camera
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
        <ImageUploader onImageSelected={setCurrentImage} className="flex-1" />

        {/* Submit Button */}
        <Button
          className="h-10 sm:h-12 text-sm sm:text-lg"
          disabled={!currentImage || isSubmitting}
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
  );
}
