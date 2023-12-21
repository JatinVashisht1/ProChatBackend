import { UpdateAllMessagesDeliveryStatusModel } from "../featureChat/domain/model/UpdateAllMessageDeliveryStatusModel";
import { UpdateMessageDeliveryModel } from "../featureChat/domain/model/UpdateMessageDeliveryModel";

export interface ServerToClientEvents {
  chat: (chatMessageBody: ChatMessageBody) => string;
  updateMessageDeliveryStatus: (updateMessageDeliveryModel: UpdateMessageDeliveryModel) => void;
  updateAllMessageDeliveryStatus: (updateAllMessagesDeliveryStatus: UpdateAllMessagesDeliveryStatusModel) => void;
  deleteChatMessages: (messageIds: string[], anotherUsername: string, initiatedBy: string) => void;
}

export type ChatMessageBody = {
  from: string;
  to: string;
  message: string;
  createdAt: number;
  deliveryStatus: string;
  messageId: string;
};

export interface ClientToServerEvents {
  chat: (chatMessageBody: ChatMessageBody) => void;
  updateMessageDeliveryStatus: (updateMessageDeliveryModel: UpdateMessageDeliveryModel) => void;
  updateAllMessageDeliveryStatus: (updateAllMessagesDeliveryStatus: UpdateAllMessagesDeliveryStatusModel) => void;
  deleteChatMessages: (messageIds: string[], anotherUsername: string, initiatedBy: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
