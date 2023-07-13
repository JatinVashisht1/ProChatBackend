import { Socket } from "socket.io";
import { ChatMessageBody } from "../../../common/SocketEvents";
import { CHAT } from "../../../../common/Events";
import { logger } from "../../../../common/winstonLoggerConfiguration";

export const chatSocketHandler = (
  chatMessageBody: ChatMessageBody,
  socket: Socket,
  onEmition: (message: ChatMessageBody) => void
) => {
  const { to, message } = chatMessageBody;
  const from = socket.data.username;

  logger.info(`to: ${to} from: ${socket.data.username} message: ${message}`);

  socket.to(to).emit(CHAT, chatMessageBody); // Emit message to recipient

  const selfMessageBody: ChatMessageBody = {
    to: from,
    message: message,
  };

  onEmition(selfMessageBody);
};
