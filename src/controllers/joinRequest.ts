import { JoinRequestModel, getRequestByid } from "../models/JoinRequest";
import express from "express";
import { get } from "lodash";
import { getCommunity } from "../models/community.model";
import { getSociety } from "../models/society.model";
import { getClub } from "../models/club.model";
import { getUserById } from "../models/user.model";

import mongoose from "mongoose";

export const createJoinRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const { groupId, groupType } = req.params;

  if (!groupId || !groupType) {
    return res
      .status(400)
      .json({ error: "groupId and groupType are required" });
  }

  if (!["club", "society", "community"].includes(groupType)) {
    return res.status(400).json({ error: "Invalid groupType" });
  }

  const userId = get(req, "identity._id") as string;

  try {
    let group;
    switch (groupType) {
      case "club":
        group = await getClub(groupId);
        break;
      case "society":
        group = await getSociety(groupId);
        break;
      case "community":
        group = await getCommunity(groupId);
        break;
    }

    if (!group) {
      return res.status(404).json({
        error: `${
          groupType.charAt(0).toUpperCase() + groupType.slice(1)
        } not found`,
      });
    }

    if (
      (group as any)[groupType + "Members"].includes(
        new mongoose.Types.ObjectId(userId)
      )
    ) {
      return res.status(400).json({ error: "You are already a member." });
    }

    const existingRequest = await JoinRequestModel.findOne({
      groupId,
      userId,
      groupType,
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ error: "Request already exists." });
      }
      if (existingRequest.status === "approved") {
        return res.status(400).json({ error: "You are already a member." });
      }
    }

    const newRequest = new JoinRequestModel({ userId, groupId, groupType });
    await newRequest.save();

    res.status(201).json({ message: "Join request sent successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send join request." });
  }
};

export const getJoinRequests = async (
  req: express.Request,
  res: express.Response
) => {
  const { groupId, groupType } = req.params;
  if (!groupId || !groupType) {
    return res
      .status(400)
      .json({ error: "groupId and groupType are required" });
  }
  if (
    groupType !== "club" &&
    groupType !== "society" &&
    groupType !== "community"
  ) {
    return res.status(400).json({ error: "Invalid groupType" });
  }
  try {
    const requests = await JoinRequestModel.find({ groupId, groupType });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch join requests." });
  }
};

export const respondToJoinRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const requestId = req.params.id;
  const action = req.body.action;

  const request = await JoinRequestModel.findById(requestId);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (!requestId || !action) {
    return res.status(400).json({ error: "requestId and action are required" });
  }
  if (action !== "approve" && action !== "reject") {
    return res.status(400).json({ error: "Invalid action" });
  }
  const userId = get(req, "identity._id");

  try {
    const request = await getRequestByid(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request already responded to" });
    }
    if (action === "reject") {
      request.status = "rejected";
    }
    if (action === "approve") {
      request.status = "approved";
    }
    request.handledBy = userId;
    request.handledDate = new Date();

    if (action === "approve") {
      let group;
      switch (request.groupType) {
        case "community":
          group = await getCommunity(request.groupId.toString());
          group.communityMembers.push(request.userId);
          await group.save();
          break;
        case "club":
          group = await getClub(request.groupId.toString());
          group.clubMembers.push(request.userId);
          await group.save();
          break;
        case "society":
          group = await getSociety(request.groupId.toString());
          group.societyMembers.push(request.userId);
          await group.save();
          break;
        default:
          return res.status(400).json({ message: "Invalid group type" });
      }
      const user = await getUserById(request.userId.toString());
      switch (request.groupType) {
        case "community":
          user.CommunityJoined.push(group._id);
          break;
        case "club":
          user.ClubJoined.push(group._id);
          break;
        case "society":
          user.SocietyJoined.push(group._id);
          break;
      }
      await user.save();
      await request.save();
      res.status(200).json({ message: `Request ${action}ed` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
