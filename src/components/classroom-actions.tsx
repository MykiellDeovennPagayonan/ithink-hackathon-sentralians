"use client";
import CreateClassroomDialog from "./create-classroom-dialog";
import JoinClassroomDialog from "./join-classroom-dialog";

export default function ClassroomActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <JoinClassroomDialog buttonVariant="outline" />
      <CreateClassroomDialog />
    </div>
  );
}
