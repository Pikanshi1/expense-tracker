import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaWallet,
  FaBullseye,
  FaReceipt,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaCheck,
  FaRegClock,
  FaCoins,
} from "react-icons/fa";

const features = [
  {
    icon: <FaWallet />,
    eyebrow: "DAILY CLARITY",
    title: "Know where your money goes",
    text: "Record income and expenses, organize transactions, and keep your financial activity in one clear place.",
    tone: "blue",
  },
  {
    icon: <FaChartLine />,
    eyebrow: "SMART ANALYTICS",
    title: "Turn activity into insight",
    text: "Explore spending patterns with clear visual reports that are based on your own transactions.",
    tone: "violet",
  },
  {
    icon: <FaBullseye />,
    eyebrow: "BETTER PLANNING",
    title: "Make every goal feel closer",
    text: "Set savings goals and build a budget that helps you make thoughtful day-to-day decisions.",
    tone: "mint",
  },
  {
    icon: <FaReceipt />,
    eyebrow: "LESS MANUAL WORK",
    title: "Keep receipts organized",
    text: "Bring receipt scanning into your workflow and review extracted details before saving a transaction.",
    tone: "amber",
    status: "COMING SOON",
  },
  {
    icon: <FaMapMarkedAlt />,
    eyebrow: "SPENDING CONTEXT",
    title: "See spending by place",
    text: "Optionally attach a place to an expense and explore where your spending happens.",
    tone: "rose",
    status: "COMING SOON",
  },
  {
    icon: <FaShieldAlt />,
    eyebrow: "YOUR FINANCES",
    title: "Stay in control",
    text: "Your records stay organized in your account, with tools designed to make everyday money management clearer.",
    tone: "cyan",
  },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -35px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame;
    const duration = 1500;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

function Metric({ label, amount, prefix = "₹", suffix = "", active }) {
  const value = useCountUp(amount, active);
  return (
    <div className="preview-metric">
      <span>{label}</span>
      <strong>{prefix}{value.toLocaleString("en-IN")}{suffix}</strong>
    </div>
  );
}

function DashboardPreview() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(true), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="hero-visual" aria-label="Illustrative preview of the finance dashboard">
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="floating-note note-top">
        <span className="note-icon note-green"><FaChartLine /></span>
        <span><b>Spending insight</b><small>See your patterns clearly</small></span>
      </div>
      <div className="floating-note note-bottom">
        <span className="note-icon note-purple"><FaBullseye /></span>
        <span><b>Goals in focus</b><small>Progress, one step at a time</small></span>
      </div>

      <div className="dashboard-window">
        <div className="dashboard-topbar">
          <div className="window-dots"><i /><i /><i /></div>
          <span>YOUR FINANCE OVERVIEW</span>
          <span className="live-indicator"><i /> PREVIEW</span>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-heading">
            <div><small>YOUR MONEY, AT A GLANCE</small><h3>Monthly overview</h3></div>
            <span className="period-pill">This month <span>⌄</span></span>
          </div>
          <div className="metric-grid">
            <Metric label="Income" amount={52000} active={active} />
            <Metric label="Expenses" amount={18450} active={active} />
            <Metric label="Available" amount={33550} active={active} />
          </div>
          <div className="chart-panel">
            <div className="chart-title"><span>Spending activity</span><small>Illustrative data</small></div>
            <div className="chart-legend"><span><i className="legend-blue" /> Income</span><span><i className="legend-violet" /> Expenses</span></div>
            <svg className={active ? "spending-chart chart-active" : "spending-chart"} viewBox="0 0 520 150" role="img" aria-label="Decorative sample spending trend chart">
              <defs>
                <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5B8CFF" stopOpacity=".24" />
                  <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="chart-gridline" d="M0 28H520 M0 68H520 M0 108H520" />
              <path className="chart-area" d="M0 103 C35 92 47 83 82 88 S133 57 170 70 S222 48 260 57 S312 35 346 48 S410 20 440 37 S490 18 520 24 V150 H0Z" />
              <path className="chart-line chart-line-blue" d="M0 103 C35 92 47 83 82 88 S133 57 170 70 S222 48 260 57 S312 35 346 48 S410 20 440 37 S490 18 520 24" />
              <path className="chart-line chart-line-violet" d="M0 125 C38 116 52 120 82 112 S136 99 170 108 S221 86 260 100 S310 83 346 91 S406 70 440 82 S489 67 520 72" />
            </svg>
            <div className="chart-months"><span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span></div>
          </div>
          <div className="dashboard-bottom">
            <div className="budget-mini"><span className="budget-icon"><FaCoins /></span><div><small>Flexible budget</small><b>Stay aware, spend mindfully</b></div><FaArrowRight /></div>
            <div className="secure-mini"><FaShieldAlt /> Private by design</div>
          </div>
        </div>
      </div>
      <div className="visual-caption"><span /> Product preview with illustrative values</div>
    </div>
  );
}

