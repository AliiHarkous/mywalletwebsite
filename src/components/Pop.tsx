import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import React, { useState } from "react";
import "@mantine/dates/styles.css";
import { docData } from "./HeadlessTable";
import {
  IFields,
  handleAddExpense,
  handleAddIncome,
  handleEditExpense,
  handleEditIncome,
} from "@/app/DataHandler/Handller";
import { Button } from "./Button";

export type IAction =
  | { type: "addIncome"; data: docData | null }
  | { type: "addExpense"; data: docData | null }
  | { type: "editIncome"; data: docData }
  | { type: "editExpense"; data: docData };

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

  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 10,
        minWidth: "300px",
        minHeight: "350px",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "1px 1px 1px 2px  rgba(0, 0, 0, 0.1)",
      }}
      className="absolute p-4"
    >
      <div className="flex w-full justify-end items-center">
        <Button
          style={{ padding: "0px" }}
          value={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width={20}
              height={20}
              viewBox="0 0 122.879 122.879"
              enable-background="new 0 0 122.879 122.879"
            >
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  fill="black"
                  d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
                />
              </g>
            </svg>
          }
          onClick={closePop}
        />
      </div>
      <div className="space-y-4">
        <div className="capitalize-first">
          {action.type.replace(/([A-Z])/g, " $1")}
        </div>
        <div className="w-full space-y-4">
          <div>Amount</div>
          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(parseInt(e.target.value));
            }}
            className="w-full"
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
          <textarea
            placeholder="Details"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
            }}
            className="px-3 w-full"
          />
          <div>Date</div>
          <DateTimePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
          />
          <div className="flex justify-center items-center">
            <Button
              className="capitalize-first"
              disabled={action != null}
              onClick={async () => {
                const fields: IFields = {
                  amount: amount,
                  date: selectedDate!.getTime(),
                  details: details,
                  currency: currency,
                };
                if (action.type == "addExpense") {
                  handleAddExpense(fields).then(() => {
                    closePop();
                  });
                } else if (action.type == "addIncome") {
                  handleAddIncome(fields).then(() => {
                    closePop();
                  });
                } else if (action.type == "editExpense") {
                  handleEditExpense({
                    data: fields,
                    id: action.data.id,
                  }).then(() => {
                    closePop();
                  });
                } else if (action.type == "editIncome") {
                  handleEditIncome({
                    data: fields,
                    id: action.data.id,
                  }).then(() => {
                    closePop();
                  });
                }
              }}
              style={{
                backgroundColor: "black",
                color: "white",
              }}
              value={<div>{action.type.replace(/([A-Z])/g, " $1")}</div>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
