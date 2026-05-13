import { useEffect, useState } from "react";
import BudgetProgress from "../components/BudgetProgress";
import FormField from "../components/FormField";
import StatusBanner from "../components/StatusBanner";
import { useExpenses } from "../context/ExpenseContext";
import {
  buildBudgetHistory,
  formatCurrency,
  getBudgetForMonth,
  getMonthKey,
  getMonthLabel,
  summarizeExpenses,
} from "../lib/utils";
import { validateBudgetGoal } from "../lib/validation";

function buildMonthOptions() {
  const months = [];

  for (let offset = -2; offset <= 4; offset += 1) {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    months.push(getMonthKey(date));
  }

  return months;
}

function SettingsPage() {
  const { budgetGoals, expenses, saveBudgetGoal } = useExpenses();
  const [values, setValues] = useState({
    monthKey: getMonthKey(new Date()),
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState({ kind: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthOptions = buildMonthOptions();
  const selectedGoal = getBudgetForMonth(budgetGoals, values.monthKey);
  const history = buildBudgetHistory(budgetGoals);
  const currentMonthExpenses = expenses.filter(
    (expense) => expense.monthKey === getMonthKey(new Date()),
  );
  const currentMonthGoal = getBudgetForMonth(budgetGoals, getMonthKey(new Date()));
  const summary = summarizeExpenses(currentMonthExpenses, currentMonthGoal?.amount || 0);

  useEffect(() => {
    setValues((currentValues) => ({
      ...currentValues,
      amount: selectedGoal ? `${selectedGoal.amount}` : "",
    }));
  }, [selectedGoal]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateBudgetGoal(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsSubmitting(true);
    setBanner({ kind: "", message: "" });

    try {
      await saveBudgetGoal({
        monthKey: values.monthKey,
        amount: Number(values.amount),
      });
      setBanner({
        kind: "success",
        message: "Budget goal saved successfully.",
      });
    } catch (error) {
      setBanner({
        kind: "error",
        message: error.message || "Unable to save the budget goal.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="stack-xl">
      <section className="page-heading">
        <div className="heading-stack">
          <p className="eyebrow">Budget settings</p>
          <h1>Set monthly goals before spending drifts.</h1>
          <p>
            This page gives your dashboard a clear target so users can compare spending against a
            monthly cap.
          </p>
        </div>
      </section>

      <BudgetProgress budgetGoal={currentMonthGoal?.amount || 0} spent={summary.totalSpent} />

      {banner.message ? (
        <StatusBanner
          kind={banner.kind}
          message={banner.message}
          onClose={() => setBanner({ kind: "", message: "" })}
        />
      ) : null}

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Save a goal</p>
            <h2>Monthly budget form</h2>
          </div>
        </div>

        <form className="budget-form" onSubmit={handleSubmit}>
          <FormField error={errors.monthKey} label="Month">
            <select
              className="field-input"
              name="monthKey"
              onChange={handleChange}
              value={values.monthKey}
            >
              {monthOptions.map((monthKey) => (
                <option key={monthKey} value={monthKey}>
                  {getMonthLabel(monthKey)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField error={errors.amount} label="Budget amount">
            <input
              className="field-input"
              min="0"
              name="amount"
              onChange={handleChange}
              placeholder="2000.00"
              step="0.01"
              type="number"
              value={values.amount}
            />
          </FormField>

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save budget goal"}
          </button>
        </form>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Goal history</p>
            <h2>Saved monthly targets</h2>
          </div>
        </div>

        {history.length ? (
          <div className="goal-history">
            {history.map((goal) => (
              <div className="goal-row" key={goal.id}>
                <div>
                  <strong>{getMonthLabel(goal.monthKey)}</strong>
                  <p>Budget target</p>
                </div>
                <span>{formatCurrency(goal.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No budget goals saved yet.</p>
        )}
      </section>
    </div>
  );
}

export default SettingsPage;
