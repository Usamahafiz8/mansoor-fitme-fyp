import { useState } from "react";
import clsx from "clsx";

export default function Tabs({ tabs, activeTab, onChangeTab }) {
    console.log("hello")
  return (
    <div className="flex border-b border-gray-300 mb-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChangeTab(index)}
          className={clsx(
            "py-2 px-4 text-gray-600 hover:text-gray-900",
            index === activeTab
              ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
              : "text-gray-500"
          )}>
          {tab}
        </button>
      ))}
    </div>
  );
}
