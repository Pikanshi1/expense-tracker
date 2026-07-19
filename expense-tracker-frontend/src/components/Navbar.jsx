import { Link, useNavigate  } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

function Navbar() {
  const { user , logout} = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}

      <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600">
        Expense
        <span className="text-gray-800">Tracker</span>
      </Link>

      {/* Right Section */}

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Notification */}

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <FaBell size={22} className="cursor-pointer" />

                {unread > 0 && (
                  <span
                    className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-600
                    text-white
                    text-xs
                    rounded-full
                    min-w-5
                    h-5
                    flex
                    items-center
                    justify-center
                    px-1
                  "
                  >
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  bg-white
                  rounded-xl
                  shadow-xl
                  border
                  z-50
                "
                >
                  <div
                    className="
                    flex
                    justify-between
                    items-center
                    p-4
                    border-b
                  "
                  >
                    <h2 className="font-bold text-lg">Notifications</h2>

                    {notifications.length > 0 && unread > 0 && (
                      <button
                        onClick={async () => {
                          await markAllAsRead();
                          loadNotifications();
                        }}
                        className="
                          text-sm
                          text-blue-600
                          hover:underline
                        "
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={async () => {
                          await markAsRead(notification._id);

                          loadNotifications();
                        }}
                        className={`
                          p-4
                          border-b
                          cursor-pointer
                          hover:bg-gray-50
                          ${!notification.isRead ? "bg-blue-50" : ""}
                        `}
                      >
                        <h3 className="font-semibold">{notification.title}</h3>

                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl"
              >
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:5000${user.profileImage}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={32} />
                )}

                <span className="hidden sm:block font-medium">
                  {user?.name}
                </span>
              </button>

              {showProfile && (
                <div
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border p-2 z-50"
                >
                  <Link to="/profile" onClick={() => setShowProfile(false)} className="block w-full px-4 py-3 rounded-lg hover:bg-gray-100">Profile</Link>

                  <button className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Guest User

          <div className="flex gap-3">
            <Link
              to="/login"
              className="
                px-5
                py-2
                rounded-xl
                border
                border-blue-600
                text-blue-600
                hover:bg-blue-50
                transition
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                px-5
                py-2
                rounded-xl
                bg-blue-600
                text-white
                hover:bg-blue-700
                transition
              "
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
