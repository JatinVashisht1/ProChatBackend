import { randomUUID } from "crypto";
import { InferSchemaType, Schema, model } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    senderUsername: {
      type: String,
      required: true,
      
    },

    receiverUsername: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    deliveryStatus: {
      type: String,
      enum: ['sent', 'received', 'read'],
      required: true,
      default: 'sent'
    },

    messageId: {
      type: String,
      required: true,
      // TODO: make sure to change it later
      default: () => randomUUID()
    }
  }
);

export type ChatMessageType = InferSchemaType<typeof ChatMessageSchema>;

export const ChatMessageModel = model<ChatMessageType>(
  "ChatMessage",
  ChatMessageSchema
);
