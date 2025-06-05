import { backend } from "@/declarations/backend";
import {
  ClassroomInput,
  ClassroomWithMembership,
  UserClassroomInput,
  UserWithClassroom,
} from "@/declarations/backend/backend.did";
import { unwrapOpt } from "@/utils/candid";
import { convertBigIntToDate } from "@/utils/convertBigIntToDate";

export interface UserClassroom {
  classroomId: string;
  userId: string;
  joinedAt: Date;
  isAdmin: boolean;
}

export interface Classroom {
  id: string;
  ownerId: string;
  name: string;
  createdAt: Date;
  description: string;
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
  classroomId: string
): Promise<void> {
  try {
    const classroomResult = await backend.getClassroomById(classroomId);
    if (classroomResult.length === 0) {
      throw new Error("Classroom not found");
    }

    const joinClassroomInput: UserClassroomInput = {
      classroomId,
      userId,
      isAdmin: false,
    };

    const result = await backend.joinClassroom(joinClassroomInput);

    if ("err" in result) {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
    throw error;
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
    const userClassrooms = await backend.getUserClassrooms(userId)

    return userClassrooms
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
      createdAt: convertBigIntToDate(classroom.createdAt),
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
      createdAt: convertBigIntToDate(classroom.createdAt),
    };
  } catch (error) {
    console.error("Error fetching classroom:", error);
    throw error;
  }
}

export async function getClassroomMembers(classroomId: string) {
  try {
    const members = await backend.getClassroomMembers(classroomId);

    return members
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

    return members
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
      createdAt: convertBigIntToDate(problem.createdAt),
      classroomId: unwrapOpt(problem.classroomId),
      imageUrl: unwrapOpt(problem.imageUrl),
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
