import express from "express";
import {
  createJoinRequest,
  getJoinRequests,
  respondToJoinRequest,
} from "../controllers/joinRequest";
import { checkGroupAdmin } from "../middlewares/";
import { isAuthenticated } from "../middlewares/";
export default (router: express.Router) => {
  router.post(
    "/joinRequest/:groupType/:groupId",
    isAuthenticated,
    createJoinRequest
  );
  router.get(
    "/getJoinRequests/:groupType/:groupId",
    isAuthenticated,
    checkGroupAdmin,
    getJoinRequests
  );
  router.post(
    "/respondToRequest/:id",
    isAuthenticated,
    checkGroupAdmin,
    respondToJoinRequest
  );
};
