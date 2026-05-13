import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { saveBudgetGoal as persistBudgetGoal, subscribeToBudgetGoals } from "../services/budgetService";
import {
  createExpense,
  deleteExpense,
  subscribeToExpenses,
  updateExpense,
} from "../services/expenseService";
import { buildRecurringDate, getMonthKey, sortExpenses } from "../lib/utils";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [systemNotice, setSystemNotice] = useState("");
  const lastRecurringSyncRef = useRef("");

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudgetGoals([]);
      setLoading(false);
      setError("");
      setSystemNotice("");
      lastRecurringSyncRef.current = "";
      return () => {};
    }

    setLoading(true);
    setError("");

    const unsubscribeExpenses = subscribeToExpenses(
      user.id,
      (nextExpenses) => {
        setExpenses(nextExpenses);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(subscriptionError.message || "Unable to load expenses.");
        setLoading(false);
      },
    );

    const unsubscribeBudgetGoals = subscribeToBudgetGoals(
      user.id,
      (nextBudgetGoals) => {
        setBudgetGoals(nextBudgetGoals);
      },
      (subscriptionError) => {
        setError(subscriptionError.message || "Unable to load budget goals.");
      },
    );

    return () => {
      unsubscribeExpenses();
      unsubscribeBudgetGoals();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !expenses.length) {
      return;
    }

    const activeMonthKey = getMonthKey(new Date());
    const syncMarker = `${user.id}:${activeMonthKey}`;

    if (lastRecurringSyncRef.current === syncMarker) {
      return;
    }

    lastRecurringSyncRef.current = syncMarker;

    const templates = expenses.filter(
      (expense) => expense.isRecurring && !expense.recurringSourceId && expense.monthKey !== activeMonthKey,
    );

    const expensesToCreate = templates.filter((template) => {
      const existingRecurringCopy = expenses.find(
        (expense) =>
          expense.recurringSourceId === template.id && expense.monthKey === activeMonthKey,
      );

      return !existingRecurringCopy;
    });

    if (!expensesToCreate.length) {
      return;
    }

    async function syncRecurringExpenses() {
      for (const template of expensesToCreate) {
        await createExpense(user.id, {
          amount: template.amount,
          category: template.category,
          description: template.description,
          date: buildRecurringDate(template.date, activeMonthKey),
          isRecurring: true,
          recurringSourceId: template.id,
        });
      }

      setSystemNotice(
        `${expensesToCreate.length} recurring expense${expensesToCreate.length === 1 ? "" : "s"} synced for this month.`,
      );
    }

    syncRecurringExpenses().catch((syncError) => {
      lastRecurringSyncRef.current = "";
      setError(syncError.message || "Unable to sync recurring expenses.");
    });
  }, [expenses, user]);

  async function addExpense(values) {
    if (!user) {
      throw new Error("You must be logged in to add an expense.");
    }

    const nextExpense = await createExpense(user.id, values);
    setExpenses((currentExpenses) => sortExpenses([nextExpense, ...currentExpenses]));
    return nextExpense;
  }

  async function editExpense(expenseId, values) {
    if (!user) {
      throw new Error("You must be logged in to update an expense.");
    }

    const nextExpense = await updateExpense(expenseId, user.id, values);

    setExpenses((currentExpenses) =>
      sortExpenses(
        currentExpenses.map((expense) => (expense.id === expenseId ? nextExpense : expense)),
      ),
    );

    return nextExpense;
  }

  async function removeExpense(expenseId) {
    await deleteExpense(expenseId);
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== expenseId));
  }

  async function saveBudgetGoal(values) {
    if (!user) {
      throw new Error("You must be logged in to save a budget goal.");
    }

    const nextGoal = await persistBudgetGoal(user.id, values);
    setBudgetGoals((currentGoals) =>
      [nextGoal, ...currentGoals.filter((goal) => goal.id !== nextGoal.id)].sort((left, right) =>
        right.monthKey.localeCompare(left.monthKey),
      ),
    );
    return nextGoal;
  }

  function dismissSystemNotice() {
    setSystemNotice("");
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgetGoals,
        loading,
        error,
        systemNotice,
        addExpense,
        editExpense,
        removeExpense,
        saveBudgetGoal,
        dismissSystemNotice,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used inside ExpenseProvider.");
  }

  return context;
}
