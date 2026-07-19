import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { updateProfile } from "../services/authService";
import { changePassword } from "../services/authService";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaCamera,
  FaTrash,
} from "react-icons/fa";
import {
  uploadProfileImage,
  removeProfileImage,
} from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    transactions: 0,
    income: 0,
    expense: 0,
    balance: 0,
    highestExpense: 0,
    lowestExpense: 0,
    averageExpense: 0,
    favouriteCategory: "-",
  });
  const [preview, setPreview] = useState(
    user?.profileImage ? `http://localhost:5000${user.profileImage}` : "",
  );

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getExpenses();

      const expenses = data.expenses;

      const income = expenses
        .filter((item) => item.type.toLowerCase() === "income")
        .reduce((sum, item) => sum + item.amount, 0);

      const expense = expenses
        .filter((item) => item.type.toLowerCase() === "expense")
        .reduce((sum, item) => sum + item.amount, 0);

      const expenseOnly = expenses.filter(
        (item) => item.type.toLowerCase() === "expense",
      );

      const highestExpense =
        expenseOnly.length > 0
          ? Math.max(...expenseOnly.map((e) => e.amount))
          : 0;

      const lowestExpense =
        expenseOnly.length > 0
          ? Math.min(...expenseOnly.map((e) => e.amount))
          : 0;

      const averageExpense =
        expenseOnly.length > 0
          ? (
              expenseOnly.reduce((sum, e) => sum + e.amount, 0) /
              expenseOnly.length
            ).toFixed(2)
          : 0;

      // Favourite category
      const categoryCount = {};

      expenseOnly.forEach((item) => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      });

      const favouriteCategory =
        Object.keys(categoryCount).length > 0
          ? Object.keys(categoryCount).reduce((a, b) =>
              categoryCount[a] > categoryCount[b] ? a : b,
            )
          : "-";

      setStats({
        transactions: expenses.length,
        income,
        expense,
        balance: income - expense,
        highestExpense,
        lowestExpense,
        averageExpense,
        favouriteCategory,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const data = await uploadProfileImage(file);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileImage: data.profileImage,
        }),
      );

      window.location.reload();

      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleRemoveImage = async () => {
    try {
      await removeProfileImage();

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileImage: "",
        }),
      );

      setPreview("");

      toast.success("Profile picture removed");

      window.location.reload();
    } catch (error) {
      toast.error("Unable to remove image");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const data = await updateProfile(formData);

      updateUser(data.user);

      toast.success("Profile updated successfully!");

      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Left Section */}
          <div className="relative w-28 h-28 shrink-0">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <FaUserCircle size={112} className="text-gray-500" />
            )}

            {isEditing && preview && (
              <button
                onClick={handleRemoveImage}
                className="absolute bottom-0 left-0 translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
              >
                <FaTrash size={14} />
              </button>
            )}

            {isEditing && (
              <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                <FaCamera />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Middle Section */}
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full max-w-sm"
              />
            ) : (
              <h2 className="text-3xl font-bold">{user?.name}</h2>
            )}

            <div className="flex items-center gap-2 text-gray-600 mt-3">
              <FaEnvelope />

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full max-w-sm"
                />
              ) : (
                <span>{user?.email}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600 mt-3">
              <FaCalendarAlt />
              <span>
                {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex gap-3 self-start">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Transactions</p>
          <h2 className="text-3xl font-bold mt-2">{stats.transactions}</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Income</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{stats.income}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Expenses</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            ₹{stats.expense}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Balance</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ₹{stats.balance}
          </h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Expense Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Highest Expense</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            ₹{stats.highestExpense}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Lowest Expense</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{stats.lowestExpense}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Average Expense</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ₹{stats.averageExpense}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Favourite Category</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {stats.favouriteCategory}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Change Password</h2>

          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-6 space-y-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg p-3"
            />

            <button
              onClick={handleChangePassword}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Save Password
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Profile;
