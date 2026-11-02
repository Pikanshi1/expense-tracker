import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { usePreferences } from "../context/PreferencesContext";
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme } = usePreferences();
  return <div className="app-shell" data-theme={theme}>
    <div className="desktop-sidebar"><Sidebar/></div>
    {sidebarOpen && <><button className="mobile-overlay" aria-label="Close navigation" onClick={()=>setSidebarOpen(false)}/><div className="mobile-drawer"><button className="drawer-close" onClick={()=>setSidebarOpen(false)} aria-label="Close navigation"><FaTimes/></button><Sidebar onNavigate={()=>setSidebarOpen(false)}/></div></>}
    <div className="app-main"><div className="mobile-topbar"><button onClick={()=>setSidebarOpen(true)} aria-label="Open navigation"><FaBars/></button><strong>Expense<span>Tracker</span></strong></div><Navbar/><main key={location.pathname} className="app-content">{children}</main></div>
  </div>;
}
