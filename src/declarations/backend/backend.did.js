export const idlFactory = ({ IDL }) => {
  const ClassroomInput = IDL.Record({
    'id' : IDL.Opt(IDL.Text),
    'ownerId' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Time = IDL.Int;
  const Classroom = IDL.Record({
    'id' : IDL.Text,
    'ownerId' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
  });
  const Result_6 = IDL.Variant({ 'ok' : Classroom, 'err' : IDL.Text });
  const ProblemInput = IDL.Record({
    'id' : IDL.Opt(IDL.Text),
    'classroomId' : IDL.Opt(IDL.Text),
    'title' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Opt(IDL.Text),
    'isPublic' : IDL.Bool,
  });
  const Problem = IDL.Record({
    'id' : IDL.Text,
    'classroomId' : IDL.Opt(IDL.Text),
    'title' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
    'imageUrl' : IDL.Opt(IDL.Text),
    'isPublic' : IDL.Bool,
  });
  const Result_5 = IDL.Variant({ 'ok' : Problem, 'err' : IDL.Text });
  const UserInput = IDL.Record({
    'id' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'password' : IDL.Text,
    'salt' : IDL.Text,
    'email' : IDL.Text,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'username' : IDL.Text,
    'password' : IDL.Text,
    'createdAt' : Time,
    'salt' : IDL.Text,
    'email' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const UserClassroom = IDL.Record({
    'classroomId' : IDL.Text,
    'userId' : IDL.Text,
    'joinedAt' : Time,
    'isAdmin' : IDL.Bool,
  });
  const Solution = IDL.Record({
    'id' : IDL.Text,
    'userId' : IDL.Text,
    'submittedAt' : Time,
    'isCorrect' : IDL.Bool,
    'problemId' : IDL.Text,
    'imageUrl' : IDL.Text,
    'notes' : IDL.Text,
  });
  const UserClassroomInput = IDL.Record({
    'classroomId' : IDL.Text,
    'userId' : IDL.Text,
    'isAdmin' : IDL.Bool,
  });
  const Result_4 = IDL.Variant({ 'ok' : UserClassroom, 'err' : IDL.Text });
  const LoginCredentials = IDL.Record({
    'password' : IDL.Text,
    'email' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Record({ 'user' : User, 'sessionToken' : IDL.Text }),
    'err' : IDL.Text,
  });
  const SolutionInput = IDL.Record({
    'id' : IDL.Opt(IDL.Text),
    'userId' : IDL.Text,
    'isCorrect' : IDL.Bool,
    'problemId' : IDL.Text,
    'imageUrl' : IDL.Text,
    'notes' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Solution, 'err' : IDL.Text });
  return IDL.Service({
    'createClassroom' : IDL.Func([ClassroomInput], [Result_6], []),
    'createProblem' : IDL.Func([ProblemInput], [Result_5], []),
    'createUser' : IDL.Func([UserInput], [Result_2], []),
    'deleteClassroom' : IDL.Func([IDL.Text], [Result], []),
    'deleteProblem' : IDL.Func([IDL.Text], [Result], []),
    'deleteSolution' : IDL.Func([IDL.Text], [Result], []),
    'deleteUser' : IDL.Func([IDL.Text], [Result], []),
    'getClassroomAdmins' : IDL.Func([IDL.Text], [IDL.Vec(UserClassroom)], []),
    'getClassroomById' : IDL.Func([IDL.Text], [IDL.Opt(Classroom)], []),
    'getClassroomMembers' : IDL.Func([IDL.Text], [IDL.Vec(UserClassroom)], []),
    'getClassroomsByOwner' : IDL.Func([IDL.Text], [IDL.Vec(Classroom)], []),
    'getCorrectSolutions' : IDL.Func([IDL.Text], [IDL.Vec(Solution)], []),
    'getPasswordAndSalt' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Record({ 'password' : IDL.Text, 'salt' : IDL.Text }))],
        [],
      ),
    'getProblemById' : IDL.Func([IDL.Text], [IDL.Opt(Problem)], []),
    'getProblemsByClassroom' : IDL.Func([IDL.Text], [IDL.Vec(Problem)], []),
    'getPublicProblems' : IDL.Func([], [IDL.Vec(Problem)], []),
    'getSolutionById' : IDL.Func([IDL.Text], [IDL.Opt(Solution)], []),
    'getSolutionsByProblem' : IDL.Func([IDL.Text], [IDL.Vec(Solution)], []),
    'getSolutionsByUser' : IDL.Func([IDL.Text], [IDL.Vec(Solution)], []),
    'getUserByEmail' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'getUserById' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'getUserClassrooms' : IDL.Func([IDL.Text], [IDL.Vec(UserClassroom)], []),
    'isClassroomAdmin' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'isClassroomMember' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'joinClassroom' : IDL.Func([UserClassroomInput], [Result_4], []),
    'leaveClassroom' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'login' : IDL.Func([LoginCredentials], [Result_3], []),
    'logout' : IDL.Func([IDL.Text], [Result], []),
    'makeUserAdmin' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'markSolutionAsCorrect' : IDL.Func([IDL.Text], [Result], []),
    'register' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'removeUserAdmin' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'submitSolution' : IDL.Func([SolutionInput], [Result_1], []),
    'updateClassroom' : IDL.Func([Classroom], [Result], []),
    'updateProblem' : IDL.Func([Problem], [Result], []),
    'updateSolution' : IDL.Func([Solution], [Result], []),
    'updateUser' : IDL.Func([User], [Result], []),
    'validateSession' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
  });
};
export const init = ({ IDL }) => { return []; };
