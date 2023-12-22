import { IArrayOfDataWithId } from "@/app/private/page";
import { db } from "@/firebase/firebase";
import firebase from "firebase/compat/app";
import { Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IAction } from "./Pop";

type Props = {
  data: IArrayOfDataWithId;
  setAction: (action: IAction | null) => void;
};

export type docData = {
  date: string;
  details: string;
  currency: string;
  amount: number;
  id: string;
};

export const HeadlessTable = (props: Props) => {
  const { setAction, data } = props;
  const header = ["Date", "Details", "Currency", "Amount", "Change"];

  const formatData = () => {
    let temp: Array<docData> = [];
    data.forEach((d) => {
      const id = d.id;
      const date = new Date(d.data.date).toUTCString();
      const details = d.data.details;
      const currency = d.data.currency;
      const amount = d.data.amount;
      temp.push({ date, details, currency, amount, id });
    });

    return temp;
  };

  const formatedData = formatData();

  const deleteDocumentbyId = async (v: string | number) => {
    await deleteDoc(doc(db, "Wallet", "Expenses", "children", v.toString()));
  };
  const editDocumentbyId = async (v: string | number) => {
    await updateDoc(doc(db, "Wallet", "Expenses", "children", v.toString()), {
      amount: 232,
    });
  };

  return (
    <div className="headless-table">
      <table className="flex flex-col">
        <thead>
          <tr
            style={{
              gridTemplateColumns: `repeat(${header.length}, minmax(0, 1fr))`,
            }}
          >
            {header.map((element, i) => (
              <th key={element + i}>{element}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formatedData.map((row, i) => (
            <tr
              key={i}
              style={{
                gridTemplateColumns: `repeat(${
                  Object.keys(row).length
                }, minmax(0, 1fr))`,
              }}
            >
              {Object.values(row)
                .flat()
                .map((v, i) => (
                  <td key={v.toString() + i}>
                    {i == 4 ? (
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            deleteDocumentbyId(v);
                          }}
                        >
                          <svg
                            width={20}
                            height={20}
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layer_1"
                            data-name="Layer 1"
                            viewBox="0 0 110.61 122.88"
                          >
                            <path d="M39.27,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Zm63.6-19.86L98,103a22.29,22.29,0,0,1-6.33,14.1,19.41,19.41,0,0,1-13.88,5.78h-45a19.4,19.4,0,0,1-13.86-5.78l0,0A22.31,22.31,0,0,1,12.59,103L7.74,38.78H0V25c0-3.32,1.63-4.58,4.84-4.58H27.58V10.79A10.82,10.82,0,0,1,38.37,0H72.24A10.82,10.82,0,0,1,83,10.79v9.62h23.35a6.19,6.19,0,0,1,1,.06A3.86,3.86,0,0,1,110.59,24c0,.2,0,.38,0,.57V38.78Zm-9.5.17H17.24L22,102.3a12.82,12.82,0,0,0,3.57,8.1l0,0a10,10,0,0,0,7.19,3h45a10.06,10.06,0,0,0,7.19-3,12.8,12.8,0,0,0,3.59-8.1L93.37,39ZM71,20.41V12.05H39.64v8.36ZM61.87,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setAction({ type: "edit", data: row });
                            // editDocumentbyId(v);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            id="_24x24_On_Light_Edit"
                            data-name="24x24/On Light/Edit"
                          >
                            <rect
                              id="view-box"
                              width="24"
                              height="24"
                              fill="none"
                            />
                            <path
                              id="Shape"
                              d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0,0,1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0,0-1.727,0L10.47,3.91Z"
                              transform="translate(3.25 3.25)"
                              fill="#141124"
                            />
                          </svg>{" "}
                        </button>
                      </div>
                    ) : (
                      <div>{v}</div>
                    )}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
