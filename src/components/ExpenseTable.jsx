import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../lib/utils";
import EmptyState from "./EmptyState";

function ExpenseTable({
  expenses,
  emptyAction,
  emptyMessage = "Add your first expense to start building monthly summaries.",
  emptyTitle = "No expenses yet",
  onDelete,
  showActions = true,
  showType = true,
}) {
  if (!expenses.length) {
    return <EmptyState action={emptyAction} message={emptyMessage} title={emptyTitle} />;
  }

  return (
    <div className={`table-shell${showType ? "" : " table-shell-compact"}`}>
      <div className={`expense-table expense-table-head${showType ? "" : " expense-table-compact"}`}>
        <span>Date</span>
        <span>Category</span>
        <span>Description</span>
        <span>Amount</span>
        {showType ? <span>Type</span> : null}
        {showActions ? <span>Actions</span> : null}
      </div>

      {expenses.map((expense) => (
        <div
          className={`expense-table expense-table-row${showType ? "" : " expense-table-compact"}`}
          key={expense.id}
        >
          <span data-label="Date">{formatDate(expense.date)}</span>
          <span data-label="Category">
            <strong>{expense.category}</strong>
          </span>
          <span data-label="Description">{expense.description}</span>
          <span data-label="Amount">{formatCurrency(expense.amount)}</span>
          {showType ? (
            <span data-label="Type">
              <span className={`tag${expense.isRecurring ? " tag-recurring" : ""}`}>
                {expense.recurringSourceId ? "Auto-added" : expense.isRecurring ? "Recurring" : "One-time"}
              </span>
            </span>
          ) : null}

          {showActions ? (
            <span className="row-actions" data-label="Actions">
              <Link className="inline-link" to={`/expenses/${expense.id}/edit`}>
                Edit
              </Link>
              <button
                className="inline-link danger-link"
                onClick={() => onDelete?.(expense.id)}
                type="button"
              >
                Delete
              </button>
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ExpenseTable;
