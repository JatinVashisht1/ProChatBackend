import { autoInjectable, inject, singleton } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { ChatMessageEntity } from "../../domain/model/ChatMessageEntity";

interface getChatMessagesBetween2UsernamesBody {
    username1: string,
    username2: string,
}

interface chatMessageResponse {
    username1: string,
    username2: string,
    messages: ChatMessageEntity[]
}

@autoInjectable()
export class GetChatMessagesBetween2UsernamesController {
    constructor(@inject(I_CHAT_MESSAGE_REPOSITORY) private chatMessageRepository?: IChatMessageRepository) { }

    getChatMessagesBetween2UsernamesRequestHandler: RequestHandler<unknown, chatMessageResponse, getChatMessagesBetween2UsernamesBody, unknown> = async (req, res, next) => {
        assertIsDefined(this.chatMessageRepository)

        const {username1, username2} = req.body;
        const chatMessagesBetweenUser1AndUser2 = await this.chatMessageRepository.getChatMessagesBetween2Usernames(username1, username2);

        const _chatMessagesResponse: chatMessageResponse = {
            username1: username1,
            username2: username2,
            messages: chatMessagesBetweenUser1AndUser2
        }

        return res.status(200).json(_chatMessagesResponse)
    }

}