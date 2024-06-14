import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  validateResetToken,
} from "../controllers/authentication";
import { isAuthenticated } from "../middlewares";
import {
  loginLimiter,
  registerLimiter,
} from "../middlewares/rateLimitMiddleware";

export default (router: express.Router) => {
  router.post("/auth/register", registerLimiter, register);
  router.post("/auth/login", loginLimiter, login);
  router.post("/auth/logout", isAuthenticated, logout);
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password/:token", validateResetToken);
};
