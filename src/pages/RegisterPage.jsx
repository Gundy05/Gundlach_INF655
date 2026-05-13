import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateAuthForm } from "../lib/validation";
import FormField from "../components/FormField";
import StatusBanner from "../components/StatusBanner";

function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    const nextErrors = validateAuthForm(values, "register");
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsSubmitting(true);
    setBanner("");

    try {
      await register(values);
      navigate("/dashboard");
    } catch (error) {
      setBanner(error.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-wrapper">
      <div className="auth-card content-card auth-card-compact auth-card-register">
        <p className="eyebrow">Pocket Guard</p>
        <h1>REGISTER FOR POCKET GUARD</h1>
        <p className="auth-intro">
          Register once, then keep your expenses and monthly targets tied to your own account.
        </p>

        {banner ? <StatusBanner kind="error" message={banner} /> : null}

        <form className="stack-md" onSubmit={handleSubmit}>
          <FormField error={errors.name} label="Full name">
            <input
              className="field-input"
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              type="text"
              value={values.name}
            />
          </FormField>

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
                placeholder="Create Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
              />
            </div>
          </FormField>

          <FormField error={errors.confirmPassword} label="Confirm password">
            <div className="password-field-stack">
              <button
                className="password-toggle"
                onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                type="button"
              >
                {showConfirmPassword ? "Hide Password" : "Show Password"}
              </button>
              <input
                className="field-input"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
              />
            </div>
          </FormField>

          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-helper">
          Already have an account? <Link to="/login">Log in here.</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
