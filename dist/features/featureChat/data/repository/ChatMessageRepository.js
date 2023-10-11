var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable, singleton } from "tsyringe";
import { ChatMessageModel } from '../database/ChatMessageModel.js';
/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
export let ChatMessageRepository = class ChatMessageRepository {
    /**
     *
     * @param user1 username of first user
     * @param user2 username of second user
     * @returns promise of array of ChatMessageEntity, containing messages between user1 and user2
     */
    async getChatMessagesBetween2Usernames(user1, user2) {
        const messagesFromUser1AndUser2 = await ChatMessageModel.find({
            $or: [{ senderUsername: user1, receiverUsername: user2 }, { senderUsername: user2, receiverUsername: user1 }]
        });
        const messageEntityListUser1AndUser2 = messagesFromUser1AndUser2.map((message) => {
            return {
                senderUsername: message.senderUsername,
                receiverUsername: message.receiverUsername,
                message: message.message,
            };
        });
        /*
        const messagesFromUser2 = await ChatMessageModel.find({
          from: user2,
          to: user1,
        })
    
        const messageEntityListUser2: ChatMessageEntity[] = messagesFromUser2.map((message) => {
          return {
            senderUsername: message.senderUsername,
            receiverUsername: message.receiverUsername,
            message: message.message,
          }
        })
        
        messageEntityListUser2.forEach((messageEntity) => {
          messageEntityListUser1.push(messageEntity);
        })
        */
        return messageEntityListUser1AndUser2;
    }
    /**
     * Add a chat message to the data storage.
     * @param message - The chat message to be added.
     * @returns A promise that resolves when the operation is completed.
     */
    async addChatMessage(message) {
        await ChatMessageModel.create(message);
    }
    /**
     * Get chat messages based on the provided username.
     * Retrieves chat messages where either the senderUsername or receiverUsername matches the given username.
     * @param username - The username to retrieve chat messages for.
     * @returns A promise that resolves to an array of ChatMessageEntity representing the chat messages.
     */
    async getChatMessages(username) {
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
};
ChatMessageRepository = __decorate([
    injectable(),
    singleton()
], ChatMessageRepository);
