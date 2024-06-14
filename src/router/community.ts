import express from "express";
import { isAuthenticated, isCommunityAdmin } from "../middlewares";
import {
  getCommunityDetails,
  registerCommunity,
  getAllcommunities,
  updateCommunityDetails,
  addCommunityMember,
  removeCommunityMember,
  addCommunityAdmin,
  removeCommunityAdmin,
} from "../controllers/community";

import { upload } from "../middlewares/multer.middleware";
export default (router: express.Router) => {
  router.post(
    "/community/",
    upload.fields([
      {
        name: "communityLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    registerCommunity
  );
  router.get("/community/:id", isAuthenticated, getCommunityDetails);
  router.get("/community/", isAuthenticated, getAllcommunities);
  router.patch(
    "/community/:id",
    upload.fields([
      {
        name: "communityLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    isCommunityAdmin,
    updateCommunityDetails
  );
  router.post(
    "/community/:id/addMember",
    isAuthenticated,
    isCommunityAdmin,
    addCommunityMember
  );
  router.post(
    "/community/:id/removeMember",
    isAuthenticated,
    isCommunityAdmin,
    removeCommunityMember
  );
  router.post(
    "/community/:id/addAdmin",
    isAuthenticated,
    isCommunityAdmin,
    addCommunityAdmin
  );
  router.post(
    "/community/:id/removeAdmin",
    isAuthenticated,
    isCommunityAdmin,
    removeCommunityAdmin
  );
};
