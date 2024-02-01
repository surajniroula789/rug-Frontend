import React, { useState } from 'react';

const VerticalButtons = () => {
  // State to store the selected button
  const [selectedButton, setSelectedButton] = useState(null);

  // Function to handle button click
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  // Render the buttons
  return (
    <div>
      <button
        name="Frieze"
        onClick={() => handleButtonClick('Frieze')}
        className={`button ${selectedButton === 'Frieze' ? 'active' : ''}`}
      >
        Frieze
      </button>
      <button
        name="Rosette"
        onClick={() => handleButtonClick('Rosette')}
        className={`button ${selectedButton === 'Rosette' ? 'active' : ''}`}
      >
        Rosette
      </button>
      <button
        name="Wallpaper"
        onClick={() => handleButtonClick('Wallpaper')}
        className={`button ${selectedButton === 'Wallpaper' ? 'active' : ''}`}
      >
        Wallpaper
      </button>
    </div>
  );
};

export default VerticalButtons;