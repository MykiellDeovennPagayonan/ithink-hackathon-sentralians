"use client";
import CreateClassroomDialog from "./create-classroom-dialog";
import JoinClassroomDialog from "./join-classroom-dialog";

export default function ClassroomActions({ userId }: { userId: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <JoinClassroomDialog buttonVariant="outline" userId={userId} />
      <CreateClassroomDialog userId={userId} />
    </div>
  );
}
