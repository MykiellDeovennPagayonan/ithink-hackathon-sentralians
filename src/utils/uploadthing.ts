import { generateReactHelpers } from "@uploadthing/react";
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for file:", file.url);
    }),
} satisfies FileRouter;

export const { useUploadThing } = generateReactHelpers<typeof ourFileRouter>({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploadthing`
});
