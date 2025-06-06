import UserClassrooms "../models/userClassrooms";
import Types "../types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Time "mo:base/Time";

module UserClassroomService {
  public func init(store : UserClassrooms.Use) : {
    joinClassroom        : (Types.UserClassroomInput) -> async Result.Result<Types.UserClassroom, Text>;
    leaveClassroom       : (Text, Text) -> async Result.Result<(), Text>;
    getUserClassroomsByUser    : (Text) -> async [Types.UserClassroom];
    getUserClassroomsByClassroom : (Text) -> async [Types.UserClassroom];
    getClassroomAdmins   : (Text) -> async [Types.UserClassroom];
    makeAdmin            : (Text, Text) -> async Result.Result<(), Text>;
    removeAdmin          : (Text, Text) -> async Result.Result<(), Text>;
    isMember             : (Text, Text) -> async Bool;
    isAdmin              : (Text, Text) -> async Bool;
  } {
    return {
      joinClassroom = func(userClassroomInput : Types.UserClassroomInput) : async Result.Result<Types.UserClassroom, Text> {
        await joinClassroomImpl(userClassroomInput, store);
      };

      leaveClassroom = func(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
        let key = userId # "#" # classroomId;
        let existing = store.pk.get(key);
        switch (existing) {
          case (?_) {
            store.pk.delete(key);
            #ok
          };
          case null { #err("User is not a member of this classroom") };
        };
      };

      getUserClassroomsByUser = func(userId : Text) : async [Types.UserClassroom] {
        let startKey = userId # "_";
        let endKey = userId # "_~";
        store.user.find(startKey, endKey, #fwd, 100);
      };

      getUserClassroomsByClassroom = func(classroomId : Text) : async [Types.UserClassroom] {
        let startKey = classroomId # "_";
        let endKey = classroomId # "_~";
        store.classroom.find(startKey, endKey, #fwd, 100);
      };

      getClassroomAdmins = func(classroomId : Text) : async [Types.UserClassroom] {
        let members = store.classroom.find(classroomId, classroomId, #fwd, 100);
        Array.filter<Types.UserClassroom>(members, func(m) { m.isAdmin });
      };

      makeAdmin = func(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
        await updateAdminStatus(userId, classroomId, true, store);
      };

      removeAdmin = func(userId : Text, classroomId : Text) : async Result.Result<(), Text> {
        await updateAdminStatus(userId, classroomId, false, store);
      };

      isMember = func(userId : Text, classroomId : Text) : async Bool {
        let key = userId # "#" # classroomId;
        switch (store.pk.get(key)) {
          case (?_) { true };
          case null { false };
        };
      };

      isAdmin = func(userId : Text, classroomId : Text) : async Bool {
        let key = userId # "#" # classroomId;
        switch (store.pk.get(key)) {
          case (?membership) { membership.isAdmin };
          case null { false };
        };
      };
    };
  };

  private func joinClassroomImpl(userClassroomInput : Types.UserClassroomInput, store : UserClassrooms.Use) : async Result.Result<Types.UserClassroom, Text> {
    let key = userClassroomInput.userId # "#" # userClassroomInput.classroomId;
    let existing = store.pk.get(key);
    switch (existing) {
      case (?_) { #err("User is already a member of this classroom") };
      case null {
        let membership : Types.UserClassroom = {
          userId      = userClassroomInput.userId;
          classroomId = userClassroomInput.classroomId;
          isAdmin     = userClassroomInput.isAdmin;
          joinedAt    = Time.now();
        };
        store.db.insert(membership);
        #ok(membership);
      };
    };
  };

  private func updateAdminStatus(userId : Text, classroomId : Text, isAdminFlag : Bool, store : UserClassrooms.Use) : async Result.Result<(), Text> {
    let key = userId # "#" # classroomId;
    let existing = store.pk.get(key);
    switch (existing) {
      case (?membership) {
        let updated : Types.UserClassroom = {
          userId      = membership.userId;
          classroomId = membership.classroomId;
          isAdmin     = isAdminFlag;
          joinedAt    = membership.joinedAt;
        };
        store.db.insert(updated);
        #ok
      };
      case null { #err("User is not a member of this classroom") };
    };
  };
}