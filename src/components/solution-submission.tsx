"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, LogIn, UserPlus } from "lucide-react";
import ImageUploader from "./image-uploader";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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

  const { user } = useAuth();

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
          {user
            ? "Upload a photo of your handwritten solution or take a picture with your camera"
            : "Authentication required to submit solutions"}
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 sm:space-y-6">
        <ImageUploader
          onImageSelected={setCurrentImage}
          className="flex-1"
          disabled={!user}
        />

        {!user ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">Authentication Required</p>
              <p className="text-blue-700 text-xs sm:text-sm">
                Please log in or create an account to submit your solution. This
                helps us track your progress and save your work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/motoko-login" className="w-full">
                <Button variant="default" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              </Link>

              <Link href="/motoko-register" className="w-full">
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
