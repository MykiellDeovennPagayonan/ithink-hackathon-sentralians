import UserClassrooms "../models/userClassrooms";
import Users "../models/users";
import Classrooms "../models/classrooms";
import Problems "../models/problems";
import Types "../types";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";

module EnhancedService {
  public type UserWithClassroom = {
    user: Types.User;
    isAdmin: Bool;
    joinedAt: Time.Time;
  };

  public type ClassroomWithMembership = {
    classroom: Types.Classroom;
    isAdmin: Bool;
    joinedAt: Time.Time;
  };

  public type ProblemWithClassroom = {
    problem: Types.Problem;
    classroomName: ?Text;
  };

  public func init(
    userClassroomStore: UserClassrooms.Use,
    userStore: Users.Use,
    classroomStore: Classrooms.Use,
    problemStore: Problems.Use
  ) : {
    getClassroomMembersWithDetails: (Text) -> async [UserWithClassroom];
    getClassroomAdminsWithDetails: (Text) -> async [UserWithClassroom];
    getUserClassroomsWithDetails: (Text) -> async [ClassroomWithMembership];
    getAllUserProblems: (Text) -> async [ProblemWithClassroom];
    getProblemsByUserId: (Text) -> async [Types.Problem];
  } {
    return {
      getClassroomMembersWithDetails = func(classroomId: Text): async [UserWithClassroom] {
        let startKey = classroomId # "_";
        let endKey = classroomId # "_~";
        let memberships = userClassroomStore.classroom.find(startKey, endKey, #fwd, 100);
        let buffer = Buffer.Buffer<UserWithClassroom>(memberships.size());

        for (membership in memberships.vals()) {
          switch (userStore.pk.get(membership.userId)) {
            case (?user) {
              buffer.add({
                user = user;
                isAdmin = membership.isAdmin;
                joinedAt = membership.joinedAt;
              });
            };
            case null { /* do nothing */ };
          };
        };

        Buffer.toArray(buffer);
      };

      getClassroomAdminsWithDetails = func(classroomId: Text): async [UserWithClassroom] {
        let startKey = classroomId # "_";
        let endKey = classroomId # "_~";
        let memberships = userClassroomStore.classroom.find(startKey, endKey, #fwd, 100);
        let buffer = Buffer.Buffer<UserWithClassroom>(memberships.size());

        for (membership in memberships.vals()) {
          if (membership.isAdmin) {
            switch (userStore.pk.get(membership.userId)) {
              case (?user) {
                buffer.add({
                  user = user;
                  isAdmin = membership.isAdmin;
                  joinedAt = membership.joinedAt;
                });
              };
              case null { /* do nothing */ };
            };
          };
        };

        Buffer.toArray(buffer);
      };

      getUserClassroomsWithDetails = func(userId: Text): async [ClassroomWithMembership] {
        let startKey = userId # "_";
        let endKey = userId # "_~";
        let memberships = userClassroomStore.user.find(startKey, endKey, #fwd, 100);
        let buffer = Buffer.Buffer<ClassroomWithMembership>(memberships.size());

        for (membership in memberships.vals()) {
          switch (classroomStore.pk.get(membership.classroomId)) {
            case (?classroom) {
              buffer.add({
                classroom = classroom;
                isAdmin = membership.isAdmin;
                joinedAt = membership.joinedAt;
              });
            };
            case null { /* do nothing */ };
          };
        };

        Buffer.toArray(buffer);
      };

      getAllUserProblems = func(userId: Text): async [ProblemWithClassroom] {
        let buffer = Buffer.Buffer<ProblemWithClassroom>(50);

        let userProblemsStartKey = userId # "_";
        let userProblemsEndKey = userId # "_~";
        let userProblems = problemStore.creator.find(userProblemsStartKey, userProblemsEndKey, #fwd, 100);

        for (problem in userProblems.vals()) {
          let classroomName = switch (problem.classroomId) {
            case (?classId) {
              switch (classroomStore.pk.get(classId)) {
                case (?classroom) { ?classroom.name };
                case null { null };
              };
            };
            case null { null };
          };

          buffer.add({
            problem = problem;
            classroomName = classroomName;
          });
        };

        let userClassroomsStartKey = userId # "_";
        let userClassroomsEndKey = userId # "_~";
        let userClassrooms = userClassroomStore.user.find(userClassroomsStartKey, userClassroomsEndKey, #fwd, 100);

        for (membership in userClassrooms.vals()) {
          let classroomProblemsStartKey = membership.classroomId # "_";
          let classroomProblemsEndKey = membership.classroomId # "_~";
          let classroomProblems = problemStore.classroom.find(classroomProblemsStartKey, classroomProblemsEndKey, #fwd, 100);

          switch (classroomStore.pk.get(membership.classroomId)) {
            case (?classroom) {
              for (problem in classroomProblems.vals()) {
                if (problem.creatorId != userId) {
                  buffer.add({
                    problem = problem;
                    classroomName = ?classroom.name;
                  });
                };
              };
            };
            case null { /* do nothing */ };
          };
        };

        Buffer.toArray(buffer);
      };

      getProblemsByUserId = func(userId: Text): async [Types.Problem] {
        let startKey = userId # "_";
        let endKey = userId # "_~";
        problemStore.creator.find(startKey, endKey, #fwd, 100);
      };
    };
  };
}