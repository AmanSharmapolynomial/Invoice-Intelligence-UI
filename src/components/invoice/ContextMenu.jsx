import React from "react";

const ContextMenu = ({ menuOptions, position, onClose }) => {

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: "white",

        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        minWidth: "8rem",
        textAlign: "left",

        boxShadow: "4px 4px 8px 0px rgba(0, 0, 0, 0.12)"
      }}
      className="font-poppins  text-xs  font-normal leading-4 border border-[#E0E0E0] text-[#000000] rounded-md"
      onMouseLeave={onClose}
    >
      {menuOptions?.map((option, index) => (
        <div
          key={index}
          onClick={() => {
            option.action();
            onClose(); // Close the menu after an option is selected
          }}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            borderBottom:
              index < menuOptions.length - 1 ? "1px solid #E0E0E0" : "none"
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
