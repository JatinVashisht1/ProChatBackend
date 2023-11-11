import { Socket } from "socket.io";
import { ChatMessageBody } from "../../../common/SocketEvents";
import { CHAT } from "../../../../common/Events";
import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";
import { UUID } from "crypto";
import { logger } from "../../../../common/winstonLoggerConfiguration";

/**
 * Controller for handling chat socket events.
 */
@autoInjectable()
export class ChatSocketController {
  constructor(
    @inject(I_CHAT_MESSAGE_REPOSITORY)
    private chatRepository?: IChatMessageRepository
  ) {}

  /**
   * Handles the chat socket event and performs necessary actions.
   * @param chatMessageBody - The chat message body containing the recipient and message.
   * @param socket - The socket instance representing the connection.
   * @param onEmition - A callback function for emitting messages.
   */
  chatSocketHandler = async (
    chatMessageBody: ChatMessageBody,
    socket: Socket,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onEmition: (message: ChatMessageBody) => void
  ) => {
    assertIsDefined(this.chatRepository);
    const body = chatMessageBody.toString();
    // const json = JSON.parse(body);
    let json = chatMessageBody;

    logger.info(`json in chatsocketcontroller ${json}`);

    // eslint-disable-next-line eqeqeq
    if (typeof json == typeof "") {
      json = JSON.parse(body);
    }
    // logger.info(`chat message body ${JSON.stringify(json)}`);
    logger.info(`chat message body ${chatMessageBody} and type ${typeof json}`);

    // const { to, message, createdAt, deliveryStatus, messageId } = chatMessageBody;
    const from = socket.data.username;

    // logger.info(`chatMessageBody: ${to}`);

    socket.to(json.to).emit(CHAT, json); // Emit message to recipient

    const messageIdUUID = chatMessageBody["messageId"];

    const chatMessageEntity: ChatMessageEntity = {
      senderUsername: json.from,
      receiverUsername: json.to,
      message: json.message,
      createdAt: json.createdAt,
      deliveryStatus: json.deliveryStatus,
      messageId: json.messageId,
    };

    // logger.info(`chat message entity: ${chatMessageBody.message}`);

    await this.chatRepository.addChatMessage(chatMessageEntity);

    const selfMessageBody: ChatMessageBody = {
      to: json.to,
      message: json.message,
      createdAt: json.createdAt,
      deliveryStatus: json.deliveryStatus,
      from: from,
      messageId: json.messageId,
    };

    // logger.debug(`message is ${selfMessageBody}`)

    onEmition(json);
  };
}
