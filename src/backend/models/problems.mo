import Text "mo:base/Text";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module Problems {
  public type ProblemPK = Text;
  public type ProblemClassroomKey = Text;
  public type ProblemIsPublicKey = Text;

  public type Init = {
    db        : RXMDB.RXMDB<Types.Problem>;
    pk        : PK.Init<ProblemPK>;
    classroom : IDX.Init<ProblemClassroomKey>;
    isPublic  : IDX.Init<ProblemIsPublicKey>;
  };

  public func init() : Init {
    return {
      db        = RXMDB.init<Types.Problem>();
      pk        = PK.init<ProblemPK>(?32);
      classroom = IDX.init<ProblemClassroomKey>(?32);
      isPublic  = IDX.init<ProblemIsPublicKey>(?32);
    };
  };

  public func pk_key(h : Types.Problem) : ProblemPK = h.id;

  public func classroom_key(_idx:Nat, h : Types.Problem) : ?ProblemClassroomKey {
    switch (h.classroomId) {
      case (?id) { ?id };
      case null { null };
    };
  };

  public func isPublic_key(_idx:Nat, h : Types.Problem) : ?ProblemIsPublicKey {
    if (h.isPublic) {
      ?"true"
    } else {
      ?"false"
    }
  };

  public type Use = {
    db        : RXMDB.Use<Types.Problem>;
    pk        : PK.Use<ProblemPK, Types.Problem>;
    classroom : IDX.Use<ProblemClassroomKey, Types.Problem>;
    isPublic  : IDX.Use<ProblemIsPublicKey, Types.Problem>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.Problem>();
    let pk_config : PK.Config<ProblemPK, Types.Problem> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<ProblemPK, Types.Problem>(pk_config);

    let classroom_config : IDX.Config<ProblemClassroomKey, Types.Problem> = {
      db        = init.db;
      obs;
      store     = init.classroom;
      compare   = Text.compare;
      key       = classroom_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(classroom_config);

    let isPublic_config : IDX.Config<ProblemIsPublicKey, Types.Problem> = {
      db        = init.db;
      obs;
      store     = init.isPublic;
      compare   = Text.compare;
      key       = isPublic_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(isPublic_config);

    return {
      db        = RXMDB.Use<Types.Problem>(init.db, obs);
      pk        = PK.Use(pk_config);
      classroom = IDX.Use(classroom_config);
      isPublic  = IDX.Use(isPublic_config);
    };
  };
}