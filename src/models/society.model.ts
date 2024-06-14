import mongoose from "mongoose";
export const Society = new mongoose.Schema(
  {
    societyName: { type: String, required: true, index: true },
    societyDescription: { type: String, required: true },
    societyLogo: { type: String, required: true },
    societyTags: { type: [String], required: true, index: true },
    societyMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      index: true,
    },
    societyAdmin: {
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

export const SocietyModel = mongoose.model("Society", Society);

export const createSociety = (values: Record<string, any>) => {
  return new SocietyModel(values).save().then((society) => society.toObject());
};

export const getSociety = (societyId: string) =>
  SocietyModel.findById(societyId);

export const getSocietybyName = (societyName: string) => {
  return SocietyModel.find({ societyName });
};

export const retriveAllSocieties = () => SocietyModel.find();
