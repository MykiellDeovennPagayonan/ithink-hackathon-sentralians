import Problems "../models/problems";
import Types "../types";
import Result "mo:base/Result";

module ProblemService {
  public func init(store : Problems.Use) : {
    create             : (Types.Problem) -> async Result.Result<(), Text>;
    getById            : (Text) -> async ?Types.Problem;
    getByClassroom     : (Text) -> async [Types.Problem];
    getPublicProblems  : () -> async [Types.Problem];
    update             : (Types.Problem) -> async Result.Result<(), Text>;
    delete             : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(problem : Types.Problem) : async Result.Result<(), Text> {
        await createImpl(problem, store);
      };

      getById = func(id : Text) : async ?Types.Problem {
        store.pk.get(id);
      };

      getByClassroom = func(classroomId : Text) : async [Types.Problem] {
        store.classroom.find(classroomId, classroomId, #fwd, 100)
      };

      getPublicProblems = func() : async [Types.Problem] {
        store.isPublic.find("true", "true", #fwd, 100)
      };

      update = func(problem : Types.Problem) : async Result.Result<(), Text> {
        await updateImpl(problem, store);
      };

      delete = func(id : Text) : async Result.Result<(), Text> {
        let existing = store.pk.get(id);
        switch (existing) {
          case (?_) {
            store.pk.delete(id);
            #ok
          };
          case null {
            #err("Problem not found")
          };
        };
      };
    };
  };

  private func createImpl(problem : Types.Problem, store : Problems.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(problem.id);
    switch (existing) {
      case (?_) { #err("Problem ID already exists") };
      case null {
        store.db.insert(problem);
        #ok
      };
    };
  };

  private func updateImpl(problem : Types.Problem, store : Problems.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(problem.id);
    switch (existing) {
      case (?_) {
        store.db.insert(problem);
        #ok
      };
      case null {
        #err("Problem not found")
      };
    };
  };
}
