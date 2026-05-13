import { CATEGORY_COLORS } from "../data/categories";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function toIsoDateTime(value) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  return new Date(value).toISOString();
}

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  return longDateFormatter.format(new Date(`${value}T12:00:00`));
}

export function toInputDate(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function getMonthKey(value = new Date()) {
  const date = new Date(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return monthLabelFormatter.format(new Date(year, month - 1, 1));
}

export function getRecentMonthKeys(count = 6) {
  const months = [];
  const anchor = new Date();

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(anchor.getFullYear(), anchor.getMonth() - index, 1);
    months.push(getMonthKey(date));
  }

  return months;
}

export function normalizeExpense(rawExpense) {
  return {
    id: rawExpense.id,
    userId: rawExpense.userId,
    amount: Number(rawExpense.amount || 0),
    category: rawExpense.category || "Other",
    description: rawExpense.description || "",
    date: toInputDate(rawExpense.date),
    monthKey: rawExpense.monthKey || getMonthKey(rawExpense.date || new Date()),
    isRecurring: Boolean(rawExpense.isRecurring),
    recurringFrequency: rawExpense.isRecurring ? "monthly" : "none",
    recurringSourceId: rawExpense.recurringSourceId || "",
    createdAt: toIsoDateTime(rawExpense.createdAt),
  };
}

export function sortExpenses(expenses) {
  return [...expenses].sort((left, right) => {
    if (left.date === right.date) {
      return right.createdAt.localeCompare(left.createdAt);
    }

    return right.date.localeCompare(left.date);
  });
}

export function filterExpenses(expenses, filters) {
  const searchTerm = filters.search.trim().toLowerCase();

  return expenses.filter((expense) => {
    const matchesSearch =
      !searchTerm ||
      expense.description.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      !filters.category || filters.category === "All" || expense.category === filters.category;

    const matchesDateFrom = !filters.dateFrom || expense.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || expense.date <= filters.dateTo;

    const matchesMinAmount =
      !filters.minAmount || expense.amount >= Number(filters.minAmount);
    const matchesMaxAmount =
      !filters.maxAmount || expense.amount <= Number(filters.maxAmount);

    const matchesRecurring = !filters.recurringOnly || expense.isRecurring;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesMinAmount &&
      matchesMaxAmount &&
      matchesRecurring
    );
  });
}

export function buildCategoryTotals(expenses) {
  const totals = expenses.reduce((accumulator, expense) => {
    accumulator[expense.category] = (accumulator[expense.category] || 0) + expense.amount;
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
    }))
    .sort((left, right) => right.amount - left.amount);
}

export function buildMonthlyTotals(expenses, count = 6) {
  const monthKeys = getRecentMonthKeys(count);

  return monthKeys.map((monthKey) => {
    const total = expenses
      .filter((expense) => expense.monthKey === monthKey)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      monthKey,
      label: getMonthLabel(monthKey).replace(" ", "\n"),
      amount: Number(total.toFixed(2)),
    };
  });
}

export function summarizeExpenses(expenses, budgetGoal = 0) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = buildCategoryTotals(expenses);
  const highestExpense = expenses.reduce(
    (largest, expense) => (expense.amount > largest.amount ? expense : largest),
    { amount: 0 },
  );

  return {
    totalSpent,
    totalItems: expenses.length,
    recurringCount: expenses.filter((expense) => expense.isRecurring).length,
    highestExpense,
    topCategory: categoryTotals[0] || null,
    remainingBudget: budgetGoal ? budgetGoal - totalSpent : 0,
  };
}

export function buildBudgetHistory(budgetGoals) {
  return [...budgetGoals].sort((left, right) => right.monthKey.localeCompare(left.monthKey));
}

export function getBudgetForMonth(budgetGoals, monthKey) {
  return budgetGoals.find((goal) => goal.monthKey === monthKey);
}

export function buildRecurringDate(sourceDate, targetMonthKey) {
  const [year, month] = targetMonthKey.split("-").map(Number);
  const day = new Date(`${sourceDate}T12:00:00`).getDate();
  const lastDayOfTargetMonth = new Date(year, month, 0).getDate();
  const nextDay = `${Math.min(day, lastDayOfTargetMonth)}`.padStart(2, "0");
  return `${year}-${`${month}`.padStart(2, "0")}-${nextDay}`;
}
