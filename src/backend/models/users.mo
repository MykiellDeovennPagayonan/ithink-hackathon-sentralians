import Text "mo:base/Text";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module Users {
  public type UserPK = Text;
  public type UserEmailKey = Text;

  public type Init = {
    db    : RXMDB.RXMDB<Types.User>;
    pk    : PK.Init<UserPK>;
    email : IDX.Init<UserEmailKey>;
  };

  public func init() : Init {
    return {
      db    = RXMDB.init<Types.User>();
      pk    = PK.init<UserPK>(?32);
      email = IDX.init<UserEmailKey>(?32);
    };
  };

  public func pk_key(h : Types.User) : UserPK = h.id;

  public func email_key(_idx:Nat, h : Types.User) : ?UserEmailKey = ?h.email;

  public type Use = {
    db    : RXMDB.Use<Types.User>;
    pk    : PK.Use<UserPK, Types.User>;
    email : IDX.Use<UserEmailKey, Types.User>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.User>();
    let pk_config : PK.Config<UserPK, Types.User> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<UserPK, Types.User>(pk_config);

    let email_config : IDX.Config<UserEmailKey, Types.User> = {
      db        = init.db;
      obs;
      store     = init.email;
      compare   = Text.compare;
      key       = email_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(email_config);

    return {
      db    = RXMDB.Use<Types.User>(init.db, obs);
      pk    = PK.Use(pk_config);
      email = IDX.Use(email_config);
    };
  };
}