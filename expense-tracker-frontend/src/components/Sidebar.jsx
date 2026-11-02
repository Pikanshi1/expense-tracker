import { NavLink } from "react-router-dom";
import { FaHome, FaWallet, FaChartPie, FaUser, FaBell, FaRedo, FaBullseye, FaCalendarAlt, FaLightbulb } from "react-icons/fa";
const links = [
  ["/dashboard", "Dashboard", FaHome], ["/expenses", "Transactions", FaWallet], ["/analytics", "Analytics", FaChartPie], ["/budget", "Budgets", FaWallet], ["/goals", "Savings goals", FaBullseye], ["/recurring", "Recurring", FaRedo], ["/calendar", "Calendar", FaCalendarAlt], ["/insights", "AI insights", FaLightbulb], ["/notifications", "Notifications", FaBell], ["/profile", "Profile", FaUser],
];
export default function Sidebar({ onNavigate }) {
  return <aside className="app-sidebar"><div className="brand-lockup"><span className="brand-mark">✦</span><span>Expense<span className="brand-accent">Tracker</span><small>PERSONAL FINANCE</small></span></div><p className="sidebar-caption">WORKSPACE</p><nav className="sidebar-nav">{links.map(([to,label,Icon])=><NavLink key={to} to={to} onClick={onNavigate}
    className={({isActive})=>`sidebar-link ${isActive?"active":""}`}><Icon/><span>{label}</span></NavLink>)}</nav><div className="sidebar-foot"><span className="sidebar-foot-orb">✧</span><p>Small steps add up.</p><small>Keep your money moving with purpose.</small></div></aside>;
}
