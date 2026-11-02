import { usePreferences } from "../context/PreferencesContext";
function SummaryCard({ title, amount, color = "text-sky-500", isCurrency = true, accent = "blue" }) {
  const { formatCurrency } = usePreferences();
  const display = isCurrency ? formatCurrency(amount) : amount;
  return <article className={`app-card metric-card accent-${accent}`}><div className="flex items-center justify-between gap-3"><p className="metric-label">{title}</p><span className="metric-orb" aria-hidden="true" /></div><h2 className={`metric-value ${color}`}>{display}</h2></article>;
}
export default SummaryCard;
