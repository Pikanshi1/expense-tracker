import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getSmartInsights } from "../services/smartService";
import { usePreferences } from "../context/PreferencesContext";
export default function Insights() {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const {formatCurrency}=usePreferences();
  useEffect(()=>{getSmartInsights().then(setData).catch(e=>setError(e.response?.data?.message||"Could not load insights.")).finally(()=>setLoading(false));},[]);
  return <DashboardLayout><div className="page-hero mb-8"><div><p className="eyebrow">PATTERNS, NOT GUESSES</p><h1 className="display-heading">Smart money insights</h1><p className="muted-copy">Observations based on your recorded transactions and current-month budgets.</p></div><span className="insight-orbit">✦</span></div>
    {loading?<div className="app-card">Analysing your transactions…</div>:error?<div className="app-card text-rose-500">{error}</div>:<>
      <div className="metric-grid-app"><div className="app-card"><p className="metric-label">Recorded income</p><strong className="metric-value text-emerald-500">{formatCurrency(data.totals.income)}</strong></div><div className="app-card"><p className="metric-label">Recorded spending</p><strong className="metric-value text-rose-500">{formatCurrency(data.totals.spend)}</strong></div><div className="app-card"><p className="metric-label">Net cash flow</p><strong className="metric-value text-sky-500">{formatCurrency(data.totals.balance)}</strong></div></div>
      {data.aiSummary&&<section className="app-card mt-6"><p className="eyebrow">AI SUMMARY</p><p className="insight-summary">{data.aiSummary}</p></section>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">{data.insights.map((item,i)=><article key={`${item.title}-${i}`} className={`app-card insight-card tone-${item.tone}`}><span className="insight-number">0{i+1}</span><h2>{item.title}</h2><p>{item.detail}</p></article>)}</div>
      <p className="muted-copy text-xs mt-5">{data.aiEnabled?"AI summary is enabled; calculations remain grounded in your transaction records.":"AI provider is not configured. These are transparent rule-based insights. Add GROQ_API_KEY to enable an optional AI-written summary."} This is informational guidance, not financial or investment advice.</p>
    </>}
  </DashboardLayout>;
}
