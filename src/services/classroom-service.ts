import { backend } from "@/declarations/backend";
import {
  ClassroomInput,
  ClassroomWithMembership,
  UserClassroom,
  UserClassroomInput,
  UserWithClassroom,
} from "@/declarations/backend/backend.did";

export interface JoinClassroomResult {
  success: boolean;
  message: string;
  isAlreadyMember?: boolean;
}

export async function createClassroom(
  name: string,
  description: string,
  userId: string
): Promise<string> {
  try {
    const classroom: ClassroomInput = {
      id: [],
      name,
      description,
      ownerId: userId,
    };

    const result = await backend.createClassroom(classroom);

    if ("err" in result) {
      throw new Error(result.err);
    }

    const joinClassroomInput: UserClassroomInput = {
      classroomId: result.ok.id,
      userId,
      isAdmin: true,
    };

    await backend.joinClassroom(joinClassroomInput);

    return result.ok.id;
  } catch (error) {
    console.error("Error creating classroom:", error);
    throw error;
  }
}

export async function joinClassroom(
  userId: string,
  classroomId: string,
  isAdmin: boolean = false
): Promise<JoinClassroomResult> {
  try {
    console.log("Attempting to join classroom:", {
      userId,
      classroomId,
      isAdmin,
    });

    // First check if classroom exists
    const classroomResult = await backend.getClassroomById(classroomId);
    if (classroomResult.length === 0) {
      throw new Error("CLASSROOM_NOT_FOUND");
    }

    const joinClassroomInput: UserClassroomInput = {
      classroomId,
      userId,
      isAdmin: isAdmin,
    };

    const result = await backend.joinClassroom(joinClassroomInput);

    if ("err" in result) {
      // Handle specific backend error messages
      const errorMessage = result.err.toLowerCase();

      // Check if this is an "already a member" error
      if (errorMessage.includes("already") && errorMessage.includes("member")) {
        console.log("User is already a member, treating as success");
        return {
          success: true,
          message: "You're already a member of this classroom",
          isAlreadyMember: true,
        };
      }

      if (errorMessage.includes("full") || errorMessage.includes("capacity")) {
        throw new Error(
          "This classroom has reached its maximum capacity. Please contact the instructor."
        );
      }

      if (
        errorMessage.includes("permission") ||
        errorMessage.includes("access")
      ) {
        throw new Error(
          "You don't have permission to join this classroom. Please contact the instructor."
        );
      }

      if (
        errorMessage.includes("closed") ||
        errorMessage.includes("inactive")
      ) {
        throw new Error("This classroom is no longer accepting new members.");
      }

      // Generic backend error
      throw new Error(`Unable to join classroom: ${result.err}`);
    }

    // Success case - user successfully joined
    console.log("Successfully joined classroom");
    return {
      success: true,
      message: "Successfully joined the classroom!",
      isAlreadyMember: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error joining classroom:", error);

    // Check if this is the "already a member" error thrown as an exception
    if (
      error.message &&
      error.message.toLowerCase().includes("already") &&
      error.message.toLowerCase().includes("member")
    ) {
      console.log("Caught 'already a member' exception, treating as success");
      return {
        success: true,
        message: "You're already a member of this classroom",
        isAlreadyMember: true,
      };
    }

    // Handle specific error types we threw above
    if (error.message === "CLASSROOM_NOT_FOUND") {
      throw new Error(
        "The classroom you're trying to join doesn't exist. Please check the classroom code."
      );
    }

    // Handle network/connection errors
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }

    // Handle backend/canister errors
    if (error.message.includes("canister")) {
      throw new Error(
        "The classroom service is temporarily unavailable. Please try again in a few moments."
      );
    }

    // Handle authentication errors
    if (
      error.message.includes("unauthorized") ||
      error.message.includes("authentication")
    ) {
      throw new Error(
        "Your session has expired. Please log in again and try joining the classroom."
      );
    }

    // If it's already a custom error message, re-throw it
    if (
      error.message.includes("classroom") ||
      error.message.includes("permission") ||
      error.message.includes("capacity")
    ) {
      throw error;
    }

    // Generic error fallback
    throw new Error(
      "Failed to join classroom. Please try again or contact support if the problem persists."
    );
  }
}

// export async function getUserClassrooms(classroomId: string) {
//   try {
//     const classrooms = await backend.getUserClassrooms(classroomId);
//     return classrooms.map((classroom) => ({
//       classroomId: classroom.classroomId,
//       userId: classroom.userId,
//       joinedAt: convertBigIntToDate(classroom.joinedAt),
//       isAdmin: classroom.isAdmin,
//     }));
//   } catch (error) {
//     console.error("Error fetching user classrooms:", error);
//     throw error;
//   }
// }

export async function getUserClassroomsWithDetails(
  userId: string
): Promise<ClassroomWithMembership[]> {
  try {
    const userClassrooms = await backend.getUserClassrooms(userId);

    return userClassrooms;
  } catch (error) {
    console.error("Error fetching user classrooms with details:", error);
    throw error;
  }
}

export async function getClassroomsByOwner(userId: string) {
  try {
    const classrooms = await backend.getClassroomsByOwner(userId);
    return classrooms.map((classroom) => ({
      ...classroom,
      createdAt: classroom.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching classrooms by owner:", error);
    throw error;
  }
}

export async function getClassroomById(classroomId: string) {
  try {
    const classroomResult = await backend.getClassroomById(classroomId);
    if (classroomResult.length === 0) {
      throw new Error("Classroom not found");
    }
    const classroom = classroomResult[0];
    return {
      ...classroom,
      createdAt: classroom.createdAt,
    };
  } catch (error) {
    console.error("Error fetching classroom:", error);
    throw error;
  }
}

export async function getClassroomMembers(classroomId: string) {
  try {
    const members = await backend.getClassroomMembers(classroomId);

    return members;
  } catch (error) {
    console.error("Error fetching classroom members:", error);
    throw error;
  }
}

export interface ClassroomMemberWithUserInfo extends UserClassroom {
  email: string;
  username: string;
}

export async function getClassroomMembersWithUserInfo(
  classroomId: string
): Promise<UserWithClassroom[]> {
  try {
    const members = await getClassroomMembers(classroomId);

    return members;
  } catch (error) {
    console.error("Error fetching classroom members with user info:", error);
    throw error;
  }
}

export async function getProblemsByClassroom(classroomId: string) {
  try {
    const problems = await backend.getProblemsByClassroom(classroomId);
    return problems.map((problem) => ({
      ...problem,
      createdAt: problem.createdAt,
      classroomId: problem.classroomId,
      imageUrl: problem.imageUrl,
    }));
  } catch (error) {
    console.error("Error fetching classroom problems:", error);
    throw error;
  }
}

export async function isUserClassroomAdmin(
  userId: string,
  classroomId: string
): Promise<boolean> {
  try {
    const members = await backend.getClassroomMembers(classroomId);
    const userMember = members.find((member) => member.user.id === userId);
    return userMember ? userMember.isAdmin : false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw error;
  }
}
