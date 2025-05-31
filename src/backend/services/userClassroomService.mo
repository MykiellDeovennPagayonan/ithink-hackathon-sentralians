import UserClassrooms "../models/userClassrooms";
import Types "../types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Time "mo:base/Time";

module UserClassroomService {
  public func init(store : UserClassrooms.Use) : {
    joinClassroom        : (Text, Text, Bool) -> async Result.Result<(), Text>;
    leaveClassroom       : (Text, Text) -> async Result.Result<(), Text>;
    getUserClassrooms    : (Text) -> async [Types.UserClassroom];
    getClassroomMembers  : (Text) -> async [Types.UserClassroom];
    getClassroomAdmins   : (Text) -> async [Types.UserClassroom];
    makeAdmin            : (Text, Text) -> async Result.Result<(), Text>;
    removeAdmin          : (Text, Text) -> async Result.Result<(), Text>;
    isMember             : (Text, Text) -> async Bool;
    isAdmin              : (Text, Text) -> async Bool;
  } {
    return {
      joinClassroom = func(userId : Text, classroomId : Text, isAdmin : Bool) : async Result.Result<(), Text> {
        await joinClassroomImpl(userId, classroomId, isAdmin, store);
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

      getUserClassrooms = func(userId : Text) : async [Types.UserClassroom] {
        store.user.find(userId, userId, #fwd, 100)
      };

      getClassroomMembers = func(classroomId : Text) : async [Types.UserClassroom] {
        store.classroom.find(classroomId, classroomId, #fwd, 100)
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

  private func joinClassroomImpl(userId : Text, classroomId : Text, isAdmin : Bool, store : UserClassrooms.Use) : async Result.Result<(), Text> {
    let key = userId # "#" # classroomId;
    let existing = store.pk.get(key);
    switch (existing) {
      case (?_) { #err("User is already a member of this classroom") };
      case null {
        let membership : Types.UserClassroom = {
          userId      = userId;
          classroomId = classroomId;
          isAdmin     = isAdmin;
          joinedAt    = Time.now();
        };
        store.db.insert(membership);
        #ok
      };
    };
  };

  private func updateAdminStatus(userId : Text, classroomId : Text, isAdminFlag : Bool, store : UserClassrooms.Use) : async Result.Result<(), Text> {
    let key = userId # "#" # classroomId;
    let existing = store.pk.get(key);
    switch (existing) {
      case (?membership) {
        // Reconstruct the UserClassroom record explicitly:
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
