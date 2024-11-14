import { notifications } from "@mantine/notifications";

type TNotification = {
  title: string;
  message: string;
  color: string;
};

export default function notification({ title, message, color }: TNotification) {
  return notifications.show({
    title: title,
    message: message,
    position: "top-right",
    color: color,
    radius: "lg",
  });
}