function Home() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("expense-landing-theme") || "light";
    } catch {
      return "light";
    }
  });

  useReveal();

  useEffect(() => {
    try {
      localStorage.setItem("expense-landing-theme", theme);
    } catch {
      // Theme still works for the current page when storage is unavailable.
    }
  }, [theme]);

  return (
    <main className="home-shell" data-theme={theme}>
      <div className="page-load-line" aria-hidden="true" />
      <nav className="landing-nav">
        <Link to="/" className="brand-mark" aria-label="Expense Tracker home">
          <span className="brand-symbol"><FaChartLine /></span>
          <span>Expense<span>Tracker</span></span>
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-switch"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/register" className="button-primary nav-cta">Get started <FaArrowRight /></Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-glow glow-left" />
        <div className="hero-glow glow-right" />
        <div className="hero-copy" data-reveal>
          <div className="eyebrow-pill"><span /> A calmer way to manage money</div>
          <h1>Make your money work <span>with you.</span></h1>
          <p className="hero-description">Track spending, shape smarter budgets, and understand your financial habits — with one clear view of your everyday money.</p>
          <div className="hero-actions">
            <Link to="/register" className="button-primary">Start managing smarter <FaArrowRight /></Link>
            <a href="#features" className="button-secondary">Explore features <span>↘</span></a>
          </div>
          <div className="hero-trust"><span><FaCheck /> Simple to use</span><span><FaCheck /> Your data, your decisions</span></div>
        </div>
        <div className="hero-preview-wrap" data-reveal>
          <DashboardPreview />
        </div>
        <div className="hero-scroll-cue"><span /> SCROLL TO EXPLORE</div>
      </section>

      <section className="intro-strip" id="about">
        <div data-reveal><span className="section-kicker">MONEY, MADE CLEARER</span><h2>Less guessing.<br /><em>More intention.</em></h2></div>
        <p data-reveal>Good financial habits start with visibility. Expensewise brings your transactions, budgets, goals, and insights together so you can make informed choices at your own pace.</p>
        <div className="intro-stamp" data-reveal><FaRegClock /><span>Built for<br />everyday life</span></div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading" data-reveal>
          <span className="section-kicker">A BETTER MONEY ROUTINE</span>
          <h2>Everything you need.<br /><em>Nothing you don't.</em></h2>
          <p>Thoughtful tools for the small decisions that add up over time.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className={`feature-card tone-${feature.tone}`} data-reveal key={feature.title} style={{ "--reveal-delay": `${index * 75}ms` }}>
              <div className="feature-card-top"><span className="feature-icon">{feature.icon}</span><span className="feature-index">{feature.status || `0${index + 1}`}</span></div>
              <span className="feature-eyebrow">{feature.eyebrow}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="feature-arrow"><FaArrowRight /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-heading" data-reveal>
          <span className="section-kicker">START WHERE YOU ARE</span>
          <h2>A simple rhythm.<br /><em>More confident choices.</em></h2>
        </div>
        <div className="steps-grid">
          <article className="step-card" data-reveal><span>01</span><div className="step-line" /><h3>Bring it together</h3><p>Add your income and expenses to create a clear picture of your activity.</p></article>
          <article className="step-card" data-reveal><span>02</span><div className="step-line" /><h3>Find your patterns</h3><p>Use categories, analytics, and budgets to understand where your money goes.</p></article>
          <article className="step-card" data-reveal><span>03</span><div className="step-line" /><h3>Move with intention</h3><p>Set goals and make adjustments that support the priorities that matter to you.</p></article>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="cta-orb cta-orb-one" /><div className="cta-orb cta-orb-two" />
        <div className="cta-content" data-reveal>
          <span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Make room for<br /><em>better money habits.</em></h2>
          <p>Start with a clearer picture. Build from there.</p>
          <Link to="/register" className="button-light">Create your free account <FaArrowRight /></Link>
        </div>
        <div className="cta-decoration" aria-hidden="true"><div className="cta-card"><span>Expense<span>Tracker</span></span><b>Clarity<br />looks good<br />on you.</b><i><FaChartLine /></i></div></div>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="brand-mark"><span className="brand-symbol"><FaChartLine /></span><span>Expense<span>Tracker</span></span></Link>
        <p>Make every rupee count.</p>
        <div><Link to="/login">Log in</Link><Link to="/register">Create account</Link><a href="#features">Features</a></div>
        <small>© {new Date().getFullYear()} Expensewise. Built for clearer everyday finances.</small>
      </footer>
    </main>
  );
}

export default Home;
