import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import "tailwindcss/tailwind.css";
import Header from "./Header";

const CarpetDesigner = () => {
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawingMode, setDrawingMode] = useState("rectangle");
  const [finalDesign, setFinalDesign] = useState([]);
  const [carpetSize, setCarpetSize] = useState({ width: 600, height: 600 });
  const drawingRef = useRef();

  const handleRectClick = () => {
    setDrawingMode("rectangle");
  };

  const handleCircleClick = () => {
    setDrawingMode("circle");
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setStartPoint({ x: e.evt.layerX, y: e.evt.layerY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }

    const newShapes = [...shapes];
    const width = e.evt.layerX - startPoint.x;
    const height = e.evt.layerY - startPoint.y;

    // Update the last shape (rectangle or circle being drawn)
    newShapes.pop();
    if (drawingMode === "rectangle") {
      newShapes.push({
        type: "rect",
        x: startPoint.x,
        y: startPoint.y,
        width,
        height,
        fill: "gray",
        stroke: "black",
        strokeWidth: 3,
      });
    } else {
      newShapes.push({
        type: "circle",
        x: startPoint.x,
        y: startPoint.y,
        radius: Math.sqrt(width ** 2 + height ** 2),
        fill: "brown",
        stroke: "black",
        strokeWidth: 3,
      });
    }

    setShapes(newShapes);
  };

  const handleFinalizeDesign = () => {
    // Concatenate the shapes to the final design
    setFinalDesign((prevDesign) => [...prevDesign, ...shapes]);
    // Clear the shapes for the next design
    setShapes([]);
  };

  const handleWidthChange = (e) => {
    setCarpetSize({ ...carpetSize, width: parseInt(e.target.value, 10) || 0 });
  };

  const handleHeightChange = (e) => {
    setCarpetSize({ ...carpetSize, height: parseInt(e.target.value, 10) || 0 });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
        <div className="mb-4">
          <button
            className={`${
              drawingMode === "rectangle" ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={handleRectClick}
          >
            Rectangle
          </button>
          <button
            className={`${
              drawingMode === "circle" ? "bg-blue-500" : "bg-gray-300"
            } ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={handleCircleClick}
          >
            Circle
          </button>
          <button
            className="bg-green-500 ml-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleFinalizeDesign}
          >
            Finalize Design
          </button>
        </div>
        <div className="mb-4">
          <label className="mr-2">Width:</label>
          <input
            type="number"
            value={carpetSize.width}
            onChange={handleWidthChange}
            className="border border-gray-300 p-2"
          />
          <label className="ml-4 mr-2">Height:</label>
          <input
            type="number"
            value={carpetSize.height}
            onChange={handleHeightChange}
            className="border border-gray-300 p-2"
          />
        </div>
        <div
          className="border border-gray-500 overflow-hidden"
          style={{
            width: `${carpetSize.width}px`,
            height: `${carpetSize.height}px`,
          }}
        >
          <Stage
            width={carpetSize.width}
            height={carpetSize.height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={drawingRef}
          >
            <Layer>
              {finalDesign.map((shape, index) => (
                <React.Fragment key={index}>
                  {shape.type === "rect" && (
                    <Rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill || "gray"}
                      stroke={shape.stroke || "black"}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                  {shape.type === "circle" && (
                    <Circle
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.fill || "brown"}
                      stroke={shape.stroke || "black"}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                </React.Fragment>
              ))}
              {shapes.map((shape, index) => (
                <React.Fragment key={index}>
                  {shape.type === "rect" && (
                    <Rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill || "gray"}
                      stroke={shape.stroke || "black"}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                  {shape.type === "circle" && (
                    <Circle
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.fill || "brown"}
                      stroke={shape.stroke || "black"}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                </React.Fragment>
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
};

export default CarpetDesigner;
