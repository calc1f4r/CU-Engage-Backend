import express from "express";
import {
  createClub,
  getClubbyName,
  retrieveAllClubs,
  getClub,
} from "../models/club.model";
import mongoose from "mongoose";
import { getUserById } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
export const registerClub = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { clubName, clubDescription, clubTags } = req.body;

    if (!clubName || !clubDescription || !clubTags) {
      return res.status(400).send({
        error: "Club Name, Description, Tags are required",
      });
    }

    const clubExists = await getClubbyName(clubName);
    if (clubExists.length) {
      return res.status(400).send({ error: "Club already exists" });
    }

    const owner = (req as any).identity._id;
    const clubLogoLocalPath = (req.files as any)?.clubLogo?.[0].path;
    if (!clubLogoLocalPath) {
      return res.status(400).send({ error: "Club Logo is required" });
    }
    const clubLogo = await uploadOnCloudinary(clubLogoLocalPath);

    const newClub = await createClub({
      clubName,
      clubDescription,
      clubLogo,
      clubTags,
      clubMembers: [owner],
      clubAdmin: [owner],
      createdBy: owner,
    });

    const user = await getUserById(owner);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.ClubCreated.push(newClub._id);
    user.ClubJoined.push(newClub._id);
    await user.save();

    return res.status(201).json({ Message: "Club Registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Club Registration failed" });
  }
};

export const getClubDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const club = await getClub(id);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    return res.status(200).json(club);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Club" });
  }
};

export const getAllClubs = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clubs = await retrieveAllClubs();
    return res.status(200).json(clubs);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Clubs" });
  }
};

export const updateClubDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const club = await getClub(id);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const { clubName, clubDescription, clubLogo, clubTags } = req.body;
    if (!clubName || !clubDescription || !clubLogo || !clubTags) {
      return res.status(400).send({
        error: "Club Name, Description, Tags, and Logo are required",
      });
    }
    const existingClub = await getClubbyName(clubName);
    if (existingClub.length && existingClub[0]._id.toString() !== id) {
      return res.status(400).send({ error: "Club Name  already exists" });
    }
    const clubLogoLocalPath = (req.files as any)?.clubLogo?.[0].path;
    if (clubLogoLocalPath) {
      const clubLogo = await uploadOnCloudinary(clubLogoLocalPath);
      club.clubLogo = clubLogo.secure_url;
    }
    club.clubName = clubName;
    club.clubDescription = clubDescription;
    club.clubTags = clubTags;
    await club.save();
    return res.status(200).json({ Message: "Club Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to update Club" });
  }
};

export const addClubAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clubId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const club = await getClub(clubId);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (club.clubAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is already an Admin" });
    }
    club.clubAdmin.push(adminId);
    await club.save();
    return res.status(200).json({ Message: "Admin Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Admin" });
  }
};

export const removeClubAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clubId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const club = await getClub(clubId);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!club.clubAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is not an Admin" });
    }
    club.clubAdmin = club.clubAdmin.filter(
      (admin) => admin.toString() !== adminId.toString()
    );
    await club.save();
    return res.status(200).json({ Message: "Admin Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Admin" });
  }
};

export const addClubMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clubId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const club = await getClub(clubId);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (club.clubMembers.includes(userId)) {
      return res.status(400).send({ error: "User is already a Member" });
    }
    club.clubMembers.push(userId);
    await club.save();

    user.ClubJoined.push(club._id);
    await user.save();
    return res.status(200).json({ Message: "Member Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Member" });
  }
};

export const removeClubMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clubId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const club = await getClub(clubId);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!club.clubMembers.includes(userId)) {
      return res.status(400).send({ error: "User is not a Member" });
    }
    const newClubMember = club.clubMembers.filter(
      (member) => member.toString() !== userId.toString()
    );

    club.clubMembers = newClubMember;
    await club.save();

    const RemovedClubUser: any = user.ClubJoined.filter(
      (club) => club._id.toString() !== clubId.toString()
    );
    user.ClubJoined = RemovedClubUser;
    await user.save();
    return res.status(200).json({ Message: "Member Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Member" });
  }
};
