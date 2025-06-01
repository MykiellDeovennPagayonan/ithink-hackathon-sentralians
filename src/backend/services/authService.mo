import Users "../models/users";
import Sessions "../models/sessions";
import Types "../types";
import Crypto "../utils/crypto";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";

module AuthService {
  public func init(userStore : Users.Use, sessionStore : Sessions.Use) : {
    register : (Text, Text, Text, Text) -> async Result.Result<Types.User, Text>;
    login : (Types.LoginCredentials) -> async Result.Result<{ user : Types.User; sessionToken : Text }, Text>;
    validateSession : (Text) -> async ?Types.User;
    logout : (Text) -> async Result.Result<(), Text>;
    getPasswordAndSalt : (Text) -> async ?{
      password : Text;
      salt : Text;
    };
  } {
    return {
      register = func(email : Text, password : Text, salt : Text, username : Text) : async Result.Result<Types.User, Text> {
        await registerImpl(email, password, salt, username, userStore);
      };
      login = func(credentials : Types.LoginCredentials) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
        await loginImpl(credentials, userStore, sessionStore);
      };
      validateSession = func(token : Text) : async ?Types.User {
        await validateSessionImpl(token, sessionStore, userStore);
      };
      logout = func(token : Text) : async Result.Result<(), Text> {
        await logoutImpl(token, sessionStore);
      };
      getPasswordAndSalt = func(email : Text) : async ?{
        password : Text;
        salt : Text;
      } {
        await getPasswordAndSalt(email, userStore);
      };
    };
  };

  private func getPasswordAndSalt(email : Text, userStore : Users.Use) : async ?{
    password : Text;
    salt : Text;
  } {
    let maybeUser = userStore.email.get(email);

    switch (maybeUser) {
      case (null) {
        null;
      };
      case (?u) {
        ?{ password = u.password; salt = u.salt };
      };
    };
  };

  private func registerImpl(email : Text, hashedPassword : Text, salt : Text, username : Text, userStore : Users.Use) : async Result.Result<Types.User, Text> {
    let existing = userStore.email.get(email);
    switch (existing) {
      case (?_) { return #err("Email already registered") };
      case null {
        let userId = await IdGen.generateUserId(userStore);
        let user : Types.User = {
          id = userId;
          email = email;
          password = hashedPassword;
          salt = salt;
          username = username;
          createdAt = Time.now();
        };

        userStore.db.insert(user);
        return #ok(user);
      };
    };
  };

  private func loginImpl(credentials : Types.LoginCredentials, userStore : Users.Use, sessionStore : Sessions.Use) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
    let userOpt = userStore.email.get(credentials.email);
    switch (userOpt) {
      case null { return #err("Invalid email or password") };
      case (?user) {
        if (credentials.password != user.password) {
          return #err("Invalid email or password");
        };

        let sessionToken = await Crypto.generateSessionToken();
        let oneDayInNanoSeconds : Int = 86_400_000_000_000;

        let session : Types.SessionToken = {
          token = sessionToken;
          userId = user.id;
          expiresAt = (Time.now() : Int) + oneDayInNanoSeconds;
          createdAt = (Time.now() : Int);
        };

        sessionStore.db.insert(session);

        return #ok({
          user = user;
          sessionToken = sessionToken;
        });
      };
    };
  };

  private func validateSessionImpl(token : Text, sessionStore : Sessions.Use, userStore : Users.Use) : async ?Types.User {
    let sessionOpt = sessionStore.pk.get(token);
    switch (sessionOpt) {
      case null null;
      case (?session) {
        if (session.expiresAt < Time.now()) {
          sessionStore.pk.delete(token);
          return null;
        };

        userStore.pk.get(session.userId);
      };
    };
  };

  private func logoutImpl(token : Text, sessionStore : Sessions.Use) : async Result.Result<(), Text> {
    sessionStore.pk.delete(token);
    return #ok;
  };
};
