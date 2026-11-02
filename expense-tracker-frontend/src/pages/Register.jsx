import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaChartLine, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;
      await registerUser(data);
      toast.success("Your account is ready. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create your account. Please try again.");
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
  ];

  return (
    <main className="auth-page auth-register-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <Link to="/" className="auth-brand">
        <span className="auth-brand-icon"><FaChartLine /></span>
        <span>Expense <span>Tracker</span></span>
      </Link>

      <section className="auth-layout auth-layout-register">
        <aside className="auth-story">
          <span className="auth-kicker">A FRESH START WITH YOUR FINANCES</span>
          <h1>Build better habits.<br /><em>At your own pace.</em></h1>
          <p>Bring your everyday money into focus with simple tools for tracking, planning, and reaching the goals that matter to you.</p>
          <div className="auth-benefit-list">
            <span><FaCheckCircle /> Understand your spending patterns</span>
            <span><FaCheckCircle /> Set budgets that work for you</span>
            <span><FaCheckCircle /> Keep your goals in sight</span>
          </div>
          <div className="auth-story-foot"><span /> Your next step starts with a clearer picture</div>
        </aside>

        <section className="auth-form-panel auth-form-panel-register">
          <div className="auth-form-heading">
            <span className="auth-mobile-kicker">GET STARTED</span>
            <h2>Create your account.</h2>
            <p>A few details and you'll be ready to go.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <div className="auth-input-wrap"><FaUser /><input id="register-name" autoComplete="name" placeholder="Enter your name" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })} /></div>
              {errors.name && <span className="auth-error">{errors.name.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <div className="auth-input-wrap"><FaEnvelope /><input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } })} /></div>
              {errors.email && <span className="auth-error">{errors.email.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>
              <div className="auth-input-wrap"><FaLock /><input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" }, validate: (value) => /[A-Z]/.test(value) && /\d/.test(value) || "Include at least one uppercase letter and one number" })} /><button className="auth-eye" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              {errors.password && <span className="auth-error">{errors.password.message}</span>}
              <div className="auth-password-checks">{passwordChecks.map((item) => <span className={item.valid ? "valid" : ""} key={item.label}><FaCheckCircle /> {item.label}</span>)}</div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm">Confirm password</label>
              <div className="auth-input-wrap"><FaLock /><input id="register-confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" })} /><button className="auth-eye" type="button" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? "Hide password" : "Show password"}>{showConfirm ? <FaEyeSlash /> : <FaEye />}</button></div>
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit">{isSubmitting ? "Creating your account..." : "Create my account"} <FaArrowRight /></button>
          </form>

          <div className="auth-form-footer"><span>Already have an account?</span> <Link to="/login">Log in</Link></div>
        </section>
      </section>
      <footer className="auth-copyright">© {new Date().getFullYear()} Expense Tracker. Make every rupee count.</footer>
    </main>
  );
}

export default Register;
