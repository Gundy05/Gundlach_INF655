import { Link } from "react-router-dom";
import BudgetProgress from "../components/BudgetProgress";
import EmptyState from "../components/EmptyState";
import ExpenseCharts from "../components/ExpenseCharts";
import ExpenseTable from "../components/ExpenseTable";
import StatusBanner from "../components/StatusBanner";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import {
  buildCategoryTotals,
  buildMonthlyTotals,
  formatCurrency,
  getBudgetForMonth,
  getMonthKey,
  summarizeExpenses,
} from "../lib/utils";

function DashboardPage() {
  const { user } = useAuth();
  const { budgetGoals, dismissSystemNotice, error, expenses, loading, removeExpense, systemNotice } =
    useExpenses();

  const currentMonthKey = getMonthKey(new Date());
  const currentMonthExpenses = expenses.filter((expense) => expense.monthKey === currentMonthKey);
  const currentBudgetGoal = getBudgetForMonth(budgetGoals, currentMonthKey);
  const currentBudgetAmount = currentBudgetGoal?.amount || 0;
  const summary = summarizeExpenses(currentMonthExpenses, currentBudgetAmount);
  const categoryData = buildCategoryTotals(currentMonthExpenses);
  const monthlyData = buildMonthlyTotals(expenses, 6);
  const recentExpenses = expenses.slice(0, 5);
  const remainingBudget = Math.max(summary.remainingBudget, 0);
  const ringProgress = currentBudgetAmount
    ? Math.min((summary.totalSpent / currentBudgetAmount) * 100, 100)
    : 0;

  if (loading) {
    return <p className="loading-copy">Loading your dashboard...</p>;
  }

  async function handleDelete(expenseId) {
    const confirmed = window.confirm("Delete this expense?");

    if (!confirmed) {
      return;
    }

    await removeExpense(expenseId);
  }

  return (
    <div className="stack-xl dashboard-layout">
      <section className="page-heading dashboard-heading">
        <div className="heading-stack heading-stack-compact">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome, {user.displayName || user.email}</h1>
        </div>

        <div className="actions-row">
          <Link className="primary-button" to="/expenses/new">
            Add expense
          </Link>
        </div>
      </section>

      {systemNotice ? (
        <StatusBanner kind="success" message={systemNotice} onClose={dismissSystemNotice} />
      ) : null}

      {error ? <StatusBanner kind="error" message={error} /> : null}

      <section className="dashboard-board content-card">
        <div className="summary-grid summary-grid-dashboard">
        <SummaryCard
          detail="Current month total"
          eyebrow="Total spent this month"
          title="What has gone out so far"
          value={formatCurrency(summary.totalSpent)}
          variant="success"
        />
        <SummaryCard
          detail={summary.topCategory ? formatCurrency(summary.topCategory.amount) : "Add expenses to calculate"}
          eyebrow="Top category"
          title={summary.topCategory?.category || "No category yet"}
          value={summary.topCategory?.category || "--"}
        />
        <SummaryCard
          detail={currentBudgetAmount ? `of ${formatCurrency(currentBudgetAmount)}` : "Set a budget goal"}
          eyebrow="Remaining budget"
          ringProgress={ringProgress}
          title="Spending room left"
          value={currentBudgetAmount ? formatCurrency(remainingBudget) : "--"}
          variant="ring"
        />
        </div>

        <section className="recent-expense-panel">
          <div className="section-heading recent-expense-heading">
            <div>
              <h2>RECENT EXPENSES</h2>
            </div>
            <Link className="inline-link" to="/expenses">
              View all
            </Link>
          </div>

          {recentExpenses.length ? (
            <ExpenseTable expenses={recentExpenses} onDelete={handleDelete} showType={false} />
          ) : (
            <EmptyState
              action={
                <Link className="primary-button" to="/expenses/new">
                  Add your first expense
                </Link>
              }
              message="Once expenses are added, this dashboard will show recent activity and your monthly summary."
              title="Nothing to show yet"
            />
          )}
        </section>
      </section>

      <BudgetProgress budgetGoal={currentBudgetAmount} spent={summary.totalSpent} />

      <ExpenseCharts categoryData={categoryData} monthlyData={monthlyData} />
    </div>
  );
}

export default DashboardPage;
