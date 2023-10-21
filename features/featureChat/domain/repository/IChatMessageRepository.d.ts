import { ChatMessageEntity } from "../model/ChatMessageEntity";
import { UserEntity } from "../model/UserEntity";

export type IChatMessageRepository = {
  addChatMessage(message: ChatMessageEntity): Promise<void>;
  getChatMessages(username: string): Promise<ChatMessageEntity[]>;
  getChatMessagesBetween2Usernames(user1: string, user2: string): Promise<ChatMessageEntity[]>
  getChatAccountsOfUser(user: string): Promise<UserEntity[]>
};
