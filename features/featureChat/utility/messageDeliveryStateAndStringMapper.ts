import { DeliveryStatus } from "../domain/model/DeliveryStatusType";

// Function to cast string to DeliveryStatus enum
export function stringToDeliveryStatus(statusString: string): DeliveryStatus | undefined {
  switch (statusString.toLowerCase()) {
    case "sent":
      return "sent";
    case "received":
      return "received";
    case "read":
      return "read";
    default:
      return undefined;
  }
}
  
// Function to cast DeliveryStatus enum to string
export function deliveryStatusToString(status: DeliveryStatus): string {
  return status.toLowerCase();
}