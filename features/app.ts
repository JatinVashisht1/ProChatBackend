import "reflect-metadata";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CHAT, CONNECTION, UPDATE_ALL_MESSAGES_DELIVERY_STATUS, UPDATE_MESSAGE_DELIVERY_STATUS } from "../common/Events";
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
import { UpdateMessageDeliveryStateController } from "./featureChat/src/Controllers/UpdateMessageDeliveryStateController";
import { UpdateMessageDeliveryModel } from "./featureChat/domain/model/UpdateMessageDeliveryModel";
import { UpdateAllMessagesDeliveryStatusModel } from "./featureChat/domain/model/UpdateAllMessageDeliveryStatusModel";
import { UpdateAllChatMessageDeliveryStateBetween2UsersFromOneSenderController } from "./featureChat/src/Controllers/UpdateAllChatMessagesDeliveryStateBetween2UsersFromOneSenderController";
import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";


const app = express();

import serviceAccount from "../demochatapplication-79bc3-firebase-adminsdk-d00yy-c7ed1edfa0.json" assert {type: "json"} ;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


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
      (message, receiverFirebaseToken) => {
        logger.info(`message is ${JSON.stringify(message)}`);
        io.to(username).emit(CHAT, message);

        if (receiverFirebaseToken && receiverFirebaseToken.length > 0) {
          const notificationMessage: Message = {
            token: receiverFirebaseToken,
            notification: {
              title: message.from,
              body: message.message,
            },
            data: {
              "fullMessage": JSON.stringify(message)
            }
          };
          
          admin.messaging().send(notificationMessage);
        }
      }
    );
  });

  socket.on(UPDATE_MESSAGE_DELIVERY_STATUS, (updateMessageDeliveryModel: UpdateMessageDeliveryModel) => {
    new UpdateMessageDeliveryStateController()
      .updateMessageDeliveryStateHandler(
        updateMessageDeliveryModel,
        (from: string, to: string) => {
          socket.to(from).to(to).emit(UPDATE_MESSAGE_DELIVERY_STATUS, updateMessageDeliveryModel);
          io.to(from).to(to).emit(UPDATE_MESSAGE_DELIVERY_STATUS, updateMessageDeliveryModel);
        });
  });

  socket.on(UPDATE_ALL_MESSAGES_DELIVERY_STATUS, (updateAllMessagesDeliveryStatusModel: UpdateAllMessagesDeliveryStatusModel) => {
    new UpdateAllChatMessageDeliveryStateBetween2UsersFromOneSenderController()
      .updateAllChatMessageDeliveryStateBetween2UsersFromOneSenderHandler(
        updateAllMessagesDeliveryStatusModel,
        (updateAllChatMessageBodyParam: UpdateAllMessagesDeliveryStatusModel) => {
          const from = updateAllChatMessageBodyParam.from, to = updateAllChatMessageBodyParam.to;
          socket.to(from).to(to).emit(UPDATE_ALL_MESSAGES_DELIVERY_STATUS, updateAllChatMessageBodyParam);
          io.to(from).to(to).emit(UPDATE_ALL_MESSAGES_DELIVERY_STATUS, updateAllChatMessageBodyParam);
          logger.info(`sent update message delivery status event`);
        }
      );
  });
  
});

