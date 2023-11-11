import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { ChatMessageRepository } from "../../data/repository/ChatMessageRepository";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";

// interface GetChatAccountsOfUserBody {
//   username: string;
// }

@autoInjectable()
export class GetChatAccountsOfUserController {
  constructor(
    @inject(I_CHAT_MESSAGE_REPOSITORY)
    private chatMessageRepository?: ChatMessageRepository
  ) {}

  getChatAccountsOfUserRequestHandler: RequestHandler<
    unknown,
    unknown,
    unknown,
    unknown
  > = async (req, res, next) => {
      try {
        const username = req.username;
        assertIsDefined(this.chatMessageRepository);

        if (!username || username.length === 0) {
          throw createHttpError(400, "username is required");
        }

        const userEntityList =
        await this.chatMessageRepository.getChatAccountsOfUser(username);

        const jsonResponse = {
          user: username,
          accounts: userEntityList
        };

        return res.status(200).json(jsonResponse);
      } catch (error) {
        logger.info(`error thrown in [get chat accounts controller]: ${error}`);
        next(error);
      }
    };
}
