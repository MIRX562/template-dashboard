import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  type: "read" | "unread";
}

export function NotificationList({ type }: NotificationListProps) {
  // This is mock data. In a real application, you'd fetch this from an API
  const notifications = [
    {
      id: 1,
      title: "New message",
      description: "You have a new message",
      isRead: false,
    },
    {
      id: 2,
      title: "Friend request",
      description: "You have a new friend request",
      isRead: false,
    },
    {
      id: 3,
      title: "System update",
      description: "System update completed",
      isRead: true,
    },
    {
      id: 4,
      title: "Password changed",
      description: "Your password was changed successfully",
      isRead: true,
    },
  ];

  const filteredNotifications = notifications.filter((notification) =>
    type === "read" ? notification.isRead : !notification.isRead
  );

  return (
    <div className="space-y-4 py-4">
      {filteredNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {filteredNotifications.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No {type} notifications
        </p>
      )}
    </div>
  );
}
