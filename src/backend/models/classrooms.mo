import Text "mo:base/Text";
import Nat "mo:base/Nat"; // Make sure Nat is imported
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module Classrooms {
  public type ClassroomPK = Text;
  public type ClassroomOwnerKey = Text;

  public type Init = {
    db    : RXMDB.RXMDB<Types.Classroom>;
    pk    : PK.Init<ClassroomPK>;
    owner : IDX.Init<ClassroomOwnerKey>;
  };

  public func init() : Init {
    return {
      db    = RXMDB.init<Types.Classroom>();
      pk    = PK.init<ClassroomPK>(?32);
      owner = IDX.init<ClassroomOwnerKey>(?32);
    };
  };

  public func pk_key(h : Types.Classroom) : ClassroomPK = h.id;

  public func owner_key(idx:Nat, h : Types.Classroom) : ?ClassroomOwnerKey = ?(h.ownerId # "_" # Nat.toText(idx));

  public type Use = {
    db    : RXMDB.Use<Types.Classroom>;
    pk    : PK.Use<ClassroomPK, Types.Classroom>;
    owner : IDX.Use<ClassroomOwnerKey, Types.Classroom>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.Classroom>();
    let pk_config : PK.Config<ClassroomPK, Types.Classroom> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<ClassroomPK, Types.Classroom>(pk_config);

    let owner_config : IDX.Config<ClassroomOwnerKey, Types.Classroom> = {
      db        = init.db;
      obs;
      store     = init.owner;
      compare   = Text.compare;
      key       = owner_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(owner_config);

    return {
      db    = RXMDB.Use<Types.Classroom>(init.db, obs);
      pk    = PK.Use(pk_config);
      owner = IDX.Use(owner_config);
    };
  };
}