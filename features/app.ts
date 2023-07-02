import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CHAT, CONNECTION, socketEvents } from "../common/Events";
import {
  ChatMessageBody,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./common/SocketEvents";
import { chatSocketHandler } from "./featureChat/src/socketHandler/chatSocketHandler";
import userRouter from "./featureUser/src/routes/userRoutes";
import { isHttpError } from "http-errors";
import { logger } from "../common/winstonLoggerConfiguration";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  logger.error(error);
  let errorMessage = "An unknown error occurred.";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  return res.status(statusCode).json({ success: false, message: errorMessage });
});

export const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

io.on(CONNECTION, (socket) => {
  const { username } = socket.data;
  socket.join(username);

  socket.on(CHAT, (chatMessageBody: ChatMessageBody) => {
    chatSocketHandler(chatMessageBody, socket);
  });
});
