"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, Users } from "lucide-react";
import {
  Classroom,
  ClassroomMemberWithUserInfo,
} from "@/services/classroom-service";

interface MembersListProps {
  members: ClassroomMemberWithUserInfo[];
  classroom: Classroom;
  isAdmin: boolean;
}

export default function MembersList({ members, classroom }: MembersListProps) {
  const [admins, setAdmins] = useState<ClassroomMemberWithUserInfo[]>([]);
  const [students, setStudents] = useState<ClassroomMemberWithUserInfo[]>([]);

  useEffect(() => {
    // In a real app, you'd have admin status in the members data
    // For now, just assume the owner is the only admin
    const adminUsers = members.filter(
      (member) => member.userId === classroom.ownerId
    );
    const studentUsers = members.filter(
      (member) => member.userId !== classroom.ownerId
    );

    setAdmins(adminUsers);
    setStudents(studentUsers);
  }, [members, classroom]);

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-3">
      {admins.length > 0 && (
        <>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-yellow-500" />
              {admins.length === 1 ? "Teacher" : "Teachers"}
            </h3>
            {admins.map((admin) => (
              <div
                key={admin.userId}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors"
              >
                <Avatar className="h-10 w-10 border-2 border-blue-200 flex-shrink-0">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={admin.username}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {getInitials(admin.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {admin.username}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-xs flex-shrink-0"
                    >
                      Owner
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {admin.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Separator />
        </>
      )}

      {students.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Students ({students.length})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.userId}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={student.username}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {getInitials(student.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {student.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {student.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
