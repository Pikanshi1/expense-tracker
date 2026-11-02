import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaChartLine, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      login(response.user, response.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to log in. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <Link to="/" className="auth-brand">
        <span className="auth-brand-icon"><FaChartLine /></span>
        <span>Expense <span>Tracker</span></span>
      </Link>

      <section className="auth-layout">
        <aside className="auth-story">
          <span className="auth-kicker">YOUR MONEY, IN BETTER FOCUS</span>
          <h1>A clearer view.<br /><em>A calmer mind.</em></h1>
          <p>Pick up right where you left off. Your spending, plans, and progress are all waiting in one place.</p>
          <div className="auth-story-card">
            <div className="auth-story-card-head"><span>YOUR FINANCIAL SPACE</span><FaShieldAlt /></div>
            <div className="auth-story-lines"><i /><i /><i /></div>
            <div className="auth-story-bottom"><span><b>One clear view</b><small>Everyday money, organized</small></span><span className="auth-story-spark"><FaChartLine /></span></div>
          </div>
          <div className="auth-story-foot"><span /> A thoughtful way to manage everyday finances</div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-mobile-kicker">WELCOME BACK</span>
            <h2>Good to see you again.</h2>
            <p>Log in to continue managing your money with clarity.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap"><FaEnvelope /><input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } })} /></div>
              {errors.email && <span className="auth-error">{errors.email.message}</span>}
            </div>

            <div className="auth-field">
              <div className="auth-label-row"><label htmlFor="login-password">Password</label><Link to="/forgot-password">Forgot password?</Link></div>
              <div className="auth-input-wrap"><FaLock /><input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" {...register("password", { required: "Password is required" })} /><button className="auth-eye" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              {errors.password && <span className="auth-error">{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit">{isSubmitting ? "Signing you in..." : "Log in to your account"} <FaArrowRight /></button>
          </form>

          <div className="auth-form-footer"><span>New to Expense Tracker?</span> <Link to="/register">Create an account</Link></div>
          <div className="auth-secure-note"><FaShieldAlt /> Your account is protected with secure authentication.</div>
        </section>
      </section>
      <footer className="auth-copyright">© {new Date().getFullYear()} Expense Tracker. Make every rupee count.</footer>
    </main>
  );
}

export default Login;
