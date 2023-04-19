import { View } from "@/types";
import React from "react";

type ToggleProps = {
  setToggleView: (view: View) => void;
  toggleView: View;
};

const Toggle = ({ setToggleView, toggleView }: ToggleProps) => {
  const toggleViewClick = (view: View) => {
    setToggleView(view);
  };

  const toggleStyles =
    "max-h-12 w-auto cursor-pointer text-black items-center flex px-2 my-3 border-2 bg-gray-300 hover:bg-gray-400 active:bg-gray-600 border-b-gray-500 border-l-gray-500 border-r-gray-100 border-t-gray-100 active:border-t-gray-700 active:border-r-gray-700 active:border-l-gray-200 active:border-b-gray-200";
  const selectedToggle =
    "max-h-12 w-auto text-black items-center flex px-2 my-3 border-2 bg-gray-500 border-t-gray-600 border-r-gray-600 border-l-gray-100 border-b-gray-100";

  return (
    <>
      <div
        onClick={() => {
          toggleViewClick("grid");
        }}
        className={toggleView === "grid" ? selectedToggle : toggleStyles}
      >
        Grid
      </div>
      <div
        onClick={() => {
          toggleViewClick("list");
        }}
        className={toggleView == "list" ? selectedToggle : toggleStyles}
      >
        List
      </div>
    </>
  );
};

export default Toggle;
