import { DeliveryStatus } from "../domain/model/DeliveryStatusType";

export function messageDeliveryStateChecker(updatedStatus: string): boolean {
  if (!updatedStatus || updatedStatus.length === 0) return false;
 
  return (["read", "sent", "received"] as DeliveryStatus[]).includes(updatedStatus as DeliveryStatus);
  // return Object.values(DeliveryStatus).includes(updatedStatus as DeliveryStatus);
}