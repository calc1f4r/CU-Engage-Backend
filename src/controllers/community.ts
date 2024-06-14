import express from "express";
import {
  createCommunity,
  getCommunitybyName,
  getAllCommunities,
  getCommunity,
} from "../models/community.model";
import mongoose from "mongoose";
import { getUserById } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
export const registerCommunity = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { communityName, communityDescription, communityTags } = req.body;

    if (!communityName || !communityDescription || !communityTags) {
      return res.status(400).send({
        error: "Community Name, Description, Tags  are required",
      });
    }

    const communityExists = await getCommunitybyName(communityName);
    if (communityExists.length) {
      return res.status(400).send({ error: "Community already exists" });
    }

    const communityLogoLocalPath = (req.files as any)?.communityLogo?.[0].path;
    if (!communityLogoLocalPath) {
      return res.status(400).send({ error: "Community Logo is required" });
    }
    const communityLogo = (await uploadOnCloudinary(communityLogoLocalPath))
      .secure_url;

    const owner = (req as any).identity._id;

    const newCommunity = await createCommunity({
      communityName,
      communityDescription,
      communityLogo,
      communityTags,
      communityMembers: [owner],
      communityAdmin: [owner],
      createdBy: owner,
    });

    const user = await getUserById(owner);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.CommunityCreated.push(newCommunity._id);
    await user.save();

    return res.status(201).json({ Message: "Community Registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Community Registration failed" });
  }
};
export const getCommunityDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const community = await getCommunity(id);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    return res.status(200).json(community);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Community" });
  }
};
export const getAllcommunities = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const communities = await getAllCommunities();
    return res.status(200).json(communities);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Communities" });
  }
};
export const updateCommunityDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const community = await getCommunity(id);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const { communityName, communityDescription, communityTags } = req.body;
    if (!communityName || !communityDescription || !communityTags) {
      return res.status(400).send({
        error: "Community Name, Description, Tags are required",
      });
    }

    const existingCommunity = await getCommunitybyName(communityName);
    if (
      existingCommunity.length &&
      existingCommunity[0]._id.toString() !== id
    ) {
      return res.status(400).send({ error: "Community Name  already exists" });
    }

    const communityLogoLocalPath = (req.files as any)?.communityLogo?.[0].path;
    let communityLogo;
    if (communityLogoLocalPath) {
      communityLogo = (await uploadOnCloudinary(communityLogoLocalPath))
        .secure_url;
    } else {
      communityLogo = community.communityLogo;
    }
    community.communityName = communityName;
    community.communityDescription = communityDescription;
    community.communityLogo = communityLogo;
    community.communityTags = communityTags;
    await community.save();
    return res.status(200).json({ Message: "Community Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to update Community" });
  }
};
export const addCommunityAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const communityId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const community = await getCommunity(communityId);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (community.communityAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is already an Admin" });
    }
    community.communityAdmin.push(adminId);
    await community.save();
    return res.status(200).json({ Message: "Admin Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Admin" });
  }
};
export const removeCommunityAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const communityId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const community = await getCommunity(communityId);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!community.communityAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is not an Admin" });
    }
    community.communityAdmin = community.communityAdmin.filter(
      (admin) => admin.toString() !== adminId.toString()
    );
    await community.save();
    return res.status(200).json({ Message: "Admin Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Admin" });
  }
};
export const addCommunityMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const communityId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const community = await getCommunity(communityId);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (community.communityMembers.includes(userId)) {
      return res.status(400).send({ error: "User is already a Member" });
    }
    community.communityMembers.push(userId);
    await community.save();

    user.CommunityJoined.push(community._id);
    await user.save();
    return res.status(200).json({ Message: "Member Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Member" });
  }
};
export const removeCommunityMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const communityId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const community = await getCommunity(communityId);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!community.communityMembers.includes(userId)) {
      return res.status(400).send({ error: "User is not a Member" });
    }
    const newcommunityMember = community.communityMembers.filter(
      (member) => member.toString() !== userId.toString()
    );

    community.communityMembers = newcommunityMember;
    await community.save();

    const RemovedCommunityUser: any = user.CommunityJoined.filter(
      (community) => community._id.toString() !== communityId.toString()
    );
    user.CommunityJoined = RemovedCommunityUser;
    await user.save();
    return res.status(200).json({ Message: "Member Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Member" });
  }
};
