import { UpdateAllMessagesDeliveryStatusModel } from "../featureChat/domain/model/UpdateAllMessageDeliveryStatusModel";
import { UpdateMessageDeliveryModel } from "../featureChat/domain/model/UpdateMessageDeliveryModel";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chat: (chatMessageBody: ChatMessageBody) => string;
  updateMessageDeliveryStatus: (updateMessageDeliveryModel: UpdateMessageDeliveryModel) => void;
  updateAllMessageDeliveryStatus: (updateAllMessagesDeliveryStatus: UpdateAllMessagesDeliveryStatusModel) => void;
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
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
