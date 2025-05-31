import Users "../models/users";
import Types "../types";
import Result "mo:base/Result";

module UserService {
  public func init(store : Users.Use) : {
    create : (Types.User) -> async Result.Result<(), Text>;
    getById : (Text) -> async ?Types.User;
    getByEmail : (Text) -> async ?Types.User;
    update : (Types.User) -> async Result.Result<(), Text>;
    delete : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(user : Types.User) : async Result.Result<(), Text> {
        await createImpl(user, store);
      };
      getById = func(id : Text) : async ?Types.User {
        store.pk.get(id);
      };
      getByEmail = func(email : Text) : async ?Types.User {
        store.email.get(email);
      };
      update = func(user : Types.User) : async Result.Result<(), Text> {
        await updateImpl(user, store);
      };
      delete = func(id : Text) : async Result.Result<(), Text> {
        store.pk.delete(id);
        return #ok;
      };
    };
  };

  private func createImpl(user : Types.User, store : Users.Use) : async Result.Result<(), Text> {
    let existing = store.email.get(user.email);
    switch (existing) {
      case (?_) { return #err("Email already in use") };
      case null {
        store.db.insert(user);
        return #ok;
      };
    };
  };

  private func updateImpl(user : Types.User, store : Users.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(user.id);
    switch (existing) {
      case (?_) {
        store.db.insert(user);
        return #ok;
      };
      case null { return #err("User not found") };
    };
  };
};