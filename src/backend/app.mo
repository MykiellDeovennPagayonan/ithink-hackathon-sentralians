import Types "types";
import Users "models/users";
import Classrooms "models/classrooms";
import Problems "models/problems";
import Solutions "models/solutions";
import UserClassrooms "models/userClassrooms";
import Sessions "models/sessions";
import UserService "services/userService";
import ClassroomService "services/classroomService";
import ProblemService "services/problemService";
import SolutionService "services/solutionService";
import UserClassroomService "services/userClassroomService";
import EnhancedService "services/enhancedService";
import AuthService "services/authService";
import Result "mo:base/Result";

actor {
  stable let user_store = Users.init();
  stable let classroom_store = Classrooms.init();
  stable let problem_store = Problems.init();
  stable let solution_store = Solutions.init();
  stable let userClassroom_store = UserClassrooms.init();
  stable let session_store = Sessions.init();

  let user = Users.use(user_store);
  let classroom = Classrooms.use(classroom_store);
  let problem = Problems.use(problem_store);
  let solution = Solutions.use(solution_store);
  let userClassroom = UserClassrooms.use(userClassroom_store);
  let session = Sessions.use(session_store);

  let userService = UserService.init(user);
  let classroomService = ClassroomService.init(classroom);
  let problemService = ProblemService.init(problem);
  let solutionService = SolutionService.init(solution);
  let userClassroomService = UserClassroomService.init(userClassroom);
  let authService = AuthService.init(user, session);
  let enhancedService = EnhancedService.init(userClassroom, user, classroom, problem);

  public shared func createUser(userInput : Types.UserInput) : async Result.Result<Types.User, Text> {
    await userService.create(userInput);
  };

  public shared func getUserById(id : Text) : async ?Types.User {
    await userService.getById(id);
  };

  public shared func getUserByEmail(email : Text) : async ?Types.User {
    await userService.getByEmail(email);
  };

  public shared func updateUser(user : Types.User) : async Result.Result<(), Text> {
    await userService.update(user);
  };

  public shared func deleteUser(id : Text) : async Result.Result<(), Text> {
    await userService.delete(id);
  };

  public shared func createClassroom(classroomInput : Types.ClassroomInput) : async Result.Result<Types.Classroom, Text> {
    await classroomService.create(classroomInput);
  };

  public shared func getClassroomById(id : Text) : async ?Types.Classroom {
    await classroomService.getById(id);
  };

  public shared func getClassroomsByOwner(ownerId : Text) : async [Types.Classroom] {
    await classroomService.getByOwner(ownerId);
  };

  public shared func updateClassroom(classroom : Types.Classroom) : async Result.Result<(), Text> {
    await classroomService.update(classroom);
  };

  public shared func deleteClassroom(id : Text) : async Result.Result<(), Text> {
    await classroomService.delete(id);
  };

  public shared func createProblem(problemInput : Types.ProblemInput) : async Result.Result<Types.Problem, Text> {
    await problemService.create(problemInput);
  };

  public shared func getProblemById(id : Text) : async ?Types.Problem {
    await problemService.getById(id);
  };

  public shared func getProblemsByClassroom(classroomId : Text) : async [Types.Problem] {
    await problemService.getByClassroom(classroomId);
  };

  public shared func getPublicProblems() : async [Types.Problem] {
    await problemService.getPublicProblems();
  };

  public shared func updateProblem(problem : Types.Problem) : async Result.Result<(), Text> {
    await problemService.update(problem);
  };

  public shared func deleteProblem(id : Text) : async Result.Result<(), Text> {
    await problemService.delete(id);
  };

  public shared func getProblemsByCreator(creatorId : Text) : async [Types.Problem] {
    await problemService.getByCreator(creatorId);
  };

  public shared func submitSolution(solutionInput : Types.SolutionInput) : async Result.Result<Types.Solution, Text> {
    await solutionService.create(solutionInput);
  };

  public shared func getSolutionById(id : Text) : async ?Types.Solution {
    await solutionService.getById(id);
  };

  public shared func getSolutionsByProblem(problemId : Text) : async [Types.Solution] {
    await solutionService.getByProblem(problemId);
  };

  public shared func getSolutionsByUser(userId : Text) : async [Types.Solution] {
    await solutionService.getByUser(userId);
  };

  public shared func getCorrectSolutions(problemId : Text) : async [Types.Solution] {
    await solutionService.getCorrectSolutionsByProblem(problemId);
  };

  public shared func markSolutionAsCorrect(id : Text) : async Result.Result<(), Text> {
    await solutionService.markAsCorrect(id);
  };

  public shared func updateSolution(solution : Types.Solution) : async Result.Result<(), Text> {
    await solutionService.update(solution);
  };

  public shared func deleteSolution(id : Text) : async Result.Result<(), Text> {
    await solutionService.delete(id);
  };

  public shared func joinClassroom(userClassroomInput : Types.UserClassroomInput) : async Result.Result<Types.UserClassroom, Text> {
    await userClassroomService.joinClassroom(userClassroomInput);
  };

  public shared func leaveClassroom(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
    await userClassroomService.leaveClassroom(userId, classroomId);
  };

  public shared func getUserClassrooms(userId : Text) : async [EnhancedService.ClassroomWithMembership] {
    await enhancedService.getUserClassroomsWithDetails(userId);
  };

  public shared func getClassroomMembers(classroomId : Text) : async [EnhancedService.UserWithClassroom] {
    await enhancedService.getClassroomMembersWithDetails(classroomId);
  };

  public shared func getClassroomAdmins(classroomId : Text) : async [EnhancedService.UserWithClassroom] {
    await enhancedService.getClassroomAdminsWithDetails(classroomId);
  };

  public shared func makeUserAdmin(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
    await userClassroomService.makeAdmin(userId, classroomId);
  };

  public shared func removeUserAdmin(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
    await userClassroomService.removeAdmin(userId, classroomId);
  };

  public shared func isClassroomMember(userId : Text, classroomId : Text) : async Bool {
    await userClassroomService.isMember(userId, classroomId);
  };

  public shared func isClassroomAdmin(userId : Text, classroomId : Text) : async Bool {
    await userClassroomService.isAdmin(userId, classroomId);
  };

  public shared func register(email : Text, password : Text, salt : Text, username : Text) : async Result.Result<Types.User, Text> {
    await authService.register(email, password, salt, username);
  };

  public shared func login(credentials : Types.LoginCredentials) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
    await authService.login(credentials);
  };

  public shared func validateSession(token : Text) : async ?Types.User {
    await authService.validateSession(token);
  };

  public shared func logout(token : Text) : async Result.Result<(), Text> {
    await authService.logout(token);
  };

  public shared func getPasswordAndSalt(email : Text) : async ?{
    password : Text;
    salt : Text;
  } {
    await authService.getPasswordAndSalt(email);
  };

  public shared func getAllUserProblems(userId : Text) : async [EnhancedService.ProblemWithClassroom] {
    await enhancedService.getAllUserProblems(userId);
  };

  public shared func getProblemsByUserId(userId : Text) : async [Types.Problem] {
    await enhancedService.getProblemsByUserId(userId);
  };
};
