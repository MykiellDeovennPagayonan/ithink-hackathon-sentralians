"use client";

import { generateUploadButton } from "@uploadthing/react";

const UploadButton = generateUploadButton({
  url: "http://localhost:3000/api/uploadthing", 
});

export default function Uploader() {
  return (
    <UploadButton
      endpoint="imageUploader"
      className="bg-black w-40 h-40"
      onClientUploadComplete={(res) => {
        console.log("Upload completed", res);
      }}
      onUploadError={(error) => {
        console.error("Upload error", error);
      }}
    />
  );
}
