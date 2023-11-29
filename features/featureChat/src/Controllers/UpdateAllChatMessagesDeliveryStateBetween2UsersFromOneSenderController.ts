import { autoInjectable, inject, singleton } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { UpdateAllMessagesDeliveryStatusModel } from "../../domain/model/UpdateAllMessageDeliveryStatusModel";
import { stringToDeliveryStatus } from "../../utility/messageDeliveryStateAndStringMapper";
import { logger } from "../../../../common/winstonLoggerConfiguration";

@autoInjectable()
@singleton()
export class UpdateAllChatMessageDeliveryStateBetween2UsersFromOneSenderController {
  constructor (@inject(I_CHAT_MESSAGE_REPOSITORY) private chatMessageRepository?: IChatMessageRepository) { }

  updateAllChatMessageDeliveryStateBetween2UsersFromOneSenderHandler = async(
    updateAllChatMessageBody: UpdateAllMessagesDeliveryStatusModel,
    onUpdatingDatabaseComplete: (updateAllChatMessageBodyParam: UpdateAllMessagesDeliveryStatusModel) => void,
  ) => {
    try {
      assertIsDefined(this.chatMessageRepository);
      const updateAllChatMessageBodyString = updateAllChatMessageBody.toString();
      const updateAllChatMessageBodyJson = JSON.parse(updateAllChatMessageBodyString) as UpdateAllMessagesDeliveryStatusModel;
      logger.info(`control has entered in update all messages state controller ${JSON.stringify(updateAllChatMessageBodyJson)}`);
      const messageDeliveryStatus = stringToDeliveryStatus(updateAllChatMessageBodyJson.deliveryStatus);
      if (!messageDeliveryStatus) {
        throw Error("updateAllDeliveryStatusController: message delivery status is not provided.");
      }


      this.chatMessageRepository.updateAllChatMessageDeliveryStateBetween2UsersFromOneSender(updateAllChatMessageBodyJson.from, updateAllChatMessageBodyJson.to, messageDeliveryStatus);      

      onUpdatingDatabaseComplete(updateAllChatMessageBodyJson);
    } catch (error) {
      logger.error(error);
    }
  };
}