import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
} from "../services/notificationService";
import { toast } from "react-toastify";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    toast.success("Notification deleted");
    fetchNotifications();
  };

  const handleClear = async () => {
    await clearNotifications();
    toast.success("All notifications cleared");
    fetchNotifications();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>

        {notifications.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            You're all caught up 🎉
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-xl shadow-lg p-6 border-l-8 ${
                notification.type === "danger"
                  ? "border-red-600"
                  : notification.type === "warning"
                  ? "border-yellow-500"
                  : notification.type === "success"
                  ? "border-green-600"
                  : "border-blue-600"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {notification.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                      notification.isRead
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {notification.isRead ? "Read" : "Unread"}
                  </span>
                </div>

                <div className="flex gap-3">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleRead(notification._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notifications;