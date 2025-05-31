// src/utils/IdGen.mo

import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

let charsetArray : [Char] = Iter.toArray(Text.toIter("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"));

let IdGen = object {
  public func generate() : async Text {
    let bytes = await Random.blob();

    let chars = Iter.map<Nat8, Char>(
      bytes.vals(),
      func(b : Nat8) : Char {
        charsetArray[Nat8.toNat(b) % charsetArray.size()];
      },
    );

    Text.fromIter(chars);
  };

  public func uniqueId(exists : (Text) -> Bool) : async Text {
    var id = await generate();
    while (exists(id)) {
      id := await generate();
    };
    return id;
  };

};

IdGen