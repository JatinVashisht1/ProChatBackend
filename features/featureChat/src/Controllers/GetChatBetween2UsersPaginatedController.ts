import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { RequestHandler } from "express";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { DomainChatMessageModel } from "../../domain/model/DomainChatMessageModel";

interface chatMessageResponse {
    username1: string;
    username2: string;
    messages: DomainChatMessageModel[];
}

@autoInjectable()
export class GetChatBetween2UsersPaginatedController {
  constructor(
        @inject(I_CHAT_MESSAGE_REPOSITORY)
        private chatMessageRepository?: IChatMessageRepository
  ) { }

  getChatBetween2UsersPaginatedHandler: RequestHandler<{anotherUsername: string, startFrom: number | undefined}, unknown, chatMessageResponse, unknown> = async (req, res, _next) => {
    assertIsDefined(this.chatMessageRepository);
    let startFrom = req.params.startFrom;
    if (!startFrom) {
      startFrom = 1;
    }
    const username1 = req.params.anotherUsername;
    const username2 = req.username;
    logger.info(`username is ${username2}`);
    const chatMessagesBetweenUser1AndUser2 =
      await this.chatMessageRepository.getChatMessagesBetween2Usernames(
        username1,
        username2
      );

    const _chatMessagesResponse: chatMessageResponse = {
      username2: username2,
      username1: username1,
      messages: chatMessagesBetweenUser1AndUser2,
    };

    // logger.info(`returned: ${JSON.stringify(_chatMessagesResponse)}`);

    return res.status(200).json(_chatMessagesResponse);
  };

}