import React from "react";

function FloatingComponent({ setModalOpen, buttonContent, spacing }) {
  return (
    <button
      onClick={() => setModalOpen(true)}
      className={
        "fixed" +
        spacing +
        "bg-black text-white rounded-full w-15 h-15 flex items-center font-bold justify-center shadow-lg"
      }
      aria-label="Add Task"
    >
      {buttonContent}
    </button>
  );
}

export default FloatingComponent;
