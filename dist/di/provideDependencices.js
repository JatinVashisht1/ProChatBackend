import "reflect-metadata";
import { container } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY, I_USER_REPOSITORY, } from "../common/Constants";
import { UserRepository } from "../features/featureUser/data/repository/UserRepository";
import { ChatMessageRepository } from "../features/featureChat/data/repository/ChatMessageRepository";
container.registerSingleton(I_USER_REPOSITORY, UserRepository);
container.registerSingleton(I_CHAT_MESSAGE_REPOSITORY, ChatMessageRepository);
