import { NextPage } from "next";
import React, { useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import "react-date-picker/dist/DatePicker.css";
import Head from "next/head";

interface TimeItem {
  dateAdded: number;
  dateDone: number;
  who: string;
  hours: number;
  paid: boolean;
}

const ItemsDb = {
  getAll: (): TimeItem[] => {
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem("items");
    return data ? JSON.parse(data) : [];
  },
  saveAll: (items: TimeItem[]): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem("items", JSON.stringify(items));
  },
};

const useItems = () => {
  const [items, setItems] = useState<TimeItem[]>(ItemsDb.getAll());

  const addItem = (item: TimeItem) => {
    const newItems = [...items, item];
    setItems(newItems);
    ItemsDb.saveAll(newItems);
  };

  const updateItem = (item: TimeItem) => {
    const newItems = items.map((i) =>
      i.dateAdded === item.dateAdded ? item : i
    );
    setItems(newItems);
    ItemsDb.saveAll(newItems);
  };

  return {
    items,
    addItem,
    updateItem,
  };
};

const TimeItemView = (props: {
  item: TimeItem;
  onUpdate: (item: TimeItem) => void;
}) => {
  const { item, onUpdate } = props;

  const dateString = new Date(item.dateDone).toLocaleDateString();

  return (
    <div className="flex p-5 my-3 border-2 border-black gap-2">
      <div> {dateString} </div>
      <div>{item.who}</div>
      <div>{item.hours}</div>
      <div>{item.paid ? "Paid" : "Not Paid"}</div>
      {item.paid ? null : (
        <button onClick={() => onUpdate({ ...item, paid: true })}>
          Mark Paid
        </button>
      )}
    </div>
  );
};

const CreateTimeItem = (props: { onAdd: (item: TimeItem) => void }) => {
  const [who, setWho] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [date, setDate] = useState(new Date());

  const addItem = () => {
    props.onAdd({
      dateAdded: Date.now(),
      dateDone: date.getTime(),
      who,
      hours: hours + minutes / 60,
      paid: false,
    });
  };

  return (
    <div className="p-5 border-2 border-black md:flex bg-slate-700 gap-2">
      <div className="p-2">
        <label> Date </label>
        <DatePicker value={date} onChange={setDate} />
      </div>
      <div className="p-2">
        <label> Who </label>
        <input
          type="text"
          value={who}
          onChange={(e) => setWho(e.target.value)}
        />
      </div>
      <div className="p-2">
        <label> Hours </label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
        />
      </div>
      <div className="p-2">
        <label> Minutes </label>
        <input
          type="number"
          step="15"
          max="45"
          min="0"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value))}
        />
      </div>
      <button className="p-2" onClick={() => addItem()}>
        Add
      </button>
    </div>
  );
};

const LoganTimeSheet: NextPage = () => {
  const { items, addItem, updateItem } = useItems();

  const totalNotPaid = items.reduce((acc, item) => {
    if (item.paid) {
      return acc;
    }
    return acc + item.hours;
  }, 0);

  return (
    <div className="p-1 md:p-2">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>
        {" "}
        Total Not Paid: {totalNotPaid} - ${totalNotPaid * 30}{" "}
      </h1>
      <CreateTimeItem onAdd={addItem} />
      {items.map((item) => (
        <TimeItemView key={item.dateAdded} item={item} onUpdate={updateItem} />
      ))}
    </div>
  );
};

export default LoganTimeSheet;
