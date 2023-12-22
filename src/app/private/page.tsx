"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { HeadlessTable } from "@/components/HeadlessTable";
import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Pop, { IAction } from "@/components/Pop";

export type IArrayOfDataWithId = Array<{ id: string; data: DocumentData }>;

const fetch = async () => {
  let tempExpenses: IArrayOfDataWithId = [];
  let tempIncomes: IArrayOfDataWithId = [];

  const q = query(
    collection(db, "Wallet", "Expenses", "children"),
    orderBy("date", "desc")
  );
  await getDocs(q).then((value) => {
    value.forEach((doc) => {
      tempExpenses.push({ id: doc.id, data: doc.data() });
    });
  });
  const q2 = query(
    collection(db, "Wallet", "Incomes", "children"),
    orderBy("date", "desc")
  );
  await getDocs(q2).then((value) => {
    value.forEach((doc) => {
      tempIncomes.push({
        id: doc.id,
        data: doc.data(),
      });
    });
  });
  return { expenses: tempExpenses, incomses: tempIncomes };
};

export default function page() {
  const [data, setData] = useState<{
    expenses: IArrayOfDataWithId;
    incomses: IArrayOfDataWithId;
  } | null>(null);
  const { push } = useRouter();
  const { user, logout } = useAuth();
  const [action, setAction] = useState<IAction | null>(null);
  useEffect(() => {
    if (data == null) {
      fetch().then((data) => {
        setData(data);
      });
    }
  });

  //guard
  if (user == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Private :?
      </div>
    );
  }

  return (
    <div className="min-h-screen page-container relative">
      <div className="flex justify-end w-full">
        <button
          disabled={action != null}
          onClick={async () => {
            if (logout == null) {
              return;
            }
            await logout();
            push("/");
          }}
          className="px-4 py-2 text-white bg-black rounded-xl"
        >
          Sign out
        </button>
      </div>
      {/* recent, Stats of the year,Month of {moment.months()[today.month()]}*/}
      <div className="py-2"></div>
      <div className="flex justify-between ">
        <button
          disabled={action != null}
          onClick={() => {
            setAction({ type: "income", data: null });
          }}
          className="px-4 py-2 text-white bg-[green] rounded-xl"
        >
          Add Income
        </button>
        <button
          disabled={action != null}
          onClick={() => {
            setAction({ type: "expense", data: null });
          }}
          className="px-4 py-2 text-white bg-[red] rounded-xl"
        >
          Add Expense
        </button>
      </div>
      <div className="py-2"></div>
      {data != null && (
        <HeadlessTable
          data={data.expenses}
          setAction={(action: IAction | null) => {
            setAction(action);
          }}
        />
      )}
      {action != null && (
        <Pop
          action={action}
          closePop={() => {
            setAction(null);
          }}
        />
      )}
    </div>
  );
}
