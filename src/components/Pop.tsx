import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import {
  DatePicker,
  DateTimePicker,
  DateValue,
  MonthPicker,
} from "@mantine/dates";
import React, { useEffect, useState } from "react";
import "@mantine/dates/styles.css";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { docData } from "./HeadlessTable";

export type IAction =
  | { type: "income"; data: docData | null }
  | { type: "expense"; data: docData | null }
  | { type: "edit"; data: docData };

type Props = {
  action: IAction;
  closePop: () => void;
};

export default function Pop(props: Props) {
  const { action, closePop } = props;
  const gmt2Offset: number = 7200000;
  const [amount, setAmount] = useState<number>(action.data?.amount ?? 0);
  const [currency, setCurrency] = useState<string>(
    action.data?.currency ?? "USD"
  );
  const [details, setDetails] = useState<string>(action.data?.details ?? "");
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    action.data?.date != null
      ? new Date(new Date(action.data.date).getTime() - gmt2Offset)
      : new Date()
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options1 = ["LBP", "USD"];
  const options = options1.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  console.log(amount, currency, details, selectedDate?.getTime());

  const handleExpense = async () => {
    await addDoc(collection(db, "Wallet", "Expenses", "children"), {
      amount: amount,
      date: selectedDate?.getTime(),
      details: details,
      currency: currency,
    });
  };
  const handleIncome = async () => {
    await addDoc(collection(db, "Wallet", "Incomes", "children"), {
      amount: amount,
      date: selectedDate?.getTime(),
      details: details,
      currency: currency,
    });
  };
  const handleEdit = async () => {
    if (action.data?.id == null) return;
    await updateDoc(doc(db, "Wallet", "Expenses", "children", action.data.id), {
      amount: amount,
      date: selectedDate?.getTime(),
      details: details,
      currency: currency,
    });
  };

  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 10,
        borderRadius: "20px",
      }}
      className="absolute bg-[#c9c9c9] px-4 py-2 "
    >
      <div className="flex w-full justify-end items-center">
        <button onClick={closePop}>x</button>
      </div>
      <div className="space-y-4">
        <div>Add {action.type}</div>
        <div className="w-full border-t-2 space-y-4">
          <div>Amount</div>
          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(parseInt(e.target.value));
            }}
            className="px-2 focus:outline-none w-full"
            style={{
              borderRadius: "5px",
              border: "1px solid black",
            }}
          />
          <div>Currency</div>
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              setCurrency(val);
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
                {currency || <Input.Placeholder>Pick value</Input.Placeholder>}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <div>Details</div>
          <input
            placeholder="Details"
            type="text"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
            }}
            className="px-2 focus:outline-none w-full"
            style={{
              borderRadius: "5px",
              border: "1px solid black",
            }}
          />
          <div>Date</div>
          <DateTimePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
          />
          <div className="flex justify-center items-center">
            <button
              className="px-4 py-2 text-white bg-black rounded-xl"
              onClick={async (e) => {
                e.preventDefault();
                if (action.type == "expense") {
                  handleExpense().then(() => {
                    closePop();
                  });
                } else if (action.type == "income") {
                  handleIncome().then(() => {
                    closePop();
                  });
                } else if (action.type == "edit") {
                  handleEdit().then(() => {
                    closePop();
                  });
                }
              }}
            >
              Add {action.type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
