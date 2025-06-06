import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import MembersList from "./members-list";
import {
  UserWithClassroom,
  Classroom,
} from "@/declarations/backend/backend.did";

interface MembersCardProps {
  members: UserWithClassroom[];
  classroom: Classroom;
  isAdmin: boolean;
}

export default function MembersCard({
  members,
  classroom,
  isAdmin,
}: MembersCardProps) {
  return (
    <Card className="h-fit sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Classroom Members</CardTitle>
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/classroom/invite?code=${classroom.id}`}>
                <Users className="w-4 h-4 mr-2" />
                Invite
              </a>
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">{members.length} members</p>
      </CardHeader>
      <CardContent>
        <MembersList
          members={members}
          classroom={classroom}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  );
}
