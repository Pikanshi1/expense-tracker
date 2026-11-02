import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import { getExpenses } from "../services/expenseService";
import ExpenseChart from "../components/ExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import RecentTransactions from "../components/RecentTransactions";
import { useAuth } from "../context/AuthContext";
import { getGoals } from "../services/goalService";
import { usePreferences } from "../context/PreferencesContext";
import { getAdaptiveBudget } from "../services/budgetService";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adaptive, setAdaptive] = useState(null);
  const { user } = useAuth();
  const { formatCurrency } = usePreferences();
  useEffect(() => {
    let active = true;
    Promise.all([getExpenses({ limit: 0 }), getGoals(), getAdaptiveBudget()]).then(([expenseData, goalData, adaptiveData]) => {
      if (!active) return;
      setExpenses(expenseData.expenses || []);
      setGoals(Array.isArray(goalData) ? goalData : (goalData.goals || []));
      setAdaptive(adaptiveData);
    }).catch(console.error).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  const stats = useMemo(() => {
    const incomeItems = expenses.filter(x => x.type === "Income");
    const expenseItems = expenses.filter(x => x.type === "Expense");
    const totalIncome = incomeItems.reduce((s,x)=>s+Number(x.amount||0),0);
    const totalExpense = expenseItems.reduce((s,x)=>s+Number(x.amount||0),0);
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: new Date(2000,i,1).toLocaleString("en",{month:"short"}), amount: expenseItems.filter(x => new Date(x.date).getMonth() === i && new Date(x.date).getFullYear() === new Date().getFullYear()).reduce((s,x)=>s+Number(x.amount||0),0) }));
    const byCategory = Object.entries(expenseItems.reduce((acc,x)=>{ acc[x.category]=(acc[x.category]||0)+Number(x.amount||0); return acc; },{})).map(([name,value])=>({name,value}));
    const amounts = expenseItems.map(x=>Number(x.amount||0));
    return { totalIncome,totalExpense,balance:totalIncome-totalExpense,monthlyData,byCategory,highest:Math.max(0,...amounts),lowest:amounts.length?Math.min(...amounts):0,average:amounts.length?amounts.reduce((a,b)=>a+b,0)/amounts.length:0 };
  }, [expenses]);
  const completedGoals = goals.filter(g => Number(g.savedAmount) >= Number(g.targetAmount)).length;
  if (loading) return <DashboardLayout><div className="page-loading">Preparing your financial overview…</div></DashboardLayout>;
  return <DashboardLayout>
    <section className="page-hero mb-8">
      <div><p className="eyebrow">YOUR MONEY, IN FOCUS</p><h1 className="display-heading">Welcome back, {user?.name?.split(" ")[0] || "there"}.</h1><p className="muted-copy">A clear view of your money, momentum and next move.</p></div>
      <div className="flex items-center gap-5"><div className="finance-visual" aria-hidden="true"><div className="visual-orb"/><div className="visual-card visual-card-back"/><div className="visual-card visual-card-front"><span>MONTHLY FLOW</span><strong>↗</strong><i/><i/><i/></div><div className="visual-spark">✦</div></div><Link to="/expenses/add" className="gradient-button">＋ Add transaction</Link></div>
    </section>
    <div className="metric-grid-app">
      <SummaryCard title="Net balance" amount={formatCurrency(stats.balance)} isCurrency={false} color="text-sky-500" accent="blue" />
      <SummaryCard title="Total income" amount={formatCurrency(stats.totalIncome)} isCurrency={false} color="text-emerald-500" accent="green" />
      <SummaryCard title="Total spending" amount={formatCurrency(stats.totalExpense)} isCurrency={false} color="text-rose-500" accent="pink" />
      <SummaryCard title="Transactions" amount={expenses.length} isCurrency={false} color="text-violet-500" accent="violet" />
      <SummaryCard title="Goals completed" amount={`${completedGoals}/${goals.length}`} isCurrency={false} color="text-amber-500" accent="amber" />
    </div>
    <section className={`app-card mt-8 border-l-4 ${adaptive?.percentageUsed >= 100 ? "border-rose-500" : adaptive?.percentageUsed >= 80 ? "border-amber-500" : "border-emerald-500"}`}>
      <div className="flex flex-wrap justify-between gap-5"><div><p className="eyebrow">ADAPTIVE DAILY BUDGET</p><h2 className="text-2xl font-bold">{adaptive?.configured ? "Today's spending allowance" : "Set your daily spending allowance"}</h2><p className="muted-copy mt-1">{adaptive?.configured ? `Based on ${adaptive.remainingDaysInMonth} remaining days in ${adaptive.timezone}.` : "Configure a monthly budget to get an intelligent daily allowance."}</p></div><strong className="text-3xl text-emerald-500">{formatCurrency(adaptive?.remainingAllowance || 0)}</strong></div>
      {adaptive?.configured && <><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm"><span>Spent today<strong className="block text-lg">{formatCurrency(adaptive.spentToday)}</strong></span><span>Monthly remaining<strong className="block text-lg">{formatCurrency(adaptive.remainingMonthlyBudget)}</strong></span><span>Daily allowance<strong className="block text-lg">{formatCurrency(adaptive.dailyAllowance)}</strong></span><span>Used<strong className="block text-lg">{Math.round(adaptive.percentageUsed)}%</strong></span></div><div className="h-3 rounded-full bg-slate-200 mt-5 overflow-hidden"><div className={`h-full transition-all ${adaptive.percentageUsed >= 100 ? "bg-rose-500" : adaptive.percentageUsed >= 80 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, adaptive.percentageUsed)}%` }} /></div><p className="muted-copy text-sm mt-3">{adaptive.percentageUsed >= 100 ? `Daily limit exceeded by ${formatCurrency(adaptive.exceededBy)}. Future allowance: ${formatCurrency(adaptive.futureDailyAllowance)}.` : `Remaining allowance is ${formatCurrency(adaptive.remainingAllowance)}. Future daily allowance: ${formatCurrency(adaptive.futureDailyAllowance)}.`}</p></>}
    </section>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8"><ExpenseChart data={stats.monthlyData}/><CategoryPieChart data={stats.byCategory}/></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
      <SummaryCard title="Largest expense" amount={formatCurrency(stats.highest)} isCurrency={false} color="text-rose-500" accent="pink" />
      <SummaryCard title="Smallest expense" amount={formatCurrency(stats.lowest)} isCurrency={false} color="text-emerald-500" accent="green" />
      <SummaryCard title="Average expense" amount={formatCurrency(stats.average)} isCurrency={false} color="text-violet-500" accent="violet" />
    </div>
    <RecentTransactions expenses={expenses}/>
  </DashboardLayout>;
}
