"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { HeadlessTable } from "@/components/HeadlessTable";
import { DocumentData } from "firebase/firestore";
import Pop, { IAction } from "@/components/Pop";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/Button";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import {
  unsubscribeExpenses,
  unsubscribeIncomes,
} from "../DataHandler/Handller";
export type IArrayOfDataWithId = Array<{ data: DocumentData; id: string }>;

export default function page() {
  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      // If we need pagination
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      pagination: {
        el: ".swiper-pagination",
      },
      centeredSlides: true,
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
  const [incomes, setIncomes] = useState<IArrayOfDataWithId | null>(null);
  const [expenses, setExpenses] = useState<IArrayOfDataWithId | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);

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
    unsubscribeIncomes(setIncomes);
    unsubscribeExpenses(setExpenses);
  }, []);

  useEffect(() => {
    if (data.expenses != null && data.incomes != null) {
      let tempTotalExpenses = 0;
      let tempTotalIncomes = 0;

      data.expenses.forEach((element) => {
        if (element.data.amount != null) {
          tempTotalExpenses += element.data.amount;
        }
      });
      data.incomes.forEach((element) => {
        if (element.data.amount != null) {
          tempTotalIncomes += element.data.amount;
        }
      });
      setTotalExpenses(tempTotalExpenses);
      setTotalIncomes(tempTotalIncomes);
      setTotal(tempTotalIncomes - tempTotalExpenses);
    }
  }, [data]);
  //guard
  if (user == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Private :?
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="container space-y-4">
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
        <div className="flex justify-between items-center gap-4">
          <div>
            <strong>Total Incomes:</strong> {totalIncomes}$
          </div>
          <div>
            <strong>Total TEst:</strong> {total}$
          </div>
          <div>
            <strong>Total Expenses:</strong> {totalExpenses}$
          </div>
        </div>
      </div>
      <div className="swiper">
        <div className="swiper-wrapper w-full">
          {data.incomes != null && (
            <div className="swiper-slide px-4">
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
            <div className="swiper-slide px-4">
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
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
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

// add tags which allow me to join them each category
// add expenses,incomes
// check expenses,incomes
// overall month
