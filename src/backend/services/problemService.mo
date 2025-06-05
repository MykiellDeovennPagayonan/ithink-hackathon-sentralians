import Problems "../models/problems";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";

module ProblemService {
  public func init(store : Problems.Use) : {
    create             : (Types.ProblemInput) -> async Result.Result<Types.Problem, Text>;
    getById            : (Text) -> async ?Types.Problem;
    getByClassroom     : (Text) -> async [Types.Problem];
    getPublicProblems  : () -> async [Types.Problem];
    update             : (Types.Problem) -> async Result.Result<(), Text>;
    delete             : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(problemInput : Types.ProblemInput) : async Result.Result<Types.Problem, Text> {
        await createImpl(problemInput, store);
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

  private func createImpl(problemInput : Types.ProblemInput, store : Problems.Use) : async Result.Result<Types.Problem, Text> {
    // Generate or use provided ID
    let problemId = switch (problemInput.id) {
      case (?providedId) {
        // Check if provided ID already exists
        switch (store.pk.get(providedId)) {
          case (?_) { return #err("Problem ID already exists") };
          case null providedId;
        };
      };
      case null {
        await IdGen.generateProblemId(store);
      };
    };

    // Create full problem object with generated fields
    let problem : Types.Problem = {
      id = problemId;
      title = problemInput.title;
      description = problemInput.description;
      imageUrl = problemInput.imageUrl;
      classroomId = problemInput.classroomId;
      isPublic = problemInput.isPublic;
      createdAt = Time.now();
    };

    store.db.insert(problem);
    #ok(problem);
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