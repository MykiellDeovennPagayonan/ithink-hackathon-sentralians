import Time "mo:base/Time";

module {

  public type User = {
    id : Text;
    email : Text;
    password : Text;
    salt : Text;
    username : Text;
    createdAt : Time.Time;
  };

  public type Classroom = {
    id : Text;
    name : Text;
    description : Text;
    ownerId : Text;
    createdAt : Time.Time;
  };

  public type Problem = {
    id : Text;
    title : Text;
    description : Text;
    imageUrl : ?Text;
    classroomId : ?Text;
    isPublic : Bool;
    createdAt : Time.Time;
  };

  public type Solution = {
    id : Text;
    problemId : Text;
    userId : Text;
    imageUrl : Text;
    isCorrect : Bool;
    notes : Text;
    submittedAt : Time.Time;
  };

  public type UserClassroom = {
    userId : Text;
    classroomId : Text;
    isAdmin : Bool;
    joinedAt : Time.Time;
  };

  public type LoginCredentials = {
    email : Text;
    password : Text;
  };

  public type AuthResult = {
    #ok : {
      user : User;
      sessionToken : Text;
    };
    #err : Text;
  };

  public type SessionToken = {
    token : Text;
    userId : Text;
    expiresAt : Time.Time;
    createdAt : Time.Time;
  };
};
