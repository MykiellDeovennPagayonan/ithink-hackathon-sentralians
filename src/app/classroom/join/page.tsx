/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  School,
} from "lucide-react";

import LoadingSpinner from "@/components/loading-spinner";
import { useGetCurrentUser } from "@/services/auth-service";
import { joinClassroom, getClassroomById } from "@/services/classroom-service";
import ClassroomDetail from "@/components/classroom-detail";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Classroom } from "@/declarations/backend/backend.did";

// Add import for DebugState at the top of the file
import DebugState from "@/components/debug-state";

export default function JoinClassroomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  const { user, loading: authLoading } = useGetCurrentUser();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinState, setJoinState] = useState<
    "idle" | "joining" | "success" | "already_member" | "error"
  >("idle");
  const [joinMessage, setJoinMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(5);
  const [processingComplete, setProcessingComplete] = useState(false);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Effect to handle classroom loading
  useEffect(() => {
    let isMounted = true;

    const loadClassroom = async () => {
      // Skip if no code provided
      if (!code) {
        if (isMounted) {
          setError("No classroom code provided");
          setLoading(false);
        }
        return;
      }

      try {
        console.log("Fetching classroom:", code);
        const classroomData = await getClassroomById(code);

        if (isMounted) {
          setClassroom(classroomData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching classroom:", err);
        if (isMounted) {
          setError("Classroom not found");
          setLoading(false);
        }
      }
    };

    loadClassroom();

    return () => {
      isMounted = false;
    };
  }, [code]);

  // Update the useEffect to use this function
  useEffect(() => {
    // Only proceed if:
    // 1. We have a classroom
    // 2. User is authenticated
    // 3. We haven't started joining yet
    // 4. We haven't completed processing
    if (!classroom || !user || joinState !== "idle" || processingComplete) {
      return;
    }

    const attemptJoinInEffect = async () => {
      setJoinState("joining");

      try {
        console.log("Attempting to join classroom:", code);
        const result = await joinClassroom(user.id, code);

        console.log("Join result:", result);

        if (result.success) {
          if (result.isAlreadyMember) {
            toast.info(result.message);
            setJoinState("already_member");
            setJoinMessage(result.message);
          } else {
            toast.success(result.message);
            setJoinState("success");
            setJoinMessage(result.message);
          }
          setProcessingComplete(true);
        } else {
          toast.error("Failed to join classroom");
          setJoinState("error");
          setJoinMessage("Failed to join classroom");
          setProcessingComplete(true);
        }
      } catch (err: any) {
        console.error("Join error:", err);
        const errorMessage = err?.message || "Failed to join classroom";

        toast.error(errorMessage);
        setJoinState("error");
        setJoinMessage(errorMessage);
        setProcessingComplete(true);
      }
    };

    attemptJoinInEffect();
  }, [classroom, user, joinState, processingComplete, code]);

  // Separate effect for countdown to avoid loops
  useEffect(() => {
    if (
      joinState !== "success" &&
      joinState !== "already_member" &&
      joinState !== "error"
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        // Redirect when countdown reaches 0
        if (joinState === "success" || joinState === "already_member") {
          router.push(`/classroom?code=${code}`);
        } else {
          router.push("/classroom");
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, joinState, router, code]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4 animate-pulse">
              {loading ? "Loading classroom..." : "Checking authentication..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Classroom Error</CardTitle>
            <CardDescription className="text-base">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                The classroom you&apos;re trying to join doesn&apos;t exist or
                you don&apos;t have permission to access it.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push("/classroom")}
              className="w-full"
            >
              Return to Classrooms
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (joinState === "joining") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4 animate-pulse">
              Joining classroom...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    joinState === "success" ||
    joinState === "already_member" ||
    joinState === "error"
  ) {
    const isSuccess = joinState === "success" || joinState === "already_member";

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <AlertCircle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle
              className={isSuccess ? "text-green-700" : "text-destructive"}
            >
              {isSuccess ? "Success!" : "Error"}
            </CardTitle>
            <CardDescription className="text-base">
              {joinMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <ArrowRight className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                Redirecting in
                <Badge variant="secondary" className="ml-1">
                  {countdown}s
                </Badge>
              </AlertDescription>
            </Alert>
            <Button
              onClick={() =>
                router.push(
                  isSuccess ? `/classroom?code=${code}` : "/classroom"
                )
              }
              className="w-full"
              variant={isSuccess ? "default" : "secondary"}
            >
              {isSuccess ? "Go to Classroom Now" : "Return to Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <LogIn className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-destructive">
              Authentication Required
            </CardTitle>
            <CardDescription>
              You must be logged in to join a classroom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only render ClassroomDetail if we have a valid classroom and we're not in the join flow
  if (classroom && processingComplete) {
    return <ClassroomDetail code={code} />;
  }

  // Debug component - only visible in development
  const debugData = {
    code,
    authLoading,
    loading,
    joinState,
    processingComplete,
    hasClassroom: !!classroom,
    hasUser: !!user,
    error,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle>Join Classroom</CardTitle>
          <CardDescription>
            {classroom
              ? `You're about to join "${classroom.name}"`
              : "Loading classroom details..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {classroom && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Classroom:</strong> {classroom.name}
              </p>
              <p className="text-sm text-blue-600">{classroom.description}</p>
            </div>
          )}
          <Button
            onClick={() => {
              setJoinState("joining");
              const attemptJoin = async () => {
                if (isMountedRef.current) setJoinState("joining");

                try {
                  console.log("Attempting to join classroom:", code);
                  const result = await joinClassroom(user.id, code);

                  if (isMountedRef.current) {
                    if (result.isAlreadyMember) {
                      toast.info(result.message);
                      setJoinState("already_member");
                      setJoinMessage(result.message);
                    } else {
                      toast.success(result.message);
                      setJoinState("success");
                      setJoinMessage(result.message);
                    }
                    setProcessingComplete(true);
                  }
                } catch (err: any) {
                  console.error("Join error:", err);
                  const errorMessage =
                    err?.message || "Failed to join classroom";

                  if (isMountedRef.current) {
                    toast.error(errorMessage);
                    setJoinState("error");
                    setJoinMessage(errorMessage);
                    setProcessingComplete(true);
                  }
                }
              };
              attemptJoin();
            }}
            className="w-full"
          >
            Join Classroom
          </Button>
        </CardContent>
      </Card>

      <DebugState data={debugData} title="Join Classroom Debug" />
    </div>
  );
}
