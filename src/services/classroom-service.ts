import { backend } from "@/declarations/backend";
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
    const classroomId = `classroom_${Date.now()}`;
    const classroom = {
      id: classroomId,
      name,
      description,
      ownerId: userId,
      createdAt: BigInt(Date.now()),
    };

    const result = await backend.createClassroom(classroom);

    if ("err" in result) {
      throw new Error(result.err);
    }

    await backend.joinClassroom("current_user_id", classroomId, true);

    return classroomId;
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

    const result = await backend.joinClassroom(userId, classroomId, false);

    if ("err" in result) {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
    throw error;
  }
}

export async function getUserClassrooms(classroomId: string) {
  try {
    const classrooms = await backend.getUserClassrooms(classroomId);
    return classrooms.map((classroom) => ({
      classroomId: classroom.classroomId,
      userId: classroom.userId,
      joinedAt: convertBigIntToDate(classroom.joinedAt),
      isAdmin: classroom.isAdmin,
    }));
  } catch (error) {
    console.error("Error fetching user classrooms:", error);
    throw error;
  }
}

export async function getUserClassroomsWithDetails(
  userId: string
): Promise<Classroom[]> {
  try {
    const userClassrooms = await getUserClassrooms(userId);

    const classroomPromises = userClassrooms.map(async (membership) => {
      const classroomDetails = await getClassroomById(membership.classroomId);
      return classroomDetails;
    });

    return await Promise.all(classroomPromises);
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

    return members.map((member) => ({
      userId: member.userId,
      classroomId: member.classroomId,
      joinedAt: convertBigIntToDate(member.joinedAt),
      isAdmin: member.isAdmin,
    }));
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
): Promise<ClassroomMemberWithUserInfo[]> {
  try {
    const members = await getClassroomMembers(classroomId);
    const userInfoPromises = members.map(async (member) => {
      const userInfo = await backend.getUserById(member.userId);
      if (userInfo.length === 0) {
        throw new Error(
          `User information not found for user ID: ${member.userId}`
        );
      }
      return {
        ...member,
        email: userInfo[0].email,
        username: userInfo[0].username,
      };
    });

    return Promise.all(userInfoPromises);
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
    const userMember = members.find((member) => member.userId === userId);
    return userMember ? userMember.isAdmin : false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw error;
  }
}
