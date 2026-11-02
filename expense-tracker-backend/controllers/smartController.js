const Expense = require("../models/expense");
const Budget = require("../models/Budget");

const getInsights = async (req, res) => {
  try {
    const [expenses, budgets] = await Promise.all([
      Expense.find({ user: req.user.id }).sort({ date: -1 }).limit(5000).lean(),
      Budget.find({ user: req.user.id, month: new Date().getMonth(), year: new Date().getFullYear() }).lean(),
    ]);
    const income = expenses.filter(x => x.type === "Income").reduce((s, x) => s + x.amount, 0);
    const spend = expenses.filter(x => x.type === "Expense").reduce((s, x) => s + x.amount, 0);
    const categoryTotals = {};
    expenses.filter(x => x.type === "Expense").forEach(x => { categoryTotals[x.category] = (categoryTotals[x.category] || 0) + x.amount; });
    const topCategory = Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0];
    const insights = [];
    if (!expenses.length) insights.push({ title: "Start with a transaction", detail: "Add income or an expense to unlock personal trends and budget suggestions.", tone: "info" });
    if (income > 0) insights.push({ title: "Cash flow snapshot", detail: `Recorded income is ${income.toFixed(2)} and recorded spending is ${spend.toFixed(2)}. Net cash flow is ${(income-spend).toFixed(2)}.`, tone: income >= spend ? "positive" : "warning" });
    if (topCategory) insights.push({ title: "Largest spending category", detail: `${topCategory[0]} is your largest recorded expense category at ${topCategory[1].toFixed(2)}. Review recent transactions in this category for opportunities to adjust.`, tone: "insight" });
    budgets.forEach(b => {
      const used = categoryTotals[b.category] || 0;
      const pct = b.amount ? used / b.amount * 100 : 0;
      if (pct >= 80) insights.push({ title: `${b.category} budget alert`, detail: `You have used ${pct.toFixed(0)}% of this month's ${b.category} budget.`, tone: pct >= 100 ? "warning" : "caution" });
    });
    const last30 = expenses.filter(x => new Date(x.date) >= new Date(Date.now() - 30*86400000) && x.type === "Expense").reduce((s,x)=>s+x.amount,0);
    const previous30 = expenses.filter(x => { const d=new Date(x.date); return d < new Date(Date.now()-30*86400000) && d >= new Date(Date.now()-60*86400000) && x.type === "Expense"; }).reduce((s,x)=>s+x.amount,0);
    if (previous30 > 0) {
      const change = ((last30-previous30)/previous30)*100;
      insights.push({ title: "30-day spending comparison", detail: `Your recorded spending in the last 30 days is ${Math.abs(change).toFixed(1)}% ${change >= 0 ? "higher" : "lower"} than the previous 30 days.`, tone: change > 15 ? "caution" : "positive" });
    }
    let aiSummary = null;
    if (process.env.GROQ_API_KEY && insights.length) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", temperature: 0.2, max_tokens: 350, messages: [
            { role: "system", content: "Give cautious, nonjudgmental personal finance observations. Use only supplied facts. Do not invent data or give investment advice." },
            { role: "user", content: JSON.stringify({ income, spend, categoryTotals, insights }) }
          ] })
        });
        if (response.ok) { const data = await response.json(); aiSummary = data.choices?.[0]?.message?.content || null; }
      } catch (_) { /* Keep deterministic insights available if the optional AI service is down. */ }
    }
    return res.json({ generatedAt: new Date(), currency: "INR", totals: { income, spend, balance: income-spend }, insights, aiSummary, aiEnabled: Boolean(process.env.GROQ_API_KEY) });
  } catch (error) { return res.status(500).json({ message: "Unable to generate insights." }); }
};

const getExchangeRates = async (req, res) => {
  try {
    const base = String(req.query.base || "INR").toUpperCase();
    if (!/^[A-Z]{3}$/.test(base)) return res.status(400).json({ message: "Invalid currency code." });
    const response = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
    if (!response.ok) return res.status(502).json({ message: "Exchange-rate provider is unavailable." });
    const data = await response.json();
    return res.json(data);
  } catch (error) { return res.status(502).json({ message: "Unable to retrieve exchange rates." }); }
};

module.exports = { getInsights, getExchangeRates };
