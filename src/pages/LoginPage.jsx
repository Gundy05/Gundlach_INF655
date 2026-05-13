import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateAuthForm } from "../lib/validation";
import FormField from "../components/FormField";
import StatusBanner from "../components/StatusBanner";

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate replace to="/dashboard" />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateAuthForm(values, "login");
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsSubmitting(true);
    setBanner("");

    try {
      await login(values);
      navigate(redirectPath);
    } catch (error) {
      setBanner(error.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-wrapper">
      <div className="auth-card content-card auth-card-compact">
        <p className="eyebrow">Pocket Guard</p>
        <h1>LOGIN</h1>
        <p className="auth-intro">
          Jump back into your dashboard, expenses, and monthly budget progress.
        </p>

        {banner ? <StatusBanner kind="error" message={banner} /> : null}

        <form className="stack-md" onSubmit={handleSubmit}>
          <FormField error={errors.email} label="Email address">
            <input
              className="field-input"
              name="email"
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              value={values.email}
            />
          </FormField>

          <FormField error={errors.password} label="Password">
            <div className="password-field-stack">
              <button
                className="password-toggle"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                type="button"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
              <input
                className="field-input"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
              />
            </div>
          </FormField>

          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-helper">
          Need an account? <Link to="/register">Register here.</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
