"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import InlineMathEditor from "@/components/inline-math-editor";
import ProblemDescriptionRenderer from "@/components/problem-description-renderer";
import {
  ProblemFormData,
  problemFormSchema,
} from "@/schemas/problem-form-schema";
import { createProblem } from "@/services/problem-service";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateProblemPage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  const form = useForm<ProblemFormData>({
    resolver: zodResolver(problemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      classroomId: "",
      isPublic: true,
    },
  });

  const handleSubmit = async (data: ProblemFormData) => {
    try {
      setIsSubmitting(true);

      const problemData = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        classroomId: null,
        isPublic: data.isPublic,
      };

      console.log("Creating problem:", problemData);

      if (user?.id && !loading) {
        await createProblem(problemData, user?.id)
      } else {
        // something to say that they need to login
      }

      router.push("/explore");
    } catch (error) {
      console.error("Failed to create problem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedDescription = form.watch("description");

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Problem</CardTitle>
          <CardDescription>
            Create a new math problem with our inline editor. Seamlessly mix
            text and mathematical expressions in the same flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                          <div className="border rounded-lg p-4 bg-white min-h-[300px]">
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
                      Write your problem description with inline math editing.
                      Click anywhere to edit text, use Ctrl+M for math
                      expressions, and seamlessly switch between text and
                      mathematical content.
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
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add an optional image to accompany your problem
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Public Problem
                      </FormLabel>
                      <FormDescription>
                        Make this problem visible to all users in the explore
                        section
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

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Problem"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
