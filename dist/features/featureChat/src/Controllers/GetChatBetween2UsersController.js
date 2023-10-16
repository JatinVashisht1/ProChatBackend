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
import { assertIsDefined } from '../../../../common/utils/assertIsDefined.js';
export let GetChatMessagesBetween2UsernamesController = class GetChatMessagesBetween2UsernamesController {
    chatMessageRepository;
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    getChatMessagesBetween2UsernamesRequestHandler = async (req, res, next) => {
        assertIsDefined(this.chatMessageRepository);
        const { username1, username2 } = req.body;
        const chatMessagesBetweenUser1AndUser2 = await this.chatMessageRepository.getChatMessagesBetween2Usernames(username1, username2);
        const _chatMessagesResponse = {
            username1: username1,
            username2: username2,
            messages: chatMessagesBetweenUser1AndUser2
        };
        return res.status(200).json(_chatMessagesResponse);
    };
};
GetChatMessagesBetween2UsernamesController = __decorate([
    autoInjectable(),
    __param(0, inject(I_CHAT_MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetChatMessagesBetween2UsernamesController);
