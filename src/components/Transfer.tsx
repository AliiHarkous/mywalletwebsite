import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import React, { useState } from "react";
import "@mantine/dates/styles.css";
import { docData } from "./HeadlessTable";
import {
  IFields,
  handleAddExpense,
  handleTransfer,
  handleTransferArgs,
} from "@/app/DataHandler/Handller";
import { Button } from "./Button";

type Props = {
  transfer: {};
  closeTransfer: () => void;
};

export default function Transfer(props: Props) {
  const { transfer, closeTransfer } = props;
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [fromTo, setFromTo] = useState<
    "Wallet to Savings" | "Savings to Wallet"
  >("Savings to Wallet");
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const combobox2 = useCombobox({
    onDropdownClose: () => combobox2.resetSelectedOption(),
  });
  const options1 = ["LBP", "USD"];
  const options = options1.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
  const options2 = ["Wallet to Savings", "Savings to Wallet"];
  const options3 = options2.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

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
              enableBackground="new 0 0 122.879 122.879"
            >
              <g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="black"
                  d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
                />
              </g>
            </svg>
          }
          onClick={closeTransfer}
        />
      </div>
      <div className="space-y-4">
        <div className="capitalize-first">Transfer {fromTo}</div>
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
          <div>fromTo</div>
          <Combobox
            store={combobox2}
            onOptionSubmit={(val) => {
              if (val == "Wallet to Savings" || val == "Savings to Wallet") {
                setFromTo(val);
              }
              combobox2.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox2.toggleDropdown()}
              >
                {fromTo || <Input.Placeholder>Pick value</Input.Placeholder>}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{options3}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
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
              onClick={async () => {
                const fields: handleTransferArgs = {
                  amount: amount,
                  date: selectedDate!.getTime(),
                  fromTo: fromTo,
                  currency: "USD",
                };
                handleTransfer(fields).then(() => {
                  closeTransfer();
                });
              }}
              style={{
                backgroundColor: "black",
                color: "white",
              }}
              value={<div>Transfer {fromTo}</div>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
