import { autoInjectable, inject } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { Socket } from "socket.io";
import { DELETE_CHAT_MESSAGES } from "../../../../common/Events";

@autoInjectable()
export class DeleteChatMessagesViaSocketController {
  constructor (@inject(I_CHAT_MESSAGE_REPOSITORY) private chatRepo?: IChatMessageRepository) { }
  
  deleteChatMessagesViaSocketHandler = async (
    username: string, 
    messageIds: string[], 
    anotherUsername: string,
    socket: Socket,
    initiatedBy: string,
  ) => {
    try {
      assertIsDefined(this.chatRepo);
      const messageIdsString = messageIds.toString();
      const messageIdList = JSON.parse(messageIdsString);
      // logger.info(`message ids are ${messageIdList} ${typeof messageIdList}`);
      const result = await this.chatRepo.deleteChatMessage(username, messageIdList);
      logger.info(`result after deleting is ${result}`);

      socket.to(username).to(anotherUsername).emit(DELETE_CHAT_MESSAGES, messageIds, anotherUsername, initiatedBy);
      socket.broadcast.to(username).to(anotherUsername).emit(DELETE_CHAT_MESSAGES, messageIds, anotherUsername, initiatedBy);
    } catch (error) {
      logger.info(`unable to delete the messages due to ${error}`);
    }
  };
}