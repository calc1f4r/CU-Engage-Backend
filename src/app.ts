import express from "express";
import router from "./router";
import connectDB from "./db/dbconfig";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import http from "http";
import rateLimit from "express-rate-limit";
const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limit);

app.use(
  cors({
    credentials: true,
  })
);
app.set("trust proxy", 1); // trust first proxy

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", router());
const server = http.createServer(app);
connectDB();

export default app;
