import express from "express";
import authentication from "./authentication";
import users from "./users";
import community from "./community";
import society from "./society";
import club from "./club";
import joinRequest from "./joinRequest";
import event from "./event";
const router = express.Router();
export default (): express.Router => {
  authentication(router);
  users(router);
  community(router);
  society(router);
  club(router);
  joinRequest(router);
  event(router);
  return router;
};
