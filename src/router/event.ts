import express from "express";
import { isAuthenticated } from "../middlewares";
import { createEvent, getEvent, updateEvent } from "../controllers/event";
import { upload } from "../middlewares/multer.middleware";
import { checkMembership } from "../middlewares/event.middleware";
import { checkGroupAdmin } from "../middlewares";

export default (router: express.Router) => {
  router.post(
    "/event/:groupType/:groupId/",
    upload.fields([
      {
        name: "eventImage",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    checkGroupAdmin,
    createEvent
  );
  router.get(
    "/event/:groupType/:groupId/",
    isAuthenticated,
    checkMembership,
    getEvent
  );
  router.patch(
    "/event/:eventId/",
    isAuthenticated,
    checkGroupAdmin,
    updateEvent
  );
};
