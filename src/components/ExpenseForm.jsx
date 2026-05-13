import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EXPENSE_CATEGORIES } from "../data/categories";
import { validateExpenseForm } from "../lib/validation";
import FormField from "./FormField";
import StatusBanner from "./StatusBanner";

function ExpenseForm({ cancelTo = "/expenses", initialValues, onSubmit, submitLabel }) {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateExpenseForm(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await onSubmit({
        ...formValues,
        amount: Number(formValues.amount),
      });
    } catch (error) {
      setFormError(error.message || "Unable to save this expense.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="content-card form-shell expense-editor-card" onSubmit={handleSubmit}>
      {formError ? <StatusBanner kind="error" message={formError} /> : null}

      <div className="form-grid form-grid-single">
        <FormField error={errors.amount} label="Amount">
          <input
            className="field-input"
            min="0"
            name="amount"
            onChange={handleChange}
            placeholder="Amount ($)"
            step="0.01"
            type="number"
            value={formValues.amount}
          />
        </FormField>

        <FormField error={errors.category} label="Category">
          <select
            className="field-input"
            name="category"
            onChange={handleChange}
            value={formValues.category}
          >
            <option value="">Category (Food, Bills, ...)</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={errors.date} label="Date">
          <input
            className="field-input"
            name="date"
            onChange={handleChange}
            placeholder="Date"
            type="date"
            value={formValues.date}
          />
        </FormField>

        <FormField
          error={errors.description}
          label="Description"
        >
          <textarea
            className="field-input field-textarea"
            name="description"
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            value={formValues.description}
          />
        </FormField>
      </div>

      <label className="checkbox-row feature-checkbox">
        <input
          checked={formValues.isRecurring}
          name="isRecurring"
          onChange={handleChange}
          type="checkbox"
        />
        <span>Repeat this expense every month automatically.</span>
      </label>

      <div className="form-actions">
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        <Link className="ghost-button" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default ExpenseForm;
