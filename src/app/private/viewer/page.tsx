"use client";

// import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { HeadlessTable } from "@/components/HeadlessTable";
import React, { useEffect, useState } from "react";
import Pop, { IAction } from "@/components/Pop";
import { useAuth } from "@/auth/AuthProvider";
import { Navigation } from "swiper/modules";
import { IArrayOfDataWithId } from "../page";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import Swiper from "swiper";
import {
  unsubscribeIncomesByTime,
  unsubscribeExpensesByTime,
} from "../../DataHandler/Handller";

export default function page() {
  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      modules: [Navigation],
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
  const { user, logout } = useAuth();
  const [action, setAction] = useState<IAction | null>(null);
  const [incomes, setIncomes] = useState<IArrayOfDataWithId | null>(null);
  const [expenses, setExpenses] = useState<IArrayOfDataWithId | null>(null);
  const [data, setData] = useState<{
    incomes: IArrayOfDataWithId | null;
    expenses: IArrayOfDataWithId | null;
  }>({
    incomes: null,
    expenses: null,
  });
  const { push } = useRouter();
  const [value, setValue] = useState<string>("Month");
  const today = new Date();
  const [from, setFrom] = useState<DateValue>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  today.setHours(23);
  today.setMinutes(59);
  today.setSeconds(59);
  today.setMilliseconds(0);
  const [to, setTo] = useState<DateValue>(today);
  const [total, setTotal] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);

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
  useEffect(() => {
    setData({ incomes, expenses });
  }, [incomes, expenses]);

  useEffect(() => {
    if (from != null && to != null) {
      unsubscribeIncomesByTime(setIncomes, from.getTime(), to.getTime());
      unsubscribeExpensesByTime(setExpenses, from.getTime(), to.getTime());
    }
  }, [from, to]);

  // const combobox = useCombobox({
  //   onDropdownClose: () => combobox.resetSelectedOption(),
  // });
  {
    /*  const tempOptions = ["Week", "Month", "QuarterYear", "HalfYear", "Year"];
        const options = tempOptions.map((item) => (
          <Combobox.Option value={item} key={item}>
            {item}
          </Combobox.Option>
        )); */
  }
  {
    /* <div>By &nbsp;</div>
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            setValue(val);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              rightSectionPointerEvents="none"
              onClick={() => combobox.toggleDropdown()}
            >
              {value || <Input.Placeholder>Pick value</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox> */
  }
  if (user == null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Private :?
      </div>
    );
  }
  return (
    <div>
      <div className="container space-y-4">
        <div className="flex justify-end w-full">
          <Button
            disabled={action != null}
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
            <strong>Total:</strong> {total}$
          </div>
          <div>
            <strong>Total Expenses:</strong> {totalExpenses}$
          </div>
        </div>
        <div className="flex justify-center items-center gap-10">
          <div>
            <div>From</div>
            <DateTimePicker
              className="text-[10px]"
              value={from}
              onChange={(date) => {
                setFrom(date);
              }}
            />
          </div>
          <div>
            <div>To</div>
            <DateTimePicker
              className="text-[10px]"
              value={to}
              onChange={(date) => {
                setTo(date);
              }}
            />
          </div>
        </div>
      </div>

      {data.incomes != null && data.expenses != null && (
        <div className="swiper">
          <div className="swiper-wrapper w-full">
            <div className="swiper-slide px-4">
              <HeadlessTable
                buttonDisabled={action != null}
                type={"incomes"}
                data={data.incomes}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
              />
            </div>
            <div className="swiper-slide px-4">
              <HeadlessTable
                buttonDisabled={action != null}
                type={"expenses"}
                data={data.expenses}
                setAction={(action: IAction | null) => {
                  setAction(action);
                }}
              />
            </div>
          </div>

          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
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
