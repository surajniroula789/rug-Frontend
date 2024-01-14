import React, { useState, useRef } from "react";
import "../App.css";

const ImageComponent = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [file, setFile] = useState();
  const inputRef = useRef(null);
  const formData = new FormData();

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files; // Fixed: Removed [0]
    setFile(droppedFiles[0]); // Now it correctly accesses the dropped file
    inputRef.current.files = droppedFiles; // Update the input element's files
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);

    formData.append("image", file);

    try {
      const response = await fetch("http://127.0.0.1:8000", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      setImageSrc(data.url);
      setLoading(false);
    } catch (error) {
      setError("Error fetching image");
      setLoading(false);
      console.error("Error fetching image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Galaincha Generation</h1>
      <div
        className="flex flex-col items-center space-y-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className="border border-gray-300 py-10 px-4 rounded-md cursor-pointer"
          // onClick={() => fileInputRef.current.click()} // Access click event of the input element
        >
          <p className="text-lg  text-gray-600">
            Drag & Drop or Click to Upload
          </p>
          <input
            type="file"
            ref={inputRef} // Assign the ref to the input element
            onChange={handleFileInputChange}
            accept="image/*"
            className="border border-gray-300 py-2 px-4 rounded-md"
          />
        </div>
        <button
          onClick={() => handleImageUpload(file)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Generate
        </button>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && imageSrc && (
          <div className="mt-8 output">
            <h2 className="text-xl font-semibold mb-4 pt-2 pl-2">
              Generated Image:
            </h2>
            <img
              src={imageSrc}
              alt="Generated"
              className="rounded-md shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComponent;
