var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from '../../../../common/Constants.js';
import { ChatMessageRepository } from '../../data/repository/ChatMessageRepository.js';
import createHttpError from "http-errors";
import { logger } from '../../../../common/winstonLoggerConfiguration.js';
import { assertIsDefined } from '../../../../common/utils/assertIsDefined.js';
export let GetChatAccountsOfUserController = class GetChatAccountsOfUserController {
    chatMessageRepository;
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    getChatAccountsOfUserRequestHandler = async (req, res, next) => {
        try {
            const username = req.body.username;
            assertIsDefined(this.chatMessageRepository);
            if (!username || username.length === 0) {
                throw createHttpError(400, "username is required");
            }
            const userEntityList = await this.chatMessageRepository.getChatAccountsOfUser(username);
            const jsonResponse = {
                user: username,
                accounts: userEntityList
            };
            return res.status(200).json(jsonResponse);
        }
        catch (error) {
            logger.info(`error thrown in [get chat accounts controller]: ${error}`);
            next(error);
        }
    };
};
GetChatAccountsOfUserController = __decorate([
    autoInjectable(),
    __param(0, inject(I_CHAT_MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [ChatMessageRepository])
], GetChatAccountsOfUserController);
