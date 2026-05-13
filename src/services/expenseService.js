import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { getMonthKey, normalizeExpense, sortExpenses } from "../lib/utils";

function buildExpensePayload(userId, values) {
  return {
    userId,
    amount: Number(values.amount),
    category: values.category,
    description: values.description.trim(),
    date: values.date,
    monthKey: getMonthKey(values.date),
    isRecurring: Boolean(values.isRecurring),
    recurringFrequency: values.isRecurring ? "monthly" : "none",
    recurringSourceId: values.recurringSourceId || "",
  };
}

export function subscribeToExpenses(userId, onData, onError) {
  const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));

  return onSnapshot(
    expensesQuery,
    (snapshot) => {
      const expenses = snapshot.docs.map((snapshotDoc) =>
        normalizeExpense({
          id: snapshotDoc.id,
          ...snapshotDoc.data(),
        }),
      );

      onData(sortExpenses(expenses));
    },
    onError,
  );
}

export async function createExpense(userId, values) {
  const payload = buildExpensePayload(userId, values);

  const snapshotRef = await addDoc(collection(db, "expenses"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return normalizeExpense({
    id: snapshotRef.id,
    ...payload,
    createdAt: new Date().toISOString(),
  });
}

export async function updateExpense(expenseId, userId, values) {
  const payload = buildExpensePayload(userId, values);

  await updateDoc(doc(db, "expenses", expenseId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return normalizeExpense({
    id: expenseId,
    ...payload,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteExpense(expenseId) {
  await deleteDoc(doc(db, "expenses", expenseId));
}
