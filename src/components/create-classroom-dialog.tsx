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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createClassroom } from "@/services/classroom-service";
import { toast } from "sonner";

export default function CreateClassroomDialog({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateClassroom = async () => {
    if (!userId) {
      toast.error("You must be logged in to create a classroom");
      return;
    }
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const classroomId = await createClassroom(name, description, userId);

      toast.success(`Classroom "${name}" created successfully!`);
      setName("");
      setDescription("");
      setIsOpen(false);

      // Navigate to the new classroom
      router.push(`/classroom?code=${classroomId}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to create classroom");
      console.error("Error creating classroom:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Classroom
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Classroom</DialogTitle>
          <DialogDescription>
            Create a new classroom to share problems and collaborate with
            students.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Classroom Name</Label>
            <Input
              id="name"
              placeholder="Enter classroom name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this classroom is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            onClick={handleCreateClassroom}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create Classroom"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
