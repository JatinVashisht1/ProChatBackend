import { ChatMessageEntity } from "../model/ChatMessageEntity";
import { DeliveryStatus } from "../model/DeliveryStatusType";
import { DomainChatMessageModel } from "../model/DomainChatMessageModel";
import { UserEntity } from "../model/UserEntity";

export type IChatMessageRepository = {
  addChatMessage(message: ChatMessageEntity): Promise<void>;
  getChatMessages(username: string): Promise<DomainChatMessageModel[]>;
  getChatMessagesBetween2Usernames(user1: string, user2: string): Promise<DomainChatMessageModel[]>
  getChatAccountsOfUser(user: string): Promise<UserEntity[]>;
  getChatMessagesBetween2UsersPaginated(user1: string, user2: string, startIndex: number): Promise<DomainChatMessageModel[]>;
  updateChatMessageDeliveryState(messageId: string, deliveryStatus: DeliveryStatus): Promise<void>;
  updateAllChatMessageDeliveryStateBetween2UsersFromOneSender(senderUsername: string, receiverUsername: string, deliveryStatus: DeliveryStatus): Promise<void>;
  getUserFirebaseAccessToken(username: string): Promise<string>;
  deleteChatMessage(username: string, messageIds: string[]): Promise<boolean>;
};
