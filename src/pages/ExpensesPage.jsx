import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ExpenseFilters from "../components/ExpenseFilters";
import ExpenseTable from "../components/ExpenseTable";
import StatusBanner from "../components/StatusBanner";
import { useExpenses } from "../context/ExpenseContext";
import { filterExpenses } from "../lib/utils";

const defaultFilters = {
  search: "",
  category: "All",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  recurringOnly: false,
};

function ExpensesPage() {
  const { dismissSystemNotice, error, expenses, loading, removeExpense, systemNotice } = useExpenses();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const [flashMessage, setFlashMessage] = useState(location.state?.message || "");

  const filteredExpenses = filterExpenses(expenses, filters);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  async function handleDelete(expenseId) {
    const confirmed = window.confirm("Delete this expense?");

    if (!confirmed) {
      return;
    }

    await removeExpense(expenseId);
    setFlashMessage("Expense deleted successfully.");
  }

  if (loading) {
    return <p className="loading-copy">Loading your expenses...</p>;
  }

  return (
    <div className="stack-xl">
      <section className="page-heading">
        <div className="heading-stack">
          <p className="eyebrow">Expense list</p>
          <h1>Review, search, and manage every expense.</h1>
          <p>
            Use the filters below to narrow by date range, category, amount, or recurring status.
          </p>
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

      {flashMessage ? (
        <StatusBanner kind="success" message={flashMessage} onClose={() => setFlashMessage("")} />
      ) : null}

      {error ? <StatusBanner kind="error" message={error} /> : null}

      <ExpenseFilters filters={filters} onChange={handleChange} onReset={handleReset} />

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Results</p>
            <h2>
              {filteredExpenses.length} matching expense{filteredExpenses.length === 1 ? "" : "s"}
            </h2>
          </div>
        </div>

        {!expenses.length ? (
          <EmptyState
            action={
              <Link className="primary-button" to="/expenses/new">
                Add your first expense
              </Link>
            }
            message="Start with one expense entry, then the filters and charts will have data to work with."
            title="You do not have any expenses yet"
          />
        ) : filteredExpenses.length ? (
          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            message="Try widening the date range, changing the category, or clearing the amount filters."
            title="No expenses match the current filters"
          />
        )}
      </section>
    </div>
  );
}

export default ExpensesPage;

