import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaChartLine, FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const response = await forgotPassword(email);
      setSent(true);
      toast.success(response.message || "If an account exists, a reset link has been sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send the reset link right now.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <Link to="/" className="auth-brand"><span className="auth-brand-icon"><FaChartLine /></span><span>expense<span>wise</span></span></Link>
      <section className="auth-layout auth-layout-single">
        <section className="auth-form-panel auth-standalone-panel">
          <div className="auth-icon-large"><FaEnvelope /></div>
          <div className="auth-form-heading">
            <span className="auth-mobile-kicker">ACCOUNT RECOVERY</span>
            <h2>{sent ? "Check your inbox." : "Forgot your password?"}</h2>
            <p>{sent ? "If an account is registered with that email, you'll receive a password reset link shortly. The link will expire in 15 minutes." : "No worries. Enter the email address linked to your account and we'll send you a secure reset link."}</p>
          </div>
          {!sent && (
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="auth-field">
                <label htmlFor="forgot-email">Email address</label>
                <div className="auth-input-wrap"><FaEnvelope /><input id="forgot-email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } })} /></div>
                {errors.email && <span className="auth-error">{errors.email.message}</span>}
              </div>
              <button type="submit" disabled={isSubmitting} className="auth-submit">{isSubmitting ? "Sending link..." : "Send reset link"} <FaPaperPlane /></button>
            </form>
          )}
          {sent && <button type="button" className="auth-submit auth-resend" onClick={() => setSent(false)}>Try another email address</button>}
          <Link to="/login" className="auth-back-link"><FaArrowLeft /> Back to login</Link>
        </section>
      </section>
      <footer className="auth-copyright">© {new Date().getFullYear()} Expensewise. Make every rupee count.</footer>
    </main>
  );
}

export default ForgotPassword;
