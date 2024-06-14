import express from "express";
import { isAuthenticated, isSocietyAdmin } from "../middlewares";
import {
  getSocietyDetails,
  registerSociety,
  getAllSocieties,
  updateSocietyDetails,
  addSocietyMember,
  removeSocietyMember,
  addSocietyAdmin,
  removeSocietyAdmin,
} from "../controllers/society";
import { upload } from "../middlewares/multer.middleware";

export default (router: express.Router) => {
  router.post(
    "/society/",
    upload.fields([
      {
        name: "societyLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    registerSociety
  );
  router.get("/society/:id", isAuthenticated, getSocietyDetails);
  router.get("/society/", isAuthenticated, getAllSocieties);
  router.patch(
    "/society/:id",
    upload.fields([
      {
        name: "societyLogo",
        maxCount: 1,
      },
    ]),
    isAuthenticated,
    isSocietyAdmin,
    updateSocietyDetails
  );
  router.post(
    "/society/:id/addMember",
    isAuthenticated,
    isSocietyAdmin,
    addSocietyMember
  );
  router.post(
    "/society/:id/removeMember",
    isAuthenticated,
    isSocietyAdmin,
    removeSocietyMember
  );
  router.post(
    "/society/:id/addAdmin",
    isAuthenticated,
    isSocietyAdmin,
    addSocietyAdmin
  );
  router.post(
    "/society/:id/removeAdmin",
    isAuthenticated,
    isSocietyAdmin,
    removeSocietyAdmin
  );
};
