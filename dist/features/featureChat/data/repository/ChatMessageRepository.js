var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable, singleton } from "tsyringe";
import { ChatMessageModel } from '../database/ChatMessageModel.js';
import { logger } from '../../../../common/winstonLoggerConfiguration.js';
/**
 * ChatMessageRepository is responsible for interacting with the chat message data storage.
 */
export let ChatMessageRepository = class ChatMessageRepository {
    /**
     * method that finds accounts with with `user` has talked to
     * @param user username whose chats account we want to find
     * @returns list of accounts `user` has talked to
     */
    async getChatAccountsOfUser(user) {
        const chatEntityList = await ChatMessageModel.find({
            $or: [{ senderUsername: user }, { receiverUsername: user }],
        }).exec();
        const userSet = new Set();
        const userModelList = [];
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
    async getChatMessagesBetween2Usernames(user1, user2) {
        const messagesFromUser1AndUser2 = await ChatMessageModel.find({
            $or: [
                { senderUsername: user1, receiverUsername: user2 },
                { senderUsername: user2, receiverUsername: user1 },
            ],
        }).exec();
        const messageEntityListUser1AndUser2 = messagesFromUser1AndUser2.map((message) => {
            return {
                senderUsername: message.senderUsername,
                receiverUsername: message.receiverUsername,
                message: message.message,
            };
        });
        return messageEntityListUser1AndUser2;
    }
    /**
     * Add a chat message to the data storage.
     * @param message - The chat message to be added.
     * @returns A promise that resolves when the operation is completed.
     */
    async addChatMessage(message) {
        const savedResult = await ChatMessageModel.create(message);
        logger.info(`saved result is ${savedResult}`);
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
