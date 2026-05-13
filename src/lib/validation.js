export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validateAuthForm(values, mode = "login") {
  const errors = {};

  if (mode === "register" && !values.name.trim()) {
    errors.name = "Enter your name so we can personalize the app.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (mode === "register" && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateExpenseForm(values) {
  const errors = {};

  if (!values.amount) {
    errors.amount = "Amount is required.";
  } else if (Number(values.amount) <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }

  if (!values.category) {
    errors.category = "Choose a category.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Add a short description.";
  }

  return errors;
}

export function validateBudgetGoal(values) {
  const errors = {};

  if (!values.monthKey) {
    errors.monthKey = "Choose a month.";
  }

  if (!values.amount) {
    errors.amount = "Budget amount is required.";
  } else if (Number(values.amount) <= 0) {
    errors.amount = "Budget amount must be greater than zero.";
  }

  return errors;
}

