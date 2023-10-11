import { ChatMessageEntity } from "../model/ChatMessageEntity";

export type IChatMessageRepository = {
  addChatMessage(message: ChatMessageEntity): Promise<void>;
  getChatMessages(username: string): Promise<ChatMessageEntity[]>;
  getChatMessagesBetween2Usernames(user1: string, user2: string): Promise<ChatMessageEntity[]>
};
