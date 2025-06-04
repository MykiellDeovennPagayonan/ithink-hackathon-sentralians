"use client"

import SubmissionArea from "@/components/SubmissionArea";

export default function MyHomeworkPage() {
  const handleUploadStart = () => {
    console.log("User started uploading...");
  };
  const handleUploadComplete = (url: string) => {
    console.log("Image successfully uploaded to:", url);
  };
  const handleUploadError = () => {
    console.log("Upload failed. Let user retry.");
  };
  const handleSubmitSolution = (imageUrl: string | null) => {
    console.log("submitting", imageUrl)
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SubmissionArea
        onUploadStart={handleUploadStart}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onSubmit={handleSubmitSolution}
      />
    </div>
  );
}
