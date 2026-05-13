import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

function normalizeBudgetGoal(goal) {
  return {
    id: goal.id || `${goal.userId}_${goal.monthKey}`,
    userId: goal.userId,
    monthKey: goal.monthKey,
    amount: Number(goal.amount || 0),
    updatedAt:
      typeof goal.updatedAt?.toDate === "function"
        ? goal.updatedAt.toDate().toISOString()
        : goal.updatedAt || new Date().toISOString(),
  };
}

export function subscribeToBudgetGoals(userId, onData, onError) {
  const goalsQuery = query(collection(db, "budgetGoals"), where("userId", "==", userId));

  return onSnapshot(
    goalsQuery,
    (snapshot) => {
      const goals = snapshot.docs.map((snapshotDoc) =>
        normalizeBudgetGoal({
          id: snapshotDoc.id,
          ...snapshotDoc.data(),
        }),
      );

      onData(goals.sort((left, right) => right.monthKey.localeCompare(left.monthKey)));
    },
    onError,
  );
}

export async function saveBudgetGoal(userId, values) {
  const payload = {
    userId,
    monthKey: values.monthKey,
    amount: Number(values.amount),
  };

  const goalRef = doc(db, "budgetGoals", `${userId}_${values.monthKey}`);
  await setDoc(
    goalRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return normalizeBudgetGoal({
    id: goalRef.id,
    ...payload,
    updatedAt: new Date().toISOString(),
  });
}
