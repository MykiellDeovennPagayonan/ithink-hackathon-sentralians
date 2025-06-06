import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Classroom {
  'id' : string,
  'ownerId' : string,
  'name' : string,
  'createdAt' : Time,
  'description' : string,
}
export interface ClassroomInput {
  'id' : [] | [string],
  'ownerId' : string,
  'name' : string,
  'description' : string,
}
export interface ClassroomWithMembership {
  'joinedAt' : Time,
  'isAdmin' : boolean,
  'classroom' : Classroom,
}
export interface LoginCredentials { 'password' : string, 'email' : string }
export interface Problem {
  'id' : string,
  'classroomId' : [] | [string],
  'title' : string,
  'createdAt' : Time,
  'creatorId' : string,
  'description' : string,
  'imageUrl' : [] | [string],
  'isPublic' : boolean,
}
export interface ProblemInput {
  'id' : [] | [string],
  'classroomId' : [] | [string],
  'title' : string,
  'creatorId' : string,
  'description' : string,
  'imageUrl' : [] | [string],
  'isPublic' : boolean,
}
export interface ProblemWithClassroom {
  'classroomName' : [] | [string],
  'problem' : Problem,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Solution } |
  { 'err' : string };
export type Result_2 = { 'ok' : User } |
  { 'err' : string };
export type Result_3 = { 'ok' : { 'user' : User, 'sessionToken' : string } } |
  { 'err' : string };
export type Result_4 = { 'ok' : UserClassroom } |
  { 'err' : string };
export type Result_5 = { 'ok' : Problem } |
  { 'err' : string };
export type Result_6 = { 'ok' : Classroom } |
  { 'err' : string };
export interface Solution {
  'id' : string,
  'userId' : string,
  'submittedAt' : Time,
  'isCorrect' : boolean,
  'problemId' : string,
  'imageUrl' : string,
  'notes' : string,
}
export interface SolutionInput {
  'id' : [] | [string],
  'userId' : string,
  'isCorrect' : boolean,
  'problemId' : string,
  'imageUrl' : string,
  'notes' : string,
}
export type Time = bigint;
export interface User {
  'id' : string,
  'username' : string,
  'password' : string,
  'createdAt' : Time,
  'salt' : string,
  'email' : string,
}
export interface UserClassroom {
  'classroomId' : string,
  'userId' : string,
  'joinedAt' : Time,
  'isAdmin' : boolean,
}
export interface UserClassroomInput {
  'classroomId' : string,
  'userId' : string,
  'isAdmin' : boolean,
}
export interface UserInput {
  'id' : [] | [string],
  'username' : string,
  'password' : string,
  'salt' : string,
  'email' : string,
}
export interface UserWithClassroom {
  'joinedAt' : Time,
  'user' : User,
  'isAdmin' : boolean,
}
export interface _SERVICE {
  'createClassroom' : ActorMethod<[ClassroomInput], Result_6>,
  'createProblem' : ActorMethod<[ProblemInput], Result_5>,
  'createUser' : ActorMethod<[UserInput], Result_2>,
  'deleteClassroom' : ActorMethod<[string], Result>,
  'deleteProblem' : ActorMethod<[string], Result>,
  'deleteSolution' : ActorMethod<[string], Result>,
  'deleteUser' : ActorMethod<[string], Result>,
  'getAllUserProblems' : ActorMethod<[string], Array<ProblemWithClassroom>>,
  'getClassroomAdmins' : ActorMethod<[string], Array<UserWithClassroom>>,
  'getClassroomById' : ActorMethod<[string], [] | [Classroom]>,
  'getClassroomMembers' : ActorMethod<[string], Array<UserWithClassroom>>,
  'getClassroomsByOwner' : ActorMethod<[string], Array<Classroom>>,
  'getCorrectSolutions' : ActorMethod<[string], Array<Solution>>,
  'getPasswordAndSalt' : ActorMethod<
    [string],
    [] | [{ 'password' : string, 'salt' : string }]
  >,
  'getProblemById' : ActorMethod<[string], [] | [Problem]>,
  'getProblemsByClassroom' : ActorMethod<[string], Array<Problem>>,
  'getProblemsByCreator' : ActorMethod<[string], Array<Problem>>,
  'getProblemsByUserId' : ActorMethod<[string], Array<Problem>>,
  'getPublicProblems' : ActorMethod<[], Array<Problem>>,
  'getSolutionById' : ActorMethod<[string], [] | [Solution]>,
  'getSolutionsByProblem' : ActorMethod<[string], Array<Solution>>,
  'getSolutionsByUser' : ActorMethod<[string], Array<Solution>>,
  'getUserByEmail' : ActorMethod<[string], [] | [User]>,
  'getUserById' : ActorMethod<[string], [] | [User]>,
  'getUserClassrooms' : ActorMethod<[string], Array<ClassroomWithMembership>>,
  'isClassroomAdmin' : ActorMethod<[string, string], boolean>,
  'isClassroomMember' : ActorMethod<[string, string], boolean>,
  'joinClassroom' : ActorMethod<[UserClassroomInput], Result_4>,
  'leaveClassroom' : ActorMethod<[string, string], Result>,
  'login' : ActorMethod<[LoginCredentials], Result_3>,
  'logout' : ActorMethod<[string], Result>,
  'makeUserAdmin' : ActorMethod<[string, string], Result>,
  'markSolutionAsCorrect' : ActorMethod<[string], Result>,
  'register' : ActorMethod<[string, string, string, string], Result_2>,
  'removeUserAdmin' : ActorMethod<[string, string], Result>,
  'submitSolution' : ActorMethod<[SolutionInput], Result_1>,
  'updateClassroom' : ActorMethod<[Classroom], Result>,
  'updateProblem' : ActorMethod<[Problem], Result>,
  'updateSolution' : ActorMethod<[Solution], Result>,
  'updateUser' : ActorMethod<[User], Result>,
  'validateSession' : ActorMethod<[string], [] | [User]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
