import express from "express";

import { get, merge } from "lodash";

import { getUserById, getUserBySessionToken } from "../models/user.model";
import { getCommunity } from "../models/community.model";
import { getClub } from "../models/club.model";
import { getSociety } from "../models/society.model";
import { getRequestByid } from "../models/JoinRequest";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["sessionToken"];
    if (!sessionToken) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await getUserBySessionToken(sessionToken).select(
      "authentication.sessionToken + authentication.sessionTokenExpires"
    );

    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if (user.authentication.sessionTokenExpires < new Date()) {
      return res.status(401).send({ error: "Session expired" });
    }

    merge(req, { identity: user });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Authentication failed" });
  }
};

export const isCommunityAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const id = req.params.id;
    const community: any = await getCommunity(id);
    if (!community) {
      return res.status(404).send({ error: "Community not found" });
    }
    const currentUserId = get(req, "identity._id") as string;
    const user = await getUserById(currentUserId);

    if (!currentUserId) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    if (community.communityAdmin.includes(user._id) === false) {
      return res.status(403).send({ error: "You are not authorized !" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: `Authorization ${err}` });
  }
};
export const isClubAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const id = req.params.id;
    const club: any = await getClub(id);
    if (!club) {
      return res.status(404).send({ error: "Club not found" });
    }
    const currentUserId = get(req, "identity._id") as string;
    const user = await getUserById(currentUserId);

    if (!currentUserId) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    if (club.clubAdmin.includes(user._id) === false) {
      return res.status(403).send({ error: "You are not authorized !" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: `Authorization ${err}` });
  }
};
export const isSocietyAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const id = req.params.id;
    const society: any = await getSociety(id);
    if (!society) {
      return res.status(404).send({ error: "Society not found" });
    }
    const currentUserId = get(req, "identity._id") as string;
    const user = await getUserById(currentUserId);

    if (!currentUserId) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    if (society.societyAdmin.includes(user._id) === false) {
      return res.status(403).send({ error: "You are not authorized !" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: `Authorization ${err}` });
  }
};

// middleware/adminCheck.js

export const checkGroupAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { groupId, groupType } = req.params;
  const requestId = req.params.id;
  const adminId = get(req, "identity._id");
  try {
    let group;
    if (groupId && groupType) {
      // For getJoinRequests
      switch (groupType) {
        case "community":
          group = await getCommunity(groupId);
          if (!group || !group.communityAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        case "club":
          group = await getClub(groupId);
          if (!group || !group.clubAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        case "society":
          group = await getSociety(groupId.toString());
          if (!group || !group.societyAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        default:
          return res.status(400).json({ message: "Invalid group type" });
      }
    } else if (requestId) {
      // For respondToJoinRequest
      const request = await getRequestByid(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      switch (request.groupType) {
        case "community":
          group = await getCommunity(request.groupId.toString());
          if (!group || !group.communityAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        case "club":
          group = await getClub(request.groupId.toString());
          if (!group || !group.clubAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        case "society":
          group = await getSociety(request.groupId.toString());
          if (!group || !group.societyAdmin.includes(adminId)) {
            return res
              .status(403)
              .json({ message: "Unauthorized: Admin access required" });
          }
          break;
        default:
          return res.status(400).json({ message: "Invalid group type" });
      }
    } else {
      return res.status(400).json({
        message: "Group ID and Group Type or dfdf Request ID are required",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
