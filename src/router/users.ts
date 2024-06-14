import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  updateUser,
  getProfile,
  getUserbyUsername,
  getCreatedClubs,
  getJoinedClubs,
  getCreatedCommunities,
  getCreatedSocieties,
  getJoinedCommunities,
  getJoinedSocieties,
} from "../controllers/users";
import { upload } from "../middlewares/multer.middleware";

export default (router: express.Router) => {
  // User Profile Routes
  router.get("/users/me", isAuthenticated, getProfile);
  router.get("/users/@:username", isAuthenticated, getUserbyUsername);

  router.patch(
    "/users/me",
    isAuthenticated,
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateUser
  );

  // User Clubs Routes
  router.get("/users/me/clubs/created", isAuthenticated, getCreatedClubs);
  router.get("/users/me/clubs/joined", isAuthenticated, getJoinedClubs);

  // User Communities Routes
  router.get(
    "/users/me/communities/created",
    isAuthenticated,
    getCreatedCommunities
  );
  router.get(
    "/users/me/communities/joined",
    isAuthenticated,
    getJoinedCommunities
  );

  // User Societies Routes
  router.get(
    "/users/me/societies/created",
    isAuthenticated,
    getCreatedSocieties
  );
  router.get("/users/me/societies/joined", isAuthenticated, getJoinedSocieties);
};
