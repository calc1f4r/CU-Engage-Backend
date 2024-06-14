import express from "express";
import { get } from "lodash";
import { getUserById } from "../models/user.model";
import club from "router/club";
import mongoose from "mongoose";
export const checkMembership = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { groupId, groupType } = req.params;
  if (!groupId || !groupType) {
    return res
      .status(400)
      .send({ error: "groupId and groupType are required" });
  }
  if (
    groupType != "club" &&
    groupType != "society" &&
    groupType != "community"
  ) {
    return res.status(400).send({ error: "Invalid groupType" });
  }

  const currentUserId = get(req, "identity._id") as string;
  const user = await getUserById(currentUserId);
  switch (groupType) {
    case "club":
      if (!user.ClubJoined.includes(new mongoose.Types.ObjectId(groupId))) {
        return res
          .status(403)
          .send({ error: "You are not a member of the society !" });
      }
    case "society":
      if (!user.SocietyJoined.includes(new mongoose.Types.ObjectId(groupId))) {
        return res
          .status(403)
          .send({ error: "You are not member of the society ! !" });
      }
    case "community":
      if (
        !user.CommunityJoined.includes(new mongoose.Types.ObjectId(groupId))
      ) {
        return res
          .status(403)
          .send({ error: "You are not a member of the community !" });
      }
  }
  next();
};
