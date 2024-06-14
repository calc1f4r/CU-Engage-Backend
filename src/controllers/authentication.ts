import express from "express";
import { getUserbyEmail, createUser } from "../models/user.model";
import { authentication, random } from "../helpers/index";
import { get } from "lodash";
import { getUserById } from "../models/user.model";
import { returnResetToken } from "../helpers/index";
import { findUserByResetToken } from "../models/user.model";
import { sendPasswordResetEmail } from "../utils/sendEmail";
import { asyncHandler } from "../utils/asyncHandler";
export const register = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
      const lowerCaseEmail = email.toLowerCase();

      if (!lowerCaseEmail || !password) {
        return res
          .status(400)
          .send({ error: "Email and password are required" });
      }
      const existingUser = await getUserbyEmail(lowerCaseEmail);
      if (existingUser) {
        return res.status(409).send({ error: "User already exists" });
      }
      const salt = random();

      const hashedPassword = authentication(password, salt);
      await createUser({
        email: lowerCaseEmail,
        authentication: {
          salt,
          password: hashedPassword,
        },
      });
      return res.status(201).json({
        message: "Registration successful! Welcome to our platform.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Registration failed" });
    }
  }
);

export const login = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
      const lowerCaseEmail = email.toLowerCase();

      if (!lowerCaseEmail || !password) {
        return res
          .status(400)
          .send({ error: "Email and password are required" });
      }

      const user = await getUserbyEmail(lowerCaseEmail).select(
        "+authentication.salt +authentication.password"
      );
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const expectedHash = authentication(password, user.authentication.salt);

      if (user.authentication.password !== expectedHash) {
        return res.status(403).json({
          error:
            "The password you entered is incorrect. Please check and try again.",
        });
      }

      const salt = random();

      user.authentication.sessionToken = authentication(
        salt,
        user._id.toString()
      );
      user.authentication.sessionTokenExpires = new Date(Date.now() + 3600000);
      await user.save();

      res.cookie("sessionToken", user.authentication.sessionToken, {
        httpOnly: true,
        secure: true,
      });

      return res
        .status(200)
        .json({ message: "Login successful! Welcome back." });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Login failed" });
    }
  }
);

export const logout = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = get(req, "identity._id");
      const user = await getUserById(userId);
      user.authentication.sessionToken = null;
      user.authentication.sessionTokenExpires = null;
      await user.save();
      res.clearCookie("sessionToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Logout failed" });
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;
      const lowerCaseEmail = email.toLowerCase().trim();

      if (!lowerCaseEmail) {
        return res.status(400).send({ error: "Email is required" });
      }

      const user = await getUserbyEmail(lowerCaseEmail);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const token = returnResetToken();
      user.authentication.passwordResetToken = token;
      user.authentication.passwordResetExpires = new Date(Date.now() + 5000);
      await user.save();
      const resetUrl = `http://yourwebsite.com/reset-password/${token}`;
      await sendPasswordResetEmail(lowerCaseEmail, resetUrl);
      console.log("Password reset token sent", token);
      return res.status(200).json({ message: "Password reset token sent" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Password reset token failed" });
    }
  }
);

export const validateResetToken = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const token = req.params.token;
    const { password } = req.body;
    if (!token || !password) {
      return res.status(400).send({ error: "Token and password are required" });
    }
    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(404).send({ error: "Token not valid" });
    }
    if (user.authentication.passwordResetExpires < new Date(Date.now())) {
      return res.status(400).send({ error: "Token expired" });
    }
    const salt = random();
    user.authentication.password = authentication(password, salt);
    user.authentication.salt = salt;
    user.authentication.passwordResetToken = null;
    user.authentication.passwordResetExpires = null;
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  }
);
