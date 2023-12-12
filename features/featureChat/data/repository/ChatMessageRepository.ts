import { injectable, singleton } from "tsyringe";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";
import { ChatMessageModel } from "../database/ChatMessageModel";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { UserEntity } from "../../domain/model/UserEntity";
import { DomainChatMessageModel } from "../../domain/model/DomainChatMessageModel";
import { DeliveryStatus } from "../../domain/model/DeliveryStatusType";
import { ChatMessageDbEntity } from "../database/ChatMessageDbEntity";
import { UserModel } from "../../../featureUser/data/database/UserModel";
import createHttpError from "http-errors";

/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
@injectable()
@singleton()
export class ChatMessageRepository implements IChatMessageRepository {
  /**
   * method that finds accounts with with `user` has talked to
   * @param user username whose chats account we want to find
   * @returns list of accounts `user` has talked to
   */
  async getChatAccountsOfUser(user: string): Promise<UserEntity[]> {
    const chatEntityList = await ChatMessageModel.find({
      $or: [{ senderUsername: user }, { receiverUsername: user }],
    }).exec();

    const userSet: Set<string> = new Set();
    const userModelList: UserEntity[] = [];

    chatEntityList.forEach((chatEntity) => {
      const username = (chatEntity.senderUsername === user) ? chatEntity.receiverUsername : chatEntity.senderUsername;

      if (!userSet.has(username)) {
        userModelList.push({
          username: username
        });

        userSet.add(username);
      }
    });

    // logger.info(`chatmessagerepo: getchataccounts: userModelList: ${userModelList}`);
    return userModelList;
  }

  /**
   * funtion to find chat messages between two users
   * @param user1 username of first user
   * @param user2 username of second user
   * @returns promise of array of ChatMessageEntity, containing messages between user1 and user2
   */
  async getChatMessagesBetween2Usernames(
    user1: string,
    user2: string
  ): Promise<DomainChatMessageModel[]> {
    const messagesFromUser1AndUser2 = await ChatMessageModel.find({
      $or: [
        { senderUsername: user1, receiverUsername: user2 },
        { senderUsername: user2, receiverUsername: user1 },
      ],
    },).exec();

    const messageEntityListUser1AndUser2: DomainChatMessageModel[] =
      messagesFromUser1AndUser2.map((message) => {
        const createdAt = message.createdAt;
        const date = createdAt.getDate().toString();
        const time = createdAt.getTime().toString();
        const day = createdAt.getDay().toString();
        const month = createdAt.getMonth().toString();
        const year = createdAt.getFullYear().toString();

        return {
          senderUsername: message.senderUsername,
          receiverUsername: message.receiverUsername,
          message: message.message,
          createdDate: date,
          createdDay: day,
          createdTime: time,
          createdMonth: month,
          createdYear: year,
          messageId: message.messageId.toString(),
          deliveryStatus: message.deliveryStatus as DeliveryStatus,
        };
      });

    return messageEntityListUser1AndUser2;
  }

  /**
   * returns 20 chat messages between two usernames/users in a paginated form
   * @param user1 fist username
   * @param user2 second username
   * @param startIndex index to start giving messages from
   */
  async getChatMessagesBetween2UsersPaginated(user1: string, user2: string, startIndex: number): Promise<DomainChatMessageModel[]> {
    const messagesDbEntityList = await ChatMessageModel.find({
      $or: [{ senderUsername: user1, receiverUsername: user2 }, { senderUsername: user2, receiverUsername: user1 }]
    })
      .skip((startIndex - 1) * 10)
      .limit(10)
      .exec();

    const domainChatMessageModelList = messagesDbEntityList.map((message) => {
      const createdAt = message.createdAt;
      const date = createdAt.getDate().toString();
      const time = createdAt.getTime().toString();
      const day = createdAt.getDay().toString();
      const month = createdAt.getMonth().toString();
      const year = createdAt.getFullYear().toString();

      return {
        senderUsername: message.senderUsername,
        receiverUsername: message.receiverUsername,
        message: message.message,
        createdDate: date,
        createdDay: day,
        createdTime: time,
        createdMonth: month,
        createdYear: year,
        messageId: message.messageId.toString(),
        deliveryStatus: message.deliveryStatus as DeliveryStatus,
      };
    });

    return domainChatMessageModelList;
  }

