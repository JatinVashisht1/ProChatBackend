import { Socket } from "socket.io";
import { ChatMessageBody } from "../../../common/SocketEvents";
import { CHAT } from "../../../../common/Events";

export const chatSocketHandler = (
  chatMessageBody: ChatMessageBody,
  socket: Socket
) => {
  const { to, from, message } = chatMessageBody;
  socket.to(to).to(from).emit(CHAT, chatMessageBody);
};
