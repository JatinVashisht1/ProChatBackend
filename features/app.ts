import "reflect-metadata";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CHAT, CONNECTION } from "../common/Events";
import {
  ChatMessageBody,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./common/SocketEvents";
import { ChatSocketController } from "./featureChat/src/Controllers/ChatSocketController";
import userRouter from "./featureUser/src/routes/userRoutes";
import createHttpError, { isHttpError } from "http-errors";
import { logger } from "../common/winstonLoggerConfiguration";
import { getTokenParts, getUsernameFromToken } from "./common/utils/jwtUtils";
import "../di/provideDependencices";
import { chatRouter } from "./featureChat/src/routes/chatRoutes";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.get("/", (req, res) => {
  // logger.info("user requested default page");
  return res.status(200).json({ success: true });
});

app.use("/user", userRouter);

app.use("/chat", chatRouter);

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, _req: Request, res: Response) => {
  logger.error(`error is ${error}`);
  let errorMessage = "An unknown error occurred.";
  let statusCode = 500;

  if (isHttpError(error)) {
    logger.error(`error message is ${errorMessage}`);
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

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token as string;
    // logger.info(`token is ${token}`);
    if (!token) {
      return next(new Error("Authentication failed"));
    }

    const tokenPart = getTokenParts(token);
    const username = getUsernameFromToken(tokenPart[1]);
    logger.info(`username in socket middlewware ${username}`);

    socket.data.username = username;

    next();
  } catch (error) {
    logger.error(error);
    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    const tsError = new Error(errorMessage);
    next(tsError);
  }
});

io.on(CONNECTION, (socket) => {
  const { username } = socket.data;
  logger.info(`username in connection socket event is ${username}`);
  socket.join(username);

  socket.on(CHAT, (chatMessageBody: ChatMessageBody) => {
    new ChatSocketController().chatSocketHandler(
      chatMessageBody,
      socket,
      (message) => {
        logger.info(`message is ${JSON.stringify(message)}`);
        io.to(username).emit(CHAT, message);
      }
    );
  });

  // const chatMessageBody: ChatMessageBody = {
  //   to: username,
  //   message: "hello",
  // };
  // socket.to(username).emit(CHAT, chatMessageBody);
});
