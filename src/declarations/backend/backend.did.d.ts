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
export interface LoginCredentials { 'password' : string, 'email' : string }
export interface Problem {
  'id' : string,
  'classroomId' : [] | [string],
  'title' : string,
  'createdAt' : Time,
  'description' : string,
  'imageUrl' : [] | [string],
  'isPublic' : boolean,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : User } |
  { 'err' : string };
export type Result_2 = { 'ok' : { 'user' : User, 'sessionToken' : string } } |
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
export interface _SERVICE {
  'createClassroom' : ActorMethod<[Classroom], Result>,
  'createProblem' : ActorMethod<[Problem], Result>,
  'createUser' : ActorMethod<[User], Result>,
  'deleteClassroom' : ActorMethod<[string], Result>,
  'deleteProblem' : ActorMethod<[string], Result>,
  'deleteSolution' : ActorMethod<[string], Result>,
  'deleteUser' : ActorMethod<[string], Result>,
  'getClassroomAdmins' : ActorMethod<[string], Array<UserClassroom>>,
  'getClassroomById' : ActorMethod<[string], [] | [Classroom]>,
  'getClassroomMembers' : ActorMethod<[string], Array<UserClassroom>>,
  'getClassroomsByOwner' : ActorMethod<[string], Array<Classroom>>,
  'getCorrectSolutions' : ActorMethod<[string], Array<Solution>>,
  'getPasswordAndSalt' : ActorMethod<
    [string],
    [] | [{ 'password' : string, 'salt' : string }]
  >,
  'getProblemById' : ActorMethod<[string], [] | [Problem]>,
  'getProblemsByClassroom' : ActorMethod<[string], Array<Problem>>,
  'getPublicProblems' : ActorMethod<[], Array<Problem>>,
  'getSolutionById' : ActorMethod<[string], [] | [Solution]>,
  'getSolutionsByProblem' : ActorMethod<[string], Array<Solution>>,
  'getSolutionsByUser' : ActorMethod<[string], Array<Solution>>,
  'getUserByEmail' : ActorMethod<[string], [] | [User]>,
  'getUserById' : ActorMethod<[string], [] | [User]>,
  'getUserClassrooms' : ActorMethod<[string], Array<UserClassroom>>,
  'isClassroomAdmin' : ActorMethod<[string, string], boolean>,
  'isClassroomMember' : ActorMethod<[string, string], boolean>,
  'joinClassroom' : ActorMethod<[string, string, boolean], Result>,
  'leaveClassroom' : ActorMethod<[string, string], Result>,
  'login' : ActorMethod<[LoginCredentials], Result_2>,
  'logout' : ActorMethod<[string], Result>,
  'makeUserAdmin' : ActorMethod<[string, string], Result>,
  'markSolutionAsCorrect' : ActorMethod<[string], Result>,
  'register' : ActorMethod<[string, string, string, string], Result_1>,
  'removeUserAdmin' : ActorMethod<[string, string], Result>,
  'submitSolution' : ActorMethod<[Solution], Result>,
  'updateClassroom' : ActorMethod<[Classroom], Result>,
  'updateProblem' : ActorMethod<[Problem], Result>,
  'updateSolution' : ActorMethod<[Solution], Result>,
  'updateUser' : ActorMethod<[User], Result>,
  'validateSession' : ActorMethod<[string], [] | [User]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
