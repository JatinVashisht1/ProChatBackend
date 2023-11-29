import { autoInjectable, inject, singleton } from "tsyringe";
import { I_CHAT_MESSAGE_REPOSITORY } from "../../../../common/Constants";
import { IChatMessageRepository } from "../../domain/repository/IChatMessageRepository";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { messageDeliveryStateChecker } from "../../utility/messageDeliveryStateChecker";
import { stringToDeliveryStatus } from "../../utility/messageDeliveryStateAndStringMapper";
import { UpdateMessageDeliveryModel } from "../../domain/model/UpdateMessageDeliveryModel";
import { logger } from "../../../../common/winstonLoggerConfiguration";

@autoInjectable()
@singleton()
export class UpdateMessageDeliveryStateController {
  constructor(@inject(I_CHAT_MESSAGE_REPOSITORY) private chatMessageRepo?: IChatMessageRepository) { }

  updateMessageDeliveryStateHandler = async (
    updateMessageDeliveryModel: UpdateMessageDeliveryModel,
    onUpdatingDatabaseComplete: (from: string, to: string) => void,
  ) => {
    assertIsDefined(this.chatMessageRepo);
    logger.info(`update message delivery handler`);
    const updatedMessageDeliveryModelString = updateMessageDeliveryModel.toString();
    const updatedMessageDeliveryModelType = getUpdatedMessageDeliveryModel(updatedMessageDeliveryModelString);
    const { updatedStatus, messageId, from, to } = updatedMessageDeliveryModelType;

    const isUpdatedStatusValid = messageDeliveryStateChecker(updatedStatus);
    const deliveryStatus = stringToDeliveryStatus(updatedStatus);
    if (!isUpdatedStatusValid || !deliveryStatus) return;

    this.chatMessageRepo.updateChatMessageDeliveryState(messageId, deliveryStatus);
    
    onUpdatingDatabaseComplete(from, to);
  };
}

const getUpdatedMessageDeliveryModel = (updatedMessageDeliveryString: string): UpdateMessageDeliveryModel => {
  const updatedMessageDeliveryJson = JSON.parse(updatedMessageDeliveryString);
  const updatedMessageDeliveryModel: UpdateMessageDeliveryModel = {
    from: updatedMessageDeliveryJson["from"],
    to: updatedMessageDeliveryJson["to"],
    messageId: updatedMessageDeliveryJson["messageId"],
    updatedStatus: updatedMessageDeliveryJson["updatedStatus"]
  };

  return updatedMessageDeliveryModel;
};