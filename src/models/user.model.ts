import mongoose from "mongoose";

export const User = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, maxlength: 100 },
    lastName: { type: String, trim: true, maxlength: 100 },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, required: true, select: false },
      sessionToken: { type: String, select: false },
      sessionTokenExpires: { type: Date, select: false },
      passwordResetToken: { type: String, select: false },
      passwordResetExpires: { type: Date, select: false },
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    avatar: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    githubLink: { type: String, trim: true },
    linkedinLink: { type: String, trim: true },
    projects: { type: [String], trim: true },
    isFacility: { type: Boolean, default: false },
    uid: { type: String, index: true },
    eid: { type: String, index: true },
    CommunityJoined: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    ],
    CommunityCreated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    ],
    SocietyJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Society" }],
    SocietyCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Society" }],
    ClubJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
    ClubCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  },
  { timestamps: true }
);

// Compound index
User.index({
  "authentication.sessionToken": 1,
  "authentication.passwordResetToken": 1,
});

export const UserModel = mongoose.model("User", User);

export const getUsers = UserModel.find();

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserByEid = (eid: number) => UserModel.findOne({ eid });

export const getUserByUid = (uid: number) => UserModel.findOne({ uid });

export const getUserById = (id: string) => UserModel.findById(id);

export const getUserbyEmail = (email: string) => UserModel.findOne({ email });

export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const updateUser = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

export const findUserByResetToken = (resetToken: string) => {
  return UserModel.findOne({
    "authentication.passwordResetToken": resetToken,
  });
};
