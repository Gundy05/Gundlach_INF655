import { useParams, Link, useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import StatusBanner from "../components/StatusBanner";
import { useExpenses } from "../context/ExpenseContext";
import { toInputDate } from "../lib/utils";

const defaultValues = {
  amount: "",
  category: "",
  date: toInputDate(new Date()),
  description: "",
  isRecurring: false,
};

function ExpenseFormPage() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const { addExpense, editExpense, error, expenses, loading } = useExpenses();
  const editingExpense = expenses.find((expense) => expense.id === expenseId);
  const isEditing = Boolean(expenseId);

  async function handleSubmit(values) {
    if (isEditing) {
      await editExpense(expenseId, values);
      navigate("/expenses", {
        state: {
          message: "Expense updated successfully.",
        },
      });
      return;
    }

    await addExpense(values);
    navigate("/expenses", {
      state: {
        message: "Expense added successfully.",
      },
    });
  }

  if (loading && isEditing) {
    return <p className="loading-copy">Loading your expense...</p>;
  }

  if (isEditing && !editingExpense) {
    return (
      <section className="content-card stack-md">
        <p className="eyebrow">Expense not found</p>
        <h1>That expense could not be loaded.</h1>
        <p>It may have been deleted already, or the link is out of date.</p>
        <Link className="primary-button" to="/expenses">
          Return to expenses
        </Link>
      </section>
    );
  }

  return (
    <div className="stack-xl expense-form-layout">
      <section className="page-heading page-heading-centered">
        <div className="heading-stack heading-stack-centered">
          <p className="eyebrow">{isEditing ? "Edit expense" : "Add expense"}</p>
          <h1>{isEditing ? "UPDATE EXPENSE" : "ADD NEW EXPENSE"}</h1>
        </div>
      </section>

      {error ? <StatusBanner kind="error" message={error} /> : null}

      <ExpenseForm
        cancelTo="/expenses"
        initialValues={editingExpense || defaultValues}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Save expense" : "Save expense"}
      />
    </div>
  );
}

export default ExpenseFormPage;
