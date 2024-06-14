import express from "express";
import { get } from "lodash";

import { getallEvents } from "../models/event.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { createnewEvent } from "../models/event.model";
export const createEvent = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { groupId, groupType } = req.params;
    const userId = get(req, "identity._id") as string;

    const { title, description, date, location, eventTags } = req.body;
    if (!title || !date || !location || !eventTags) {
      return res
        .status(400)
        .json({ error: "title, date, location and eventTags are required" });
    }

    console.log(req.files);

    const EventImage = (req.files as any)?.eventImage?.[0].path;
    if (!EventImage) {
      return res.status(400).send({ error: "Event image is required" });
    }
    const image = await uploadOnCloudinary(EventImage);

    const newEvent = await createnewEvent({
      title,
      description,
      date,
      location,
      eventTags,
      image: image.secure_url,
      groupType,
      groupId,
      createdBy: userId,
    });
    return res.status(201).send(newEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Event creation failed" });
  }
};
export const updateEvent = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { eventId } = req.params;
    const userId = get(req, "identity._id") as string;

    const { title, description, date, location, eventTags } = req.body;
    if (!title || !date || !location || !eventTags) {
      return res
        .status(400)
        .json({ error: "title, date, location and eventTags are required" });
    }

    const EventImage = (req.files as any)?.eventImage?.[0].path;
    if (!EventImage) {
      return res.status(400).send({ error: "Event image is required" });
    }
    const image = await uploadOnCloudinary(EventImage);

    const newEvent = await createnewEvent({
      title,
      description,
      date,
      location,
      eventTags,
      image: image.secure_url,
    });
    return res.status(201).send(newEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Event Updation failed" });
  }
};
export const getEvent = async (req: express.Request, res: express.Response) => {
  const { groupId, groupType } = req.params;
  try {
    const events = await getallEvents(groupId, groupType);
    return res.json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to fetch events" });
  }
};
