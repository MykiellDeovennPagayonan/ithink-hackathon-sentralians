"use client";

import { UserWithClassroom } from "@/declarations/backend/backend.did";
import {
  getClassroomMembersWithUserInfo,
} from "@/services/classroom-service";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// Create a client component that uses useSearchParams
function ClassroomContent() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserWithClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [classroomId, setClassroomId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get("id");
    setClassroomId(id || undefined);

    if (id) {
      getClassroomMembersWithUserInfo(id)
        .then((fetchedUsers) => {
          setUsers(fetchedUsers);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching classroom members:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!classroomId) {
    return <p>Classroom ID is required</p>;
  }

  return (
    <div>
      <p>ClassroomId: {classroomId}</p>
      {users.map((user, index) => (
        <div key={index}>
          <p>Joined At: {user.joinedAt.toString()}</p>
          <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}

// Main page component that wraps ClassroomContent in Suspense
export default function Page() {
  return (
    <Suspense fallback={<p>Loading classroom data...</p>}>
      <ClassroomContent />
    </Suspense>
  );
}
