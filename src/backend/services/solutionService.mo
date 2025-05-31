import Solutions "../models/solutions";
import Types "../types";
import Result "mo:base/Result";
import Array "mo:base/Array";

module SolutionService {
  public func init(store : Solutions.Use) : {
    create                     : (Types.Solution) -> async Result.Result<(), Text>;
    getById                    : (Text) -> async ?Types.Solution;
    getByProblem               : (Text) -> async [Types.Solution];
    getByUser                  : (Text) -> async [Types.Solution];
    getCorrectSolutionsByProblem : (Text) -> async [Types.Solution];
    markAsCorrect              : (Text) -> async Result.Result<(), Text>;
    update                     : (Types.Solution) -> async Result.Result<(), Text>;
    delete                     : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(solution : Types.Solution) : async Result.Result<(), Text> {
        await createImpl(solution, store);
      };
      getById = func(id : Text) : async ?Types.Solution {
        store.pk.get(id);
      };
      getByProblem = func(problemId : Text) : async [Types.Solution] {
        store.problem.find(problemId, problemId, #fwd, 100);
      };
      getByUser = func(userId : Text) : async [Types.Solution] {
        store.user.find(userId, userId, #fwd, 100);
      };
      getCorrectSolutionsByProblem = func(problemId : Text) : async [Types.Solution] {
        let allForProblem = store.problem.find(problemId, problemId, #fwd, 100);
        Array.filter<Types.Solution>(allForProblem, func(s) { s.isCorrect });
      };
      markAsCorrect = func(id : Text) : async Result.Result<(), Text> {
        await markAsCorrectImpl(id, store);
      };
      update = func(solution : Types.Solution) : async Result.Result<(), Text> {
        await updateImpl(solution, store);
      };
      delete = func(id : Text) : async Result.Result<(), Text> {
        let existing = store.pk.get(id);
        switch (existing) {
          case (?_) {
            store.pk.delete(id);
            #ok
          };
          case null { #err("Solution not found") };
        };
      };
    };
  };

  private func createImpl(solution : Types.Solution, store : Solutions.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(solution.id);
    switch (existing) {
      case (?_) { #err("Solution ID already exists") };
      case null {
        store.db.insert(solution);
        #ok
      };
    };
  };

  private func markAsCorrectImpl(id : Text, store : Solutions.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(id);
    switch (existing) {
      case (?sol) {
        let updatedSolution : Types.Solution = {
          id          = sol.id;
          problemId   = sol.problemId;
          userId      = sol.userId;
          imageUrl    = sol.imageUrl;
          isCorrect   = true;
          notes       = sol.notes;
          submittedAt = sol.submittedAt;
        };
        store.db.insert(updatedSolution);
        #ok
      };
      case null { #err("Solution not found") };
    };
  };

  private func updateImpl(solution : Types.Solution, store : Solutions.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(solution.id);
    switch (existing) {
      case (?_) {
        store.db.insert(solution);
        #ok
      };
      case null { #err("Solution not found") };
    };
  };
}
