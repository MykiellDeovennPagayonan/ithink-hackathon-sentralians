"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";
import InlineMathEditor from "@/components/inline-math-editor";
import ProblemDescriptionRenderer from "@/components/problem-description-renderer";
import {
  ProblemFormData,
  problemFormSchema,
} from "@/schemas/problem-form-schema";
import { createProblem } from "@/services/problem-service";
import { useAuth } from "@/contexts/AuthContext";
import UploadImage from "./UploadImage";
// import { toast } from "@/components/ui/use-toast";

export default function ManualProblemForm() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const classroomIdFromQuery = searchParams.get("classroomId");

  const form = useForm<ProblemFormData>({
    resolver: zodResolver(problemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      classroomId: classroomIdFromQuery || "",
      isPublic: !classroomIdFromQuery,
    },
  });

  useEffect(() => {
    const currentClassroomId = searchParams.get("classroomId");
    if (currentClassroomId !== form.getValues("classroomId")) {
      form.setValue("classroomId", currentClassroomId || "");
      form.setValue("isPublic", !currentClassroomId);
    }
  }, [searchParams, form]);


  const handleSubmit = async (data: ProblemFormData) => {
    if (authLoading) {
      // toast({
      //   title: "Authentication in progress",
      //   description: "Please wait until authentication is complete.",
      //   variant: "destructive",
      // });
      return;
    }

    if (!user?.id) {
      // toast({
      //   title: "Authentication Required",
      //   description: "You need to be logged in to create a problem.",
      //   variant: "destructive",
      // });
      return;
    }

    try {
      setIsSubmitting(true);

      const finalClassroomId = classroomIdFromQuery || data.classroomId || null;

      const problemData = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        classroomId: finalClassroomId,
        isPublic: finalClassroomId ? data.isPublic : true,
      };

      console.log("Creating problem manually:", problemData);
      await createProblem(problemData, user.id);

      // toast({
      //   title: "Problem Created! 🎉",
      //   description: "Your new math problem has been successfully created.",
      // });
      if (finalClassroomId) {
        router.push(`/classrooms/${finalClassroomId}`);
      } else {
        router.push("/explore");
      }
    } catch (error) {
      console.error("Failed to create problem:", error);
      // toast({
      //   title: "Uh oh! Something went wrong.",
      //   description:
      //     error instanceof Error
      //       ? error.message
      //       : "Failed to create problem. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedDescription = form.watch("description");
  const watchedClassroomId = form.watch("classroomId");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a descriptive title for your problem"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Problem Description</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
              </FormLabel>
              <FormControl>
                <div className="min-h-[300px]">
                  {isPreviewMode ? (
                    <div className="border rounded-lg p-4 bg-background min-h-[300px]">
                      <ProblemDescriptionRenderer
                        content={watchedDescription || ""}
                      />
                    </div>
                  ) : (
                    <InlineMathEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start typing your problem description. Use Ctrl+M to add math expressions inline."
                      className="min-h-[300px]"
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Write your problem description with inline math editing. Click
                anywhere to edit text, use Ctrl+M for math expressions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Image (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <UploadImage
                    onUploadComplete={(url) => field.onChange(url)}
                    initialImageUrl={field.value || ""}
                    showCamera={false}
                    showDropZone={true}
                    placeholder="Drop your problem image here"
                    minHeight="min-h-[150px]"
                    uploadButtonText="Upload Problem Image"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Add an optional image to accompany your problem. You can either paste a URL or upload an image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {classroomIdFromQuery && (
          <FormField
            control={form.control}
            name="classroomId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Classroom ID (Contextual)</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormDescription>
                  This problem will be associated with the current classroom.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {watchedClassroomId || classroomIdFromQuery
                    ? "Visible within Classroom & Publicly"
                    : "Public Problem"}
                </FormLabel>
                <FormDescription>
                  {watchedClassroomId || classroomIdFromQuery
                    ? "If toggled on, this problem will be visible to everyone in the explore section, in addition to your classroom. If off, only classroom members see it."
                    : "Make this problem visible to all users in the explore section."}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || authLoading}>
            {isSubmitting ? "Creating..." : "Create Problem"}
          </Button>
        </div>
      </form>
    </Form>
  );
}