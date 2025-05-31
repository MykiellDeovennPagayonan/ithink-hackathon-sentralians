import Text "mo:base/Text";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module UserClassrooms {
  public type UserClassroomPK = Text; // composite key: userId#classroomId
  public type UserKey = Text;
  public type ClassroomKey = Text;

  public type Init = {
    db        : RXMDB.RXMDB<Types.UserClassroom>;
    pk        : PK.Init<UserClassroomPK>;
    user      : IDX.Init<UserKey>;
    classroom : IDX.Init<ClassroomKey>;
  };

  public func init() : Init {
    return {
      db        = RXMDB.init<Types.UserClassroom>();
      pk        = PK.init<UserClassroomPK>(?32);
      user      = IDX.init<UserKey>(?32);
      classroom = IDX.init<ClassroomKey>(?32);
    };
  };

  public func pk_key(h : Types.UserClassroom) : UserClassroomPK = h.userId # "#" # h.classroomId;

  public func user_key(_idx:Nat, h : Types.UserClassroom) : ?UserKey = ?h.userId;

  public func classroom_key(_idx:Nat, h : Types.UserClassroom) : ?ClassroomKey = ?h.classroomId;

  public type Use = {
    db        : RXMDB.Use<Types.UserClassroom>;
    pk        : PK.Use<UserClassroomPK, Types.UserClassroom>;
    user      : IDX.Use<UserKey, Types.UserClassroom>;
    classroom : IDX.Use<ClassroomKey, Types.UserClassroom>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.UserClassroom>();
    let pk_config : PK.Config<UserClassroomPK, Types.UserClassroom> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<UserClassroomPK, Types.UserClassroom>(pk_config);

    let user_config : IDX.Config<UserKey, Types.UserClassroom> = {
      db        = init.db;
      obs;
      store     = init.user;
      compare   = Text.compare;
      key       = user_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(user_config);

    let classroom_config : IDX.Config<ClassroomKey, Types.UserClassroom> = {
      db        = init.db;
      obs;
      store     = init.classroom;
      compare   = Text.compare;
      key       = classroom_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(classroom_config);

    return {
      db        = RXMDB.Use<Types.UserClassroom>(init.db, obs);
      pk        = PK.Use(pk_config);
      user      = IDX.Use(user_config);
      classroom = IDX.Use(classroom_config);
    };
  };
}