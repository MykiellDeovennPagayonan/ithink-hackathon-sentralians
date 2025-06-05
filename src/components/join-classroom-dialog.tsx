"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { joinClassroom } from "@/services/classroom-service";
import { toast } from "sonner";

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
  userId,
}: JoinClassroomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinClassroom = async () => {
    if (!code.trim()) return;

    try {
      setIsLoading(true);
      await joinClassroom(userId, code);

      toast.success("Joined classroom successfully!");
      setCode("");
      setIsOpen(false);

      // Navigate to the classroom
      router.push(`/classroom?code=${code}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to join classroom");
      console.error("Error joining classroom:", error);
    } finally {
      setIsLoading(false);
    }
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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Classroom Code</Label>
            <Input
              id="code"
              placeholder="Enter classroom code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinClassroom}
            disabled={!code.trim() || isLoading}
          >
            {isLoading ? "Joining..." : "Join Classroom"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
