import mongoose from "mongoose";

export const Community = new mongoose.Schema(
  {
    communityName: { type: String, required: true, index: true },
    communityDescription: { type: String, required: true },
    communityLogo: { type: String, required: true },
    communityTags: { type: [String], required: true, index: true },
    communityMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      index: true,
    },
    communityAdmin: {
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

export const CommunityModel = mongoose.model("Community", Community);

export const getCommunity = (communityId: string) =>
  CommunityModel.findById(communityId);

export const createCommunity = async (values: Record<string, any>) => {
  return new CommunityModel(values)
    .save()
    .then((community) => community.toObject());
};
export const getCommunitybyName = (communityName: string) =>
  CommunityModel.find({ communityName });
export const getAllCommunities = () => CommunityModel.find();
