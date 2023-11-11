export type ChatMessageDbEntity = {
    senderUsername: string;
    receiverUsername: string;
    message: string;
    deliveryStatus: DeliveryStatus;
    createdAt: Date;
    messageId: UUID;
};