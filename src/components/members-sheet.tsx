"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import MembersList from "./members-list";
import {
  UserWithClassroom,
  Classroom,
} from "@/declarations/backend/backend.did";

interface MembersSheetProps {
  members: UserWithClassroom[];
  classroom: Classroom;
  isAdmin: boolean;
}

export default function MembersSheet({
  members,
  classroom,
  isAdmin,
}: MembersSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Users className="w-4 h-4 mr-2" />
          View Members ({members.length})
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Classroom Members
          </SheetTitle>
          <p className="text-sm text-gray-600">{members.length} members</p>
        </SheetHeader>
        <div className="mt-6">
          <MembersList
            members={members}
            classroom={classroom}
            isAdmin={isAdmin}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
