import { injectable, singleton } from "tsyringe";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";
import { ChatMessageModel } from "../database/ChatMessageModel";
import { logger } from "../../../../common/winstonLoggerConfiguration";

/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
@injectable()
@singleton()
export class ChatMessageRepository implements IChatMessageRepository {

  /**
   * 
   * @param user1 username of first user
   * @param user2 username of second user
   * @returns promise of array of ChatMessageEntity, containing messages between user1 and user2
   */
  async getChatMessagesBetween2Usernames(user1: string, user2: string): Promise<ChatMessageEntity[]> {
    const messagesFromUser1AndUser2 = await ChatMessageModel.find({
      $or: [{senderUsername: user1, receiverUsername: user2}, {senderUsername: user2, receiverUsername: user1}]
    })
    
    
    const messageEntityListUser1AndUser2: ChatMessageEntity[] = messagesFromUser1AndUser2.map((message) => {
      return {
        senderUsername: message.senderUsername,
        receiverUsername: message.receiverUsername,
        message: message.message,
      }
    })
    

    return messageEntityListUser1AndUser2;
  }

  /**
   * Add a chat message to the data storage.
   * @param message - The chat message to be added.
   * @returns A promise that resolves when the operation is completed.
   */
  async addChatMessage(message: ChatMessageEntity): Promise<void> {
    const savedResult = await ChatMessageModel.create(message);
    logger.info(`saved result is ${savedResult}`)
  }

  /**
   * Get chat messages based on the provided username.
   * Retrieves chat messages where either the senderUsername or receiverUsername matches the given username.
   * @param username - The username to retrieve chat messages for.
   * @returns A promise that resolves to an array of ChatMessageEntity representing the chat messages.
   */
  async getChatMessages(username: string): Promise<ChatMessageEntity[]> {
    const chatMessages = await ChatMessageModel.find({
      $or: [{ senderUsername: username }, { receiverUsername: username }],
    });

    // Map Mongoose documents to ChatMessageEntity
    const chatMessageEntities = chatMessages.map((chatMessage) => {
      return {
        senderUsername: chatMessage.senderUsername,
        receiverUsername: chatMessage.receiverUsername,
        message: chatMessage.message,
      };
    });

    return chatMessageEntities;
  }
}
