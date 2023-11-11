import { DeliveryStatus } from "../featureChat/utility/DeliveryStatusType";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chat: (chatMessageBody: ChatMessageBody) => string;
}

export type ChatMessageBody = { 
  from: string;
  to: string; 
  message: string; 
  createdAt: number; 
  deliveryStatus: DeliveryStatus; 
  messageId: string;
};

export interface ClientToServerEvents {
  chat: (chatMessageBody: ChatMessageBody) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
}
