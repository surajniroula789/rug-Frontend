import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

const CarpetForm = ({ savedBorders, setSavedBorders }) => {
  const [lengthInMeters, setLengthInMeters] = useState("");
  const [breadthInMeters, setBreadthInMeters] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLength = parseFloat(lengthInMeters);
    const newBreadth = parseFloat(breadthInMeters);

    if (!isNaN(newLength) && !isNaN(newBreadth)) {
      let newBorders = [];
      if (Array.isArray(savedBorders)) {
        newBorders = [
          ...savedBorders,
          { length: newLength, breadth: newBreadth },
        ];
      } else {
        newBorders = [{ length: newLength, breadth: newBreadth }];
      }
      // setSavedBorders(newBorders);
      navigate(`/border?length=${newLength}&breadth=${newBreadth}`);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Carpet Border Design</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="length"
            className="block text-gray-700 font-bold mb-2"
          >
            Length (meters):
          </label>
          <input
            type="number"
            id="length"
            value={lengthInMeters}
            onChange={(e) => setLengthInMeters(e.target.value)}
            step="0.01"
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
            placeholder="Enter length in meters"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="breadth"
            className="block text-gray-700 font-bold mb-2"
          >
            Breadth (meters):
          </label>
          <input
            type="number"
            id="breadth"
            value={breadthInMeters}
            onChange={(e) => setBreadthInMeters(e.target.value)}
            step="0.01"
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
            placeholder="Enter breadth in meters"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarpetForm;
