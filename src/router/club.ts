import express from "express";
import { isAuthenticated, isClubAdmin } from "../middlewares";
import {
  getClubDetails,
  registerClub,
  getAllClubs,
  updateClubDetails,
  addClubMember,
  removeClubMember,
  addClubAdmin,
  removeClubAdmin,
} from "../controllers/club";
import { upload } from "../middlewares/multer.middleware";

export default (router: express.Router) => {
  router.post(
    "/club/",
    upload.fields([
      {
        name: "clubLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    registerClub
  );
  router.get("/club/:id", isAuthenticated, getClubDetails);
  router.get("/club/", isAuthenticated, getAllClubs);
  router.patch(
    "/club/:id",
    upload.fields([
      {
        name: "clubLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    isClubAdmin,
    updateClubDetails
  );
  router.post(
    "/club/:id/addMember",
    isAuthenticated,
    isClubAdmin,
    addClubMember
  );
  router.post(
    "/club/:id/removeMember",
    isAuthenticated,
    isClubAdmin,
    removeClubMember
  );
  router.post("/club/:id/addAdmin", isAuthenticated, isClubAdmin, addClubAdmin);
  router.post(
    "/club/:id/removeAdmin",
    isAuthenticated,
    isClubAdmin,
    removeClubAdmin
  );
};
