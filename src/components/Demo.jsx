import React, { useState } from "react";
import CarpetDesignPopup from "./CarpetDesignPopup";
import Header from "./Header";
import Canvas from "./Canvas";

const Demo = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleClosePopup = () => {
    setSelectedButton(null);
  };

  return (
    <>
      <Header />

      <div className="flex h-screen">
        <div className="w-1/4 bg-gray-200 p-4">
          <button
            className={`py-2 px-4 my-2 w-full rounded ${
              selectedButton === "Frieze"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => handleButtonClick("Frieze")}
          >
            Frieze
          </button>
          <button
            className={`py-2 px-4 my-2 w-full rounded ${
              selectedButton === "Wallpaper"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => handleButtonClick("Wallpaper")}
          >
            Wallpaper
          </button>
          <button
            className={`py-2 px-4 my-2 w-full rounded ${
              selectedButton === "Rosette"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => handleButtonClick("Rosette")}
          >
            Rosette
          </button>
        </div>
      </div>

      <CarpetDesignPopup
        selectedButton={selectedButton}
        onClose={handleClosePopup}
      />
    </>
  );
};

export default Demo;
