import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { DomainChatMessageModel } from "../../domain/model/DomainChatMessageModel";

// interface getChatMessagesBetween2UsernamesUrlBody {
//   anotherUsername: string;
// }

interface chatMessageResponse {
  username1: string;
  username2: string;
  messages: DomainChatMessageModel[];
}

@autoInjectable()
export class GetChatMessagesBetween2UsernamesController {
  constructor(
    @inject(I_CHAT_MESSAGE_REPOSITORY)
    private chatMessageRepository?: IChatMessageRepository
  ) {}

  getChatMessagesBetween2UsernamesRequestHandler: RequestHandler<
    {anotherUsername: string},
    chatMessageResponse,
    unknown,
    unknown
  > = async (req, res) => {
      assertIsDefined(this.chatMessageRepository);
      
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
