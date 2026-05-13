import { formatCurrency } from "../lib/utils";

function BudgetProgress({ spent, budgetGoal }) {
  const safeBudgetGoal = Number(budgetGoal || 0);
  const percentage = safeBudgetGoal ? Math.min((spent / safeBudgetGoal) * 100, 100) : 0;

  return (
    <section className="content-card budget-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Monthly budget</p>
          <h2>How close are you to this month&apos;s limit?</h2>
        </div>
        <div className="budget-values">
          <strong>{formatCurrency(spent)}</strong>
          <span>
            {safeBudgetGoal ? `of ${formatCurrency(safeBudgetGoal)}` : "No goal set yet"}
          </span>
        </div>
      </div>

      <div className="budget-track" aria-hidden="true">
        <span className="budget-fill" style={{ width: `${percentage}%` }} />
      </div>

      <p className="budget-note">
        {safeBudgetGoal
          ? percentage >= 100
            ? "You have reached this month's budget. Review the spending list for the fastest cuts."
            : `${formatCurrency(safeBudgetGoal - spent)} left before you hit your target.`
          : "Add a goal on the Budget page to see remaining spend for the month."}
      </p>
    </section>
  );
}

export default BudgetProgress;

