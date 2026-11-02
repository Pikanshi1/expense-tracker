import { usePreferences } from "../context/PreferencesContext";
function RecentTransactions({ expenses = [] }) {
  const { formatCurrency } = usePreferences();
  const recent = [...expenses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  return <section className="app-card mt-8"><div className="flex items-center justify-between mb-5"><div><p className="eyebrow">LATEST ACTIVITY</p><h2 className="section-heading">Recent transactions</h2></div><span className="soft-chip">{recent.length} shown</span></div>
    {!recent.length ? <p className="muted-copy py-6">Your latest transactions will appear here.</p> : <div className="divide-y divide-[var(--line)]">{recent.map(item=><div key={item._id} className="transaction-row"><div className="transaction-icon">{item.type === "Income" ? "↙" : "↗"}</div><div className="min-w-0 flex-1"><p className="font-semibold truncate">{item.title}</p><p className="muted-copy text-sm">{item.category} · {new Date(item.date).toLocaleDateString()}</p></div><strong className={item.type === "Income" ? "text-emerald-500" : "text-rose-500"}>{item.type === "Income" ? "+" : "−"}{formatCurrency(item.amount)}</strong></div>)}</div>}
  </section>;
}
export default RecentTransactions;
