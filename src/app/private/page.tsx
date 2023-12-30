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
import { Navigation } from "swiper/modules";
import {
  unsubscribeExpenses,
  unsubscribeIncomes,
  unsubscribeSavings,
} from "../DataHandler/Handller";
import Transfer from "@/components/Transfer";
export type IArrayOfDataWithId = Array<{ data: DocumentData; id: string }>;

export default function page() {
  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      // If we need pagination
      modules: [Navigation],
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
  const [incomes, setIncomes] = useState<IArrayOfDataWithId | null>(null);
  const [expenses, setExpenses] = useState<IArrayOfDataWithId | null>(null);
  const [savingsIn, setSavingsIn] = useState<IArrayOfDataWithId | null>(null);
  const [savingsOut, setSavingsOut] = useState<IArrayOfDataWithId | null>(null);

  const [total, setTotal] = useState<number>(0);
  const [iHave, setIHave] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  const [data, setData] = useState<{
    incomes: IArrayOfDataWithId | null;
    expenses: IArrayOfDataWithId | null;
    savings: { in: IArrayOfDataWithId | null; out: IArrayOfDataWithId | null };
  }>({
    incomes: null,
    expenses: null,
    savings: { in: null, out: null },
  });
  const { push } = useRouter();
  const { user, logout } = useAuth();
  const [action, setAction] = useState<IAction | null>(null);
  const [transfer, setTransfer] = useState<{} | null>(null);

  useEffect(() => {
    setData({ incomes, expenses, savings: { in: savingsIn, out: savingsOut } });
  }, [incomes, expenses, savingsIn, savingsOut]);

  useEffect(() => {
    unsubscribeIncomes(setIncomes);
    unsubscribeExpenses(setExpenses);
    unsubscribeSavings(setSavingsIn, setSavingsOut);
  }, []);

  useEffect(() => {
    if (
      data.expenses != null &&
      data.incomes != null &&
      data.savings.in != null &&
      data.savings.out != null
    ) {
      let tempTotalExpenses = 0;
      let tempTotalIncomes = 0;
      let tempTotalSavingsIn = 0;
      let tempTotalSavingsOut = 0;

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
      data.savings.in.forEach((element) => {
        if (element.data.amount != null) {
          tempTotalSavingsIn += element.data.amount;
        }
      });
      data.savings.out.forEach((element) => {
        if (element.data.amount != null) {
          tempTotalSavingsOut += element.data.amount;
        }
      });
      setTotalExpenses(tempTotalExpenses);
      setTotalIncomes(tempTotalIncomes);
      setTotalSavings(tempTotalSavingsIn - tempTotalSavingsOut);
      setTotal(tempTotalIncomes - tempTotalExpenses);
      setIHave(
        tempTotalIncomes -
          tempTotalExpenses -
          tempTotalSavingsIn +
          tempTotalSavingsOut
      );
    }
  }, [data]);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  useEffect(() => {
    if (action != null && transfer != null) {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
  }, [action, transfer]);

  //guard
  if (user == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Private
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="container space-y-4">
        <div className="flex justify-end w-full">
          <Button
            disabled={buttonDisabled}
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
        <div className="flex justify-around ">
          <Button
            disabled={buttonDisabled}
            onClick={() => {
              push("/private/viewer");
            }}
            style={{
              backgroundColor: "grey",
              color: "black",
            }}
            value={<div>Viewer</div>}
          />
          <Button
            disabled={buttonDisabled}
            onClick={() => {
              setTransfer({});
            }}
            style={{
              backgroundColor: "purple",
              color: "white",
            }}
            value={<div>Transfer</div>}
          />
        </div>
        <div className="flex justify-between flex-wrap items-center gap-4">
          <div>
            <strong>Total Incomes:</strong> {totalIncomes}$
          </div>
          <div>
            <strong>Total Expenses:</strong> {totalExpenses}$
          </div>
          <div>
            <strong>Total:</strong> {total}$
          </div>
          <div>
            <strong>Total Savings:</strong> {totalSavings}$
          </div>
          <div>
            <strong>I Have:</strong> {iHave}$
          </div>
        </div>
      </div>
      <div className="swiper">
        <div className="swiper-wrapper w-full">
          {data.expenses != null && (
            <div className="swiper-slide px-4">
              <HeadlessTable
                type={"expenses"}
                data={data.expenses}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
                buttonDisabled={buttonDisabled}
              />
            </div>
          )}
          {data.incomes != null && (
            <div className="swiper-slide px-4">
              <HeadlessTable
                type={"incomes"}
                data={data.incomes}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
                buttonDisabled={buttonDisabled}
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
      {transfer != null && (
        <Transfer
          transfer={{}}
          closeTransfer={() => {
            setTransfer(null);
          }}
        />
      )}
    </div>
  );
}

// todo: add tags which allow me to join them each category
