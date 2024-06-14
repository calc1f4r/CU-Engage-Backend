import express from "express";
import {
  getUserById,
  getUserByUsername,
  getUserByEid,
  getUserByUid,
} from "../models/user.model";
import { getClub } from "../models/club.model";
import { get } from "lodash";
import { getSociety } from "../models/society.model";
import { getCommunity } from "../models/community.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const {
      username,
      firstName,
      lastName,
      bio,
      githubLink,
      linkedinLink,
      projects,
      isFacility,
      uid,
      eid,
    } = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (username) {
      const usernameExists = await getUserByUsername(username);
      if (usernameExists && usernameExists.id !== id) {
        return res.status(400).send({ error: "Username already exists" });
      }
      user.username = username;
    }

    if (isFacility !== undefined) {
      if (user.isFacility) {
        return res.status(400).send({ error: "isFacility cannot be updated" });
      }
      if (isFacility && !eid) {
        return res.status(400).send({ error: "EID is required for facility" });
      }
      if (!isFacility && !uid) {
        return res.status(400).send({ error: "UID is required for user" });
      }
      if (eid) {
        if (user.eid) {
          return res.status(400).send({ error: "EID cannot be updated" });
        }
        const facilityExists = await getUserByEid(eid);
        if (facilityExists && facilityExists.id !== id) {
          return res.status(400).send({ error: "EID already exists" });
        }
        user.isFacility = isFacility;
        user.eid = eid;
      }
    } else {
      if (uid) {
        if (user.uid) {
          return res.status(400).send({ error: "UID cannot be updated" });
        }
        const userExists = await getUserByUid(uid);
        if (userExists && userExists.id !== id) {
          return res.status(400).send({ error: "UID already exists" });
        }
        user.uid = uid;
      }
    }

    // UPloading on cloudnary

    const avatarLocalPath = (req.files as any)?.avatar?.[0].path;

    if (!user.avatar && !avatarLocalPath) {
      return res.status(400).send({ error: "Avatar is required" });
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (linkedinLink) user.linkedinLink = linkedinLink;
    if (projects) user.projects = projects;
    if (githubLink) user.githubLink = githubLink;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar?.secure_url || "";
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();
    return res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to update user" });
  }
};
export const getProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;

  try {
    const user = await getUserById(id);
    return res.json(user);
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to retrieve profile" });
  }
};

export const getUserbyUsername = async (
  req: express.Request,
  res: express.Response
) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.json({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      githubLink: user.githubLink,
      linkedinLink: user.linkedinLink,
      projects: user.projects,
      isFacility: user.isFacility,
      uid: user.uid,
      eid: user.eid,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "Failed to retrieve user by username" });
  }
};

export const getJoinedClubs = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    let cludJoinedIds = user.ClubJoined;
    if (!cludJoinedIds) {
      return res.json([]);
    }
    let getJoinedClubs = [];
    for (let i = 0; i < cludJoinedIds.length; i++) {
      let club = await getClub(cludJoinedIds[i].toString());
      getJoinedClubs.push(club);
    }
    return res.json(getJoinedClubs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to retrieve joined clubs" });
  }
};

export const getCreatedClubs = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    let cludCreatedIds = user.ClubCreated;
    if (!cludCreatedIds) {
      return res.json([]);
    }
    let getCreatedClubs = [];
    for (let i = 0; i < cludCreatedIds.length; i++) {
      let club = await getClub(cludCreatedIds[i].toString());
      getCreatedClubs.push(club);
    }
    return res.json(getCreatedClubs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to retrieve created clubs" });
  }
};

export const getJoinedSocieties = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    let societyJoinedIds = user.SocietyJoined;
    if (!societyJoinedIds) {
      return res.json([]);
    }
    let getJoinedSocieties = [];
    for (let i = 0; i < societyJoinedIds.length; i++) {
      let society = await getSociety(societyJoinedIds[i].toString());
      getJoinedSocieties.push(society);
    }
    return res.json(getJoinedSocieties);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "Failed to retrieve joined societies" });
  }
};

export const getCreatedSocieties = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    let societyCreatedIds = user.SocietyCreated;
    if (!societyCreatedIds) {
      return res.json([]);
    }
    let getCreatedSocieties = [];
    for (let i = 0; i < societyCreatedIds.length; i++) {
      let society = await getSociety(societyCreatedIds[i].toString());
      getCreatedSocieties.push(society);
    }
    return res.json(getCreatedSocieties);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "Failed to retrieve created societies" });
  }
};

export const getJoinedCommunities = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const communityJoinedIds = user.CommunityJoined;
    if (!communityJoinedIds) {
      return res.json([]);
    }
    let getJoinedCommunities = [];
    for (let i = 0; i < communityJoinedIds.length; i++) {
      let community = await getCommunity(communityJoinedIds[i].toString());
      getJoinedCommunities.push(community);
    }
    return res.json(getJoinedCommunities);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "Failed to retrieve joined communities" });
  }
};

export const getCreatedCommunities = async (
  req: express.Request,
  res: express.Response
) => {
  const id = get(req, "identity._id") as string;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const communityCreatedIds = user.CommunityCreated;
    if (!communityCreatedIds) {
      return res.json([]);
    }
    let getCreatedCommunities = [];
    for (let i = 0; i < communityCreatedIds.length; i++) {
      let community = await getCommunity(communityCreatedIds[i].toString());
      getCreatedCommunities.push(community);
    }
    return res.json(getCreatedCommunities);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "Failed to retrieve created communities" });
  }
};
