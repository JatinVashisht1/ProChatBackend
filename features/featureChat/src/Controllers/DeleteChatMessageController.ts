import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import createHttpError from "http-errors";

interface deleteChatMessageBody {
	messageId?: string[];
}

@autoInjectable()
export class DeleteChatMessageController {
  constructor (@inject(I_CHAT_MESSAGE_REPOSITORY) private chatRepo?: IChatMessageRepository) { }

  deleteChatMessageRequestHandler: RequestHandler<unknown, unknown, deleteChatMessageBody> = async(req, res, next) => {
    try {
      assertIsDefined(this.chatRepo);
      const { messageId } = req.body;
      const { username } = req;
      if (!messageId) {
        throw createHttpError(412, "message id is required");
      }

      const hasMessageDeleted = await this.chatRepo.deleteChatMessage(username, messageId);

      if (hasMessageDeleted) {
        return res.status(200).json({ success: true, message: "message deleted successfully" });
      } else {
        return res.status(400).json({ success: false, message: "unable to delete the message" });
      }
			
    } catch (error) {
      next (error);
    }
  };

}