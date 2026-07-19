import { Link } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaChartPie,
  FaUser,
  FaBell,
  FaRedo,
  FaBullseye,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 shrink-0 h-full">
      <h2 className="text-2xl font-bold mb-8">Expense Tracker</h2>

      <nav className="space-y-4 mt-8">
        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/dashboard"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/expenses"
        >
          <FaWallet />
          Expenses
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/analytics"
        >
          <FaChartPie />
          Analytics
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/budget"
        >
          <FaWallet />
          Budget
        </Link>

        <Link
          to="/goals"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
        >
          <FaBullseye size={20} />
          <span>Goals</span>
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/recurring"
        >
          <FaRedo />
          Recurring
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/profile"
        >
          <FaUser />
          Profile
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.innerWidth < 768 && window.location.reload()}
          to="/notifications"
        >
          <FaBell />
          Notifications
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
