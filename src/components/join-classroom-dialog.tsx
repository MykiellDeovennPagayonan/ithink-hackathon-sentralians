"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Define Zod schema
const joinClassroomSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Classroom code is required")
    .max(50, "Code cannot exceed 50 characters"),
});

type JoinClassroomFormValues = z.infer<typeof joinClassroomSchema>;

interface JoinClassroomDialogProps {
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  userId: string;
}

export default function JoinClassroomDialog({
  buttonVariant = "default",
}: JoinClassroomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<JoinClassroomFormValues>({
    resolver: zodResolver(joinClassroomSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleNavigateToJoinPage = async (values: JoinClassroomFormValues) => {
    setIsLoading(true);
    router.push(`/classroom/join?code=${values.code}`);
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Users className="mr-2 h-4 w-4" />
          Join Classroom
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Classroom</DialogTitle>
          <DialogDescription>
            Enter the classroom code provided by your teacher to join.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNavigateToJoinPage)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="code">Classroom Code</Label>
                  <FormControl>
                    <Input
                      id="code"
                      placeholder="Enter classroom code..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Classroom"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
