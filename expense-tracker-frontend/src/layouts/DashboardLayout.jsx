import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-stretch bg-gray-100">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div className="fixed top-0 left-0 z-50 h-screen md:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow flex items-center px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
            <FaBars />
          </button>

          <h2 className="ml-4 text-xl font-bold text-blue-600">
            Expense Tracker
          </h2>
        </div>

        <Navbar />

        <div className="p-4 md:p-8 min-w-0 overflow-x-hidden">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;