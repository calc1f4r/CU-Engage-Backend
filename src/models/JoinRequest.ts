import app from "app";
import mongoose from "mongoose";

export const joinRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    groupType: {
      type: String,
      enum: ["club", "society", "community"],
      required: true,
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestDate: { type: Date, default: Date.now },
    handledDate: { type: Date },
  },
  { timestamps: true }
);

export const JoinRequestModel = mongoose.model(
  "JoinRequest",
  joinRequestSchema
);

export const getRequestByid = (requestId: string) => {
  return JoinRequestModel.findById(requestId);
};