  /**
   * Add a chat message to the data storage.
   * @param message - The chat message to be added.
   * @returns A promise that resolves when the operation is completed.
   */
  async addChatMessage(message: ChatMessageEntity): Promise<void> {

    try {
      logger.info(`message in repo: ${JSON.stringify(message)}`);

      const epochSeconds = message.createdAt;

      const date = new Date(epochSeconds * 1000).toDateString();
      logger.info(`date is ${epochSeconds}`);

      const chatDbEntity: ChatMessageDbEntity = {
        message: message.message,
        deliveryStatus: message.deliveryStatus,
        receiverUsername: message.receiverUsername,
        senderUsername: message.senderUsername,
        messageId: message.messageId,
        createdAt: new Date(date),
      };

      const savedResult = await ChatMessageModel.create({
        senderUsername: chatDbEntity.senderUsername,
        receiverUsername: chatDbEntity.receiverUsername,
        deliveryStatus: chatDbEntity.deliveryStatus,
        createdAt: date,
        messageId: chatDbEntity.messageId,
        message: chatDbEntity.message,
      });
      logger.info(`saved result is ${savedResult}`);
    } catch (error) {
      logger.error(`error inserting chat message ${error}`);
    }
  }

  /**
   * Get chat messages based on the provided username.
   * Retrieves chat messages where either the senderUsername or receiverUsername matches the given username.
   * @param username - The username to retrieve chat messages for.
   * @returns A promise that resolves to an array of ChatMessageEntity representing the chat messages.
   */
  async getChatMessages(username: string): Promise<DomainChatMessageModel[]> {
    const chatMessages = await ChatMessageModel.find({
      $or: [{ senderUsername: username }, { receiverUsername: username }],
    });

    // Map Mongoose documents to ChatMessageEntity
    const chatMessageEntities = chatMessages.map((chatMessage) => {
      const createdAt = chatMessage.createdAt;
      const date = createdAt.getDate().toString();
      const time = createdAt.getTime().toString();
      const day = createdAt.getDay().toString();
      const month = createdAt.getMonth().toString();
      const year = createdAt.getFullYear().toString();

      return {
        senderUsername: chatMessage.senderUsername,
        receiverUsername: chatMessage.receiverUsername,
        message: chatMessage.message,
        createdDate: date,
        createdDay: day,
        createdTime: time,
        createdMonth: month,
        createdYear: year,
        messageId: chatMessage.messageId.toString(),
        deliveryStatus: chatMessage.deliveryStatus as DeliveryStatus,
      };
    });

    return chatMessageEntities;
  }

  async updateChatMessageDeliveryState(messageId: string, deliveryStatus: DeliveryStatus): Promise<void> {
    await ChatMessageModel
      .updateOne({
        messageId: messageId
      },
      {
        deliveryStatus: deliveryStatus
      })
      .exec();
  }

  async updateAllChatMessageDeliveryStateBetween2UsersFromOneSender(senderUsername: string, receiverUsername: string, deliveryStatus: DeliveryStatus): Promise<void> {
    await ChatMessageModel
      .updateMany({
        senderUsername: senderUsername,
        receiverUsername: receiverUsername
      },
      {
        deliveryStatus: deliveryStatus
      })
      .exec();
  }

  async getUserFirebaseAccessToken(username: string): Promise<string> {
    const userEntity = await UserModel.findOne({
      username: username
    }, 
    "firebaseToken"
    ).exec();
    
    if (!userEntity) {
      throw createHttpError(404, `user with username ${username} does not exist`);
    }

    return userEntity.firebaseToken;
  }
}
