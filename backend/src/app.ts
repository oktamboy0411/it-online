import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

// Module routes
import userRoutes from "./modules/users/user.routes";
import serviceRoutes from "./modules/services/service.routes";

const app: Application = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Service Platform API is running",
    version: "1.0.0",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);

// --------------- Error Handling ---------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
