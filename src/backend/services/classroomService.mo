import Classrooms "../models/classrooms";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";

module ClassroomService {
  public func init(store : Classrooms.Use) : {
    create   : (Types.ClassroomInput) -> async Result.Result<Types.Classroom, Text>;
    getById  : (Text) -> async ?Types.Classroom;
    getClassroomsByOwner : (Text) -> async [Types.Classroom];
    update   : (Types.Classroom) -> async Result.Result<(), Text>;
    delete   : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(classroomInput : Types.ClassroomInput) : async Result.Result<Types.Classroom, Text> {
        await createImpl(classroomInput, store);
      };
      getById = func(id : Text) : async ?Types.Classroom {
        store.pk.get(id);
      };
      getClassroomsByOwner = func(ownerId : Text) : async [Types.Classroom] {
        let startKey = ownerId # "_";
        let endKey = ownerId # "_~";
        store.owner.find(startKey, endKey, #fwd, 100);
      };
      update = func(classroom : Types.Classroom) : async Result.Result<(), Text> {
        await updateImpl(classroom, store);
      };
      delete = func(id : Text) : async Result.Result<(), Text> {
        let existing = store.pk.get(id);
        switch (existing) {
          case (?_) {
            store.pk.delete(id);
            #ok
          };
          case null { #err("Classroom not found") };
        };
      };
    };
  };

  private func createImpl(classroomInput : Types.ClassroomInput, store : Classrooms.Use) : async Result.Result<Types.Classroom, Text> {
    let classroomId = switch (classroomInput.id) {
      case (?providedId) {
        switch (store.pk.get(providedId)) {
          case (?_) { return #err("Classroom ID already exists") };
          case null providedId;
        };
      };
      case null {
        await IdGen.generateClassroomId(store);
      };
    };

    let classroom : Types.Classroom = {
      id = classroomId;
      name = classroomInput.name;
      description = classroomInput.description;
      ownerId = classroomInput.ownerId;
      createdAt = Time.now();
    };

    store.db.insert(classroom);
    #ok(classroom);
  };

  private func updateImpl(classroom : Types.Classroom, store : Classrooms.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(classroom.id);
    switch (existing) {
      case (?_) {
        store.db.insert(classroom);
        #ok
      };
      case null { #err("Classroom not found") };
    };
  };
}