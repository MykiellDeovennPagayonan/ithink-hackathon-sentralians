import Text "mo:base/Text";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module Solutions {
  public type SolutionPK = Text;
  public type SolutionProblemKey = Text;
  public type SolutionUserKey = Text;

  public type Init = {
    db      : RXMDB.RXMDB<Types.Solution>;
    pk      : PK.Init<SolutionPK>;
    problem : IDX.Init<SolutionProblemKey>;
    user    : IDX.Init<SolutionUserKey>;
  };

  public func init() : Init {
    return {
      db      = RXMDB.init<Types.Solution>();
      pk      = PK.init<SolutionPK>(?32);
      problem = IDX.init<SolutionProblemKey>(?32);
      user    = IDX.init<SolutionUserKey>(?32);
    };
  };

  public func pk_key(h : Types.Solution) : SolutionPK = h.id;

  public func problem_key(_idx:Nat, h : Types.Solution) : ?SolutionProblemKey = ?h.problemId;

  public func user_key(_idx:Nat, h : Types.Solution) : ?SolutionUserKey = ?h.userId;

  public type Use = {
    db      : RXMDB.Use<Types.Solution>;
    pk      : PK.Use<SolutionPK, Types.Solution>;
    problem : IDX.Use<SolutionProblemKey, Types.Solution>;
    user    : IDX.Use<SolutionUserKey, Types.Solution>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.Solution>();
    let pk_config : PK.Config<SolutionPK, Types.Solution> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<SolutionPK, Types.Solution>(pk_config);

    let problem_config : IDX.Config<SolutionProblemKey, Types.Solution> = {
      db        = init.db;
      obs;
      store     = init.problem;
      compare   = Text.compare;
      key       = problem_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(problem_config);

    let user_config : IDX.Config<SolutionUserKey, Types.Solution> = {
      db        = init.db;
      obs;
      store     = init.user;
      compare   = Text.compare;
      key       = user_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(user_config);

    return {
      db      = RXMDB.Use<Types.Solution>(init.db, obs);
      pk      = PK.Use(pk_config);
      problem = IDX.Use(problem_config);
      user    = IDX.Use(user_config);
    };
  };
}