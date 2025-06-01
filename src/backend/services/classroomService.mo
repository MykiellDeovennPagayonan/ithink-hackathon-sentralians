import Classrooms "../models/classrooms";
import Types "../types";
import Result "mo:base/Result";

module ClassroomService {
  public func init(store : Classrooms.Use) : {
    create   : (Types.Classroom) -> async Result.Result<(), Text>;
    getById  : (Text) -> async ?Types.Classroom;
    getByOwner : (Text) -> async [Types.Classroom];
    update   : (Types.Classroom) -> async Result.Result<(), Text>;
    delete   : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(classroom : Types.Classroom) : async Result.Result<(), Text> {
        await createImpl(classroom, store);
      };
      getById = func(id : Text) : async ?Types.Classroom {
        store.pk.get(id);
      };
      getByOwner = func(ownerId : Text) : async [Types.Classroom] {
        store.owner.find(ownerId, ownerId, #fwd, 100)
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

  private func createImpl(classroom : Types.Classroom, store : Classrooms.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(classroom.id);
    switch (existing) {
      case (?_) { #err("Classroom ID already exists") };
      case null {
        store.db.insert(classroom);
        #ok
      };
    };
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
