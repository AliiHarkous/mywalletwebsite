import { db } from "@/firebase/firebase";
import { IArrayOfDataWithId } from "../private/page";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

// fetch Documents
export const unsubscribeIncomes = (
  setIncomes: (incomesRes: IArrayOfDataWithId) => void
) => {
  onSnapshot(
    query(
      collection(db, "Wallet", "Incomes", "children"),
      orderBy("date", "desc")
    ),
    (querySnapshot) => {
      const incomesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIncomes(incomesRes);
    }
  );
};

export const unsubscribeExpenses = (
  setExpenses: (expensesRes: IArrayOfDataWithId) => void
) => {
  onSnapshot(
    query(
      collection(db, "Wallet", "Expenses", "children"),
      orderBy("date", "desc")
    ),
    (querySnapshot) => {
      const expensesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setExpenses(expensesRes);
    }
  );
};

// fecth Documents by time
export const unsubscribeIncomesByTime = (
  setIncomes: (incomesRes: IArrayOfDataWithId) => void,
  from: number,
  to: number
) => {
  onSnapshot(
    query(
      collection(db, "Wallet", "Incomes", "children"),
      orderBy("date", "desc"),
      where("date", ">=", from),
      where("date", "<=", to)
    ),
    (querySnapshot) => {
      const incomesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIncomes(incomesRes);
    }
  );
};

export const unsubscribeExpensesByTime = (
  setExpenses: (expensesRes: IArrayOfDataWithId) => void,
  from: number,
  to: number
) => {
  onSnapshot(
    query(
      collection(db, "Wallet", "Expenses", "children"),
      orderBy("date", "desc"),
      where("date", ">=", from),
      where("date", "<=", to)
    ),
    (querySnapshot) => {
      const expensesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setExpenses(expensesRes);
    }
  );
};

// Edit Add Delete Fields
export type IFields = {
  amount: number;
  date: number;
  details: string;
  currency: string;
};

type handleAddExpenseArgs = IFields;
export const handleAddExpense = async (args: handleAddExpenseArgs) => {
  const { amount, date, details, currency } = args;
  await addDoc(collection(db, "Wallet", "Expenses", "children"), {
    amount,
    date,
    details,
    currency,
  });
};

type handleAddIncomeArgs = IFields;
export const handleAddIncome = async (args: handleAddIncomeArgs) => {
  const { amount, date, details, currency } = args;
  await addDoc(collection(db, "Wallet", "Incomes", "children"), {
    amount,
    date,
    details,
    currency,
  });
};

type handleEditExpenseArgs = { data: IFields; id: string };
export const handleEditExpense = async (args: handleEditExpenseArgs) => {
  const { amount, date, details, currency } = args.data;
  const id = args.id;
  if (id == null) return;
  await updateDoc(doc(db, "Wallet", "Expenses", "children", id), {
    amount,
    date,
    details,
    currency,
  });
};

type handleEditIncomeArgs = { data: IFields; id: string };
export const handleEditIncome = async (args: handleEditIncomeArgs) => {
  const { amount, date, details, currency } = args.data;
  const id = args.id;
  if (id == null) return;
  await updateDoc(doc(db, "Wallet", "Incomes", "children", id), {
    amount,
    date,
    details,
    currency,
  });
};

type handleDeleteExpenseArgs = {
  id: string;
};
export const handleDeleteExpense = async (args: handleDeleteExpenseArgs) => {
  const id = args.id;
  await deleteDoc(doc(db, "Wallet", "Expenses", "children", id));
};

type handleDeleteIncomeArgs = {
  id: string;
};
export const handleDeleteIncome = async (args: handleDeleteIncomeArgs) => {
  const id = args.id;
  await deleteDoc(doc(db, "Wallet", "Incomes", "children", id));
};

// Savings

export const unsubscribeSavings = (
  setSavingsIn: (savingsResIn: IArrayOfDataWithId) => void,
  setSavingsOut: (savingsResOut: IArrayOfDataWithId) => void
) => {
  onSnapshot(
    query(collection(db, "Savings", "IN", "children"), orderBy("date", "desc")),
    (querySnapshot) => {
      const savingsResIn: IArrayOfDataWithId = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          data: doc.data(),
        })
      );
      setSavingsIn(savingsResIn);
    }
  );
  onSnapshot(
    query(
      collection(db, "Savings", "OUT", "children"),
      orderBy("date", "desc")
    ),
    (querySnapshot) => {
      const savingsResOut: IArrayOfDataWithId = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          data: doc.data(),
        })
      );
      setSavingsOut(savingsResOut);
    }
  );
};

type handleAddSavingArgs = { amount: number; date: number };
export const handleAddSavingIn = async (args: handleAddSavingArgs) => {
  const { amount, date } = args;
  await addDoc(collection(db, "Savings", "IN", "children"), {
    amount,
    date,
  });
};
export const handleAddSavingOut = async (args: handleAddSavingArgs) => {
  const { amount, date } = args;
  await addDoc(collection(db, "Savings", "OUT", "children"), {
    amount,
    date,
  });
};

export type handleTransferArgs = {
  amount: number;
  currency: "USD";
  fromTo: "Wallet to Savings" | "Savings to Wallet";
  date: number;
};
export const handleTransfer = async (args: handleTransferArgs) => {
  const { amount, currency, fromTo, date } = args;
  if (fromTo === "Savings to Wallet") {
    handleAddSavingOut({ amount, date });
  } else if (fromTo == "Wallet to Savings") {
    handleAddSavingIn({ amount, date });
  }
};
