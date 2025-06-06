import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import MembersList from "./members-list";
import {
  UserWithClassroom,
  Classroom,
} from "@/declarations/backend/backend.did";
import { useState } from "react";
import { toast } from "sonner";

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
  const [copied, setCopied] = useState(false);

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/classroom/join?code=${classroom.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    toast("Link copied!", {
      description: "Classroom invite link copied to clipboard",
      duration: 2000,
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="h-fit sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Classroom Members</CardTitle>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={copyInviteLink}>
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy Invite Link"}
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
