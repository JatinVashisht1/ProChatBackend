/**
 * Type that will be used to interact with user and to send responses.
 */

import { DeliveryStatus } from "../../utility/DeliveryStatusType";

export type DomainChatMessageModel = {
    senderUsername: string;
    receiverUsername: string;
    message: string;
    createdDate: string;
    createdMonth: string;
    createdYear: string;
    createdDay: string;
    createdTime: string;
    messageId: string;
    deliveryStatus: DeliveryStatus;
}