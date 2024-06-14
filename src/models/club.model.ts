import mongoose from "mongoose";

export const ClubSchema = new mongoose.Schema(
  {
    clubName: { type: String, required: true, index: true },
    clubDescription: { type: String, required: true },
    clubLogo: { type: String, required: true },
    clubTags: { type: [String], required: true, index: true },
    clubMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      index: true,
    },
    clubAdmin: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const ClubModel = mongoose.model("Club", ClubSchema);

export const createClub = (values: Record<string, any>) => {
  return new ClubModel(values).save().then((club) => club.toObject());
};
export const getClubbyName = (clubName: string) => ClubModel.find({ clubName });

export const retrieveAllClubs = () => ClubModel.find();

export const getClub = (clubId: string) => ClubModel.findById(clubId);
