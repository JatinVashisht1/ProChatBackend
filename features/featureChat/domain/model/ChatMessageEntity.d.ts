// import { UUID } from "crypto";
import { DeliveryStatus } from "./DeliveryStatusType";


/**
 * Domain object that will be sent to repository for inserting a new user
 */
export type ChatMessageEntity = {
  senderUsername: string;
  receiverUsername: string;
  message: string;
  deliveryStatus: DeliveryStatus;
  createdAt: number;
  messageId: string;
};