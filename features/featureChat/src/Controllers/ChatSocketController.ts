import { Socket } from "socket.io";
import { ChatMessageBody } from "../../../common/SocketEvents";
import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";
import { stringToDeliveryStatus } from "../../utility/messageDeliveryStateAndStringMapper";
import { CHAT } from "../../../../common/Events";

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
    onEmition: (message: ChatMessageBody, firebaseTokenReceiver: string) => void
  ) => {
    assertIsDefined(this.chatRepository);
    const chatMessageBodyString = chatMessageBody.toString();
    const chatMessageBodyJson = JSON.parse(chatMessageBodyString);
    const messageDeliveryStatus = stringToDeliveryStatus(chatMessageBodyJson.deliveryStatus);
    if (!messageDeliveryStatus) return;
    
    const chatMessageEntity: ChatMessageEntity = {
      message: chatMessageBodyJson.message,
      messageId: chatMessageBodyJson.messageId,
      createdAt: chatMessageBodyJson.createdAt,
      deliveryStatus: messageDeliveryStatus,
      receiverUsername: chatMessageBodyJson.to,
      senderUsername: chatMessageBodyJson.from,
    };

    await this.chatRepository.addChatMessage(chatMessageEntity);
    socket.to(chatMessageEntity.receiverUsername).emit(CHAT, { 
      messageId: chatMessageEntity.messageId, 
      deliveryStatus: chatMessageEntity.deliveryStatus, 
      createdAt: chatMessageEntity.createdAt, 
      message: chatMessageEntity.message, 
      from: chatMessageEntity.senderUsername, 
      to: chatMessageEntity.receiverUsername 
    });

    const firebaseTokenReceiver = await this.chatRepository.getUserFirebaseAccessToken(chatMessageEntity.receiverUsername);
    
    onEmition(chatMessageBodyJson, firebaseTokenReceiver);
  };
}
