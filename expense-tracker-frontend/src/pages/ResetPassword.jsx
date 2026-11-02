import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaChartLine, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password", "");

  const onSubmit = async ({ password: newPassword }) => {
    try {
      const response = await resetPassword(token, newPassword);
      toast.success(response.message || "Password reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "This reset link may have expired. Request a new one.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <Link to="/" className="auth-brand"><span className="auth-brand-icon"><FaChartLine /></span><span>expense<span>wise</span></span></Link>
      <section className="auth-layout auth-layout-single">
        <section className="auth-form-panel auth-standalone-panel">
          <div className="auth-icon-large"><FaLock /></div>
          <div className="auth-form-heading">
            <span className="auth-mobile-kicker">SECURE YOUR ACCOUNT</span>
            <h2>Create a new password.</h2>
            <p>Choose a strong password you haven't used for this account before.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-field">
              <label htmlFor="new-password">New password</label>
              <div className="auth-input-wrap"><FaLock /><input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter a new password" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Use at least 8 characters" }, validate: (value) => /[A-Z]/.test(value) && /\d/.test(value) || "Include an uppercase letter and a number" })} /><button className="auth-eye" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              {errors.password && <span className="auth-error">{errors.password.message}</span>}
            </div>
            <div className="auth-field">
              <label htmlFor="confirm-new-password">Confirm new password</label>
              <div className="auth-input-wrap"><FaLock /><input id="confirm-new-password" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Enter it one more time" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" })} /><button className="auth-eye" type="button" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? "Hide password" : "Show password"}>{showConfirm ? <FaEyeSlash /> : <FaEye />}</button></div>
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
            </div>
            <div className="auth-password-checks"><span className={password.length >= 8 ? "valid" : ""}><FaCheckCircle /> At least 8 characters</span><span className={/[A-Z]/.test(password) ? "valid" : ""}><FaCheckCircle /> One uppercase letter</span><span className={/\d/.test(password) ? "valid" : ""}><FaCheckCircle /> One number</span></div>
            <button type="submit" disabled={isSubmitting} className="auth-submit">{isSubmitting ? "Updating password..." : "Save new password"} <FaArrowRight /></button>
          </form>
          <Link to="/login" className="auth-back-link">Back to login</Link>
        </section>
      </section>
      <footer className="auth-copyright">© {new Date().getFullYear()} Expensewise. Make every rupee count.</footer>
    </main>
  );
}

export default ResetPassword;
