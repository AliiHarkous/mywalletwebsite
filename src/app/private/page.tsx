"use client";
import React, { use, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { HeadlessTable } from "@/components/HeadlessTable";
import {
  DocumentData,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Pop, { IAction } from "@/components/Pop";

import { Swiper } from "swiper";
import "swiper/css";
import { Button } from "@/components/Button";
import { Divider } from "@mantine/core";

export type IArrayOfDataWithId = Array<{ id: string; data: DocumentData }>;
export default function page() {
  const [incomes, setIncomes] = useState<IArrayOfDataWithId | null>(null);
  const [expenses, setExpenses] = useState<IArrayOfDataWithId | null>(null);

  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      // If we need pagination
      slidesPerView: 1,
      autoHeight: true,
      pagination: {
        el: ".swiper-pagination",
      },
      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      // And if we need scrollbar
      scrollbar: {
        el: ".swiper-scrollbar",
      },
    });
  });

  const [data, setData] = useState<{
    incomes: IArrayOfDataWithId | null;
    expenses: IArrayOfDataWithId | null;
  }>({
    incomes: null,
    expenses: null,
  });
  const { push } = useRouter();
  const { user, logout } = useAuth();
  const [action, setAction] = useState<IAction | null>(null);

  useEffect(() => {
    const newData = { incomes: incomes, expenses: expenses }; // Modify according to your data structure
    setData(newData);
  }, [incomes, expenses]);

  useEffect(() => {
    const incomesQuery = query(
      collection(db, "Wallet", "Incomes", "children"),
      orderBy("date", "desc")
    );
    const expensesQuery = query(
      collection(db, "Wallet", "Expenses", "children"),
      orderBy("date", "desc")
    );
    const unsubscribeIncomes = onSnapshot(incomesQuery, (querySnapshot) => {
      const incomesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIncomes(incomesRes);
    });
    const unsubscribeExpenses = onSnapshot(expensesQuery, (querySnapshot) => {
      const expensesRes: IArrayOfDataWithId = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setExpenses(expensesRes);
    });
    return () => {
      unsubscribeIncomes();
      unsubscribeExpenses();
    };
  }, []);

  //guard
  if (user == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Private :?
      </div>
    );
  }

  return (
    <div className="min-h-screen container relative space-y-4">
      <div className="flex justify-end w-full">
        <Button
          onClick={async () => {
            if (logout == null) {
              return;
            }
            await logout();
            push("/");
          }}
          style={{
            backgroundColor: "black",
            color: "white",
          }}
          value={<div>Sign out</div>}
        />
      </div>
      <div className="flex justify-between ">
        <Button
          disabled={action != null}
          onClick={() => {
            setAction({ type: "addIncome", data: null });
          }}
          style={{
            backgroundColor: "green",
            color: "white",
          }}
          value={<div>Add Income</div>}
        />
        <Button
          disabled={action != null}
          onClick={() => {
            setAction({ type: "addExpense", data: null });
          }}
          style={{
            backgroundColor: "red",
            color: "white",
          }}
          value={<div>Add Expense</div>}
        />
      </div>
      <div className="swiper">
        <div className="swiper-wrapper w-full">
          {data.incomes != null && (
            <div className="swiper-slide">
              <HeadlessTable
                type={"incomes"}
                data={data.incomes}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
              />
            </div>
          )}
          {data.expenses != null && (
            <div className="swiper-slide">
              <HeadlessTable
                type={"expenses"}
                data={data.expenses}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
              />
            </div>
          )}
        </div>
        {/* <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-scrollbar"></div> */}
      </div>
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
// add expenses,incomes
// check expenses,incomes
// overall month
