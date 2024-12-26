import { Mail, UserPlus, AlertCircle, Check } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  isRead: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const iconMap = {
    "New message": Mail,
    "Friend request": UserPlus,
    "System update": AlertCircle,
    "Password changed": Check,
  };

  const Icon =
    iconMap[notification.title as keyof typeof iconMap] || AlertCircle;

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200">
      <div
        className={`rounded-full p-2 ${
          notification.isRead ? "bg-gray-200" : "bg-blue-500"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${
            notification.isRead ? "text-gray-500" : "text-white"
          }`}
        />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium">{notification.title}</p>
        <p className="text-sm text-gray-500">{notification.description}</p>
      </div>
    </div>
  );
}
