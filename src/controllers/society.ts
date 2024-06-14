import express from "express";

import {
  createSociety,
  retriveAllSocieties,
  getSocietybyName,
  getSociety,
} from "../models/society.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import mongoose from "mongoose";
import { getUserById } from "../models/user.model";
export const registerSociety = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { societyName, societyDescription, societyTags } = req.body;

    if (!societyName || !societyDescription || !societyTags) {
      return res.status(400).send({
        error: "Society Name, Description, Tags, and Logo are required",
      });
    }

    const societyExists = await getSocietybyName(societyName);
    if (societyExists.length) {
      return res.status(400).send({ error: "Society already exists" });
    }

    const societyLogoLocalPath = (req.files as any)?.societyLogo?.[0].path;
    if (!societyLogoLocalPath) {
      return res.status(400).send({ error: "Society Logo is required" });
    }
    const societyLogo = (await uploadOnCloudinary(societyLogoLocalPath))
      .secure_url;

    const owner = (req as any).identity._id;

    const newSociety = await createSociety({
      societyName,
      societyDescription,
      societyLogo,
      societyTags,
      societyMembers: [owner],
      societyAdmin: [owner],
      createdBy: owner,
    });

    const user = await getUserById(owner);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.SocietyCreated.push(newSociety._id);
    await user.save();

    return res.status(201).json({ Message: "Society Registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Society Registration failed" });
  }
};

export const getSocietyDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const society = await getSociety(id);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    return res.status(200).json(society);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Society" });
  }
};

export const getAllSocieties = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const societies = await retriveAllSocieties();
    return res.status(200).json(societies);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to get Societies" });
  }
};

export const updateSocietyDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const society = await getSociety(id);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const { societyName, societyDescription, societyTags } = req.body;
    if (!societyName || !societyDescription || !societyTags) {
      return res.status(400).send({
        error: "Society Name, Description, Tags are required",
      });
    }
    const existingSociety = await getSocietybyName(societyName);
    if (existingSociety.length && existingSociety[0]._id.toString() !== id) {
      return res.status(400).send({ error: "Society Name  already exists" });
    }

    const societyLogoLocalPath = (req.files as any)?.societyLogo?.[0].path;
    let societyLogo;
    if (societyLogoLocalPath) {
      societyLogo = (await uploadOnCloudinary(societyLogoLocalPath)).secure_url;
    } else {
      societyLogo = society.societyLogo;
    }
    society.societyName = societyName;
    society.societyDescription = societyDescription;
    society.societyLogo = societyLogo;
    society.societyTags = societyTags;
    await society.save();
    return res.status(200).json({ Message: "Society Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to update Society" });
  }
};

export const addSocietyAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const societyId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const society = await getSociety(societyId);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (society.societyAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is already an Admin" });
    }
    society.societyAdmin.push(adminId);
    await society.save();
    return res.status(200).json({ Message: "Admin Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Admin" });
  }
};

export const removeSocietyAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const societyId = req.params.id;
    let { adminId } = req.body;
    adminId = new mongoose.Types.ObjectId(adminId);
    const society = await getSociety(societyId);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const user = await getUserById(adminId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!society.societyAdmin.includes(adminId)) {
      return res.status(400).send({ error: "User is not an Admin" });
    }
    society.societyAdmin = society.societyAdmin.filter(
      (admin) => admin.toString() !== adminId.toString()
    );
    await society.save();
    return res.status(200).json({ Message: "Admin Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Admin" });
  }
};

export const addSocietyMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const societyId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const society = await getSociety(societyId);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (society.societyMembers.includes(userId)) {
      return res.status(400).send({ error: "User is already a Member" });
    }
    society.societyMembers.push(userId);
    await society.save();

    user.SocietyJoined.push(society._id);
    await user.save();
    return res.status(200).json({ Message: "Member Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to add Member" });
  }
};

export const removeSocietyMember = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const societyId = req.params.id;

    let { userId } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    const society = await getSociety(societyId);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const user = await getUserById(userId.toString());
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!society.societyMembers.includes(userId)) {
      return res.status(400).send({ error: "User is not a Member" });
    }
    const newSocietyMember = society.societyMembers.filter(
      (member) => member.toString() !== userId.toString()
    );

    society.societyMembers = newSocietyMember;
    await society.save();

    const RemovedSocietyUser: any = user.SocietyJoined.filter(
      (society) => society._id.toString() !== societyId.toString()
    );
    user.SocietyJoined = RemovedSocietyUser;
    await user.save();
    return res.status(200).json({ Message: "Member Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to remove Member" });
  }
};
