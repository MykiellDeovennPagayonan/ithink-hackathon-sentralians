import Users "../models/users";
import Random "mo:base/Random";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";
import Time "mo:base/Time";

module {
  public func generateUserId(userStore : Users.Use) : async Text {
    var attempts = 0;
    let maxAttempts = 5;

    while (attempts < maxAttempts) {
      let entropy = await Random.blob();
      let seed = Random.Finite(entropy);

      let randomBytes = Array.tabulate<Nat8>(
        16,
        func(_) {
          switch (seed.byte()) {
            case (?b) b;
            case null 0;
          };
        },
      );

      var candidateId = "user_";
      for (byte in randomBytes.vals()) {
        candidateId := candidateId # Nat8.toText(byte);
      };

      switch (userStore.pk.get(candidateId)) {
        case null { return candidateId };
        case (?_) { attempts += 1 };
      };
    };

    "user_" # Int.toText(Time.now());
  };
};