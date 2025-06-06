import Solutions "../models/solutions";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Time "mo:base/Time";

module SolutionService {
  public func init(store : Solutions.Use) : {
    create                     : (Types.SolutionInput) -> async Result.Result<Types.Solution, Text>;
    getById                    : (Text) -> async ?Types.Solution;
    getSolutionsByProblem : (Text) -> async [Types.Solution];
    getSolutionsByUser    : (Text) -> async [Types.Solution];
    getCorrectSolutionsByProblem : (Text) -> async [Types.Solution];
    markAsCorrect              : (Text) -> async Result.Result<(), Text>;
    update                     : (Types.Solution) -> async Result.Result<(), Text>;
    delete                     : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(solutionInput : Types.SolutionInput) : async Result.Result<Types.Solution, Text> {
        await createImpl(solutionInput, store);
      };
      getById = func(id : Text) : async ?Types.Solution {
        store.pk.get(id);
      };
      getSolutionsByProblem = func(problemId : Text) : async [Types.Solution] {
        let startKey = problemId # "_";
        let endKey = problemId # "_~";
        store.problem.find(startKey, endKey, #fwd, 100);
      };
      getSolutionsByUser = func(userId : Text) : async [Types.Solution] {
        let startKey = userId # "_";
        let endKey = userId # "_~";
        store.user.find(startKey, endKey, #fwd, 100);
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

  private func createImpl(solutionInput : Types.SolutionInput, store : Solutions.Use) : async Result.Result<Types.Solution, Text> {
    let solutionId = switch (solutionInput.id) {
      case (?providedId) {
        switch (store.pk.get(providedId)) {
          case (?_) { return #err("Solution ID already exists") };
          case null providedId;
        };
      };
      case null {
        await IdGen.generateSolutionId(store);
      };
    };

    let solution : Types.Solution = {
      id = solutionId;
      problemId = solutionInput.problemId;
      userId = solutionInput.userId;
      imageUrl = solutionInput.imageUrl;
      isCorrect = solutionInput.isCorrect;
      notes = solutionInput.notes;
      submittedAt = Time.now();
    };

    store.db.insert(solution);
    #ok(solution);
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