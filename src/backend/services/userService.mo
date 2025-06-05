import Users "../models/users";
import Types "../types";
import Result "mo:base/Result";
import Time "mo:base/Time";
import IdGen "../utils/idGen";

module UserService {
  public func init(store : Users.Use) : {
    create : (Types.UserInput) -> async Result.Result<Types.User, Text>;
    getById : (Text) -> async ?Types.User;
    getByEmail : (Text) -> async ?Types.User;
    update : (Types.User) -> async Result.Result<(), Text>;
    delete : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(userInput : Types.UserInput) : async Result.Result<Types.User, Text> {
        await createImpl(userInput, store);
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

  private func createImpl(userInput : Types.UserInput, store : Users.Use) : async Result.Result<Types.User, Text> {
    let existing = store.email.get(userInput.email);
    switch (existing) {
      case (?_) { return #err("Email already in use") };
      case null {
        let userId = switch (userInput.id) {
          case (?providedId) {
            switch (store.pk.get(providedId)) {
              case (?_) { return #err("User ID already exists") };
              case null providedId;
            };
          };
          case null {
            await IdGen.generateUserId(store);
          };
        };

        let user : Types.User = {
          id = userId;
          email = userInput.email;
          password = userInput.password;
          salt = userInput.salt;
          username = userInput.username;
          createdAt = Time.now();
        };

        store.db.insert(user);
        return #ok(user);
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
