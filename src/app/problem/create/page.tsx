"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus, Pi } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualProblemForm from "@/components/ManualProblemForm";
import AiProblemGeneratorForm from "@/components/AIProblemGeneratorForm";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetCurrentUser } from "@/services/auth-service";

export default function CreateProblemPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useGetCurrentUser();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4">
              Checking authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required message if user is not logged in
  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Pi className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-base">
              You need to be logged in to create problems. Please sign in to
              continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Creating problems allows you to share math challenges with
                others and track their progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                <Button asChild className="flex-1">
                  <Link href="/motoko-login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/motoko-register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                What you can do after logging in:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create problems manually with our rich editor</li>
                <li>• Generate problems automatically with AI</li>
                <li>• Add images and LaTeX math expressions</li>
                <li>• Organize problems in classrooms</li>
                <li>• Track others submissions and progress</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the create problem form if user is authenticated
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Problem</CardTitle>
          <CardDescription>
            Choose your method: create a problem manually with our rich editor,
            or generate one with AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manually Create</TabsTrigger>
              <TabsTrigger value="ai">Generate with AI</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <ManualProblemForm />
            </TabsContent>
            <TabsContent value="ai">
              <AiProblemGeneratorForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
