import React, { useState, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  RegularPolygon,
  Ellipse,
} from "react-konva";

const CarpetDesigner = () => {
  const [shapes, setShapes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawingMode, setDrawingMode] = useState("rectangle");
  const [carpetSize, setCarpetSize] = useState({ width: 600, height: 600 });
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("black");
  const [showGrid, setShowGrid] = useState(true);
  const drawingRef = useRef();

  const handleShapeClick = (shapeType) => {
    setDrawingMode(shapeType);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setStartPoint({ x: e.evt.layerX, y: e.evt.layerY });
    setRedoStack([]);
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

    if (drawingMode === "rectangle") {
      newShapes.push({
        type: "rect",
        x: startPoint.x,
        y: startPoint.y,
        width,
        height,
        fill: "gray",
        stroke: strokeColor,
        strokeWidth,
      });
    } else if (drawingMode === "circle") {
      newShapes.push({
        type: "circle",
        x: startPoint.x,
        y: startPoint.y,
        radius: Math.sqrt(width ** 2 + height ** 2),
        fill: "brown",
        stroke: strokeColor,
        strokeWidth,
      });
    } else if (drawingMode === "ellipse") {
      newShapes.push({
        type: "ellipse",
        x: startPoint.x,
        y: startPoint.y,
        width,
        height,
        fill: "orange",
        stroke: strokeColor,
        strokeWidth,
      });
    } else if (drawingMode === "triangle") {
      newShapes.push({
        type: "triangle",
        x: startPoint.x,
        y: startPoint.y,
        width,
        height,
        fill: "green",
        stroke: strokeColor,
        strokeWidth,
      });
    }

    setShapes(newShapes);
  };

  const handleUndo = () => {
    if (shapes.length > 0) {
      const lastShape = shapes[shapes.length - 1];
      const newUndoStack = [...redoStack, lastShape];
      setRedoStack(newUndoStack);
      setShapes(shapes.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextShape = redoStack[redoStack.length - 1];
      const newShapes = [...shapes, nextShape];
      const newRedoStack = redoStack.slice(0, -1);
      setRedoStack(newRedoStack);
      setShapes(newShapes);
    }
  };

  const handleFinalizeDesign = () => {
    if (drawingRef.current) {
      const stage = drawingRef.current.getStage();

      if (stage) {
        const dataURL = stage.toDataURL();
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "carpet_design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    setShapes([]);
    setRedoStack([]);
  };

  const handleWidthChange = (e) => {
    setCarpetSize({ ...carpetSize, width: parseInt(e.target.value, 10) || 0 });
  };

  const handleHeightChange = (e) => {
    setCarpetSize({ ...carpetSize, height: parseInt(e.target.value, 10) || 0 });
  };

  const handleStrokeWidthChange = (e) => {
    setStrokeWidth(parseInt(e.target.value, 10) || 1);
  };

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);
  };

  const handleGridToggle = () => {
    setShowGrid(!showGrid);
  };

  const generateGridlines = () => {
    const lines = [];
    const gridSize = 20;

    if (showGrid) {
      for (let i = 0; i < carpetSize.width; i += gridSize) {
        lines.push(
          <Line
            key={`vertical_${i}`}
            points={[i, 0, i, carpetSize.height]}
            stroke="lightgray"
          />
        );
      }

      for (let j = 0; j < carpetSize.height; j += gridSize) {
        lines.push(
          <Line
            key={`horizontal_${j}`}
            points={[0, j, carpetSize.width, j]}
            stroke="lightgray"
          />
        );
      }
    }

    return lines;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-8">
        <div className="mb-4">
          <button
            className={`${
              drawingMode === "rectangle" ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
            onClick={() => handleShapeClick("rectangle")}
          >
            Rectangle
          </button>
          <button
            className={`${
              drawingMode === "circle" ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
            onClick={() => handleShapeClick("circle")}
          >
            Circle
          </button>

          <button
            className={`${
              drawingMode === "ellipse" ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
            onClick={() => handleShapeClick("ellipse")}
          >
            Ellipse
          </button>
          <button
            className={`${
              drawingMode === "triangle" ? "bg-blue-500" : "bg-gray-300"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
            onClick={() => handleShapeClick("triangle")}
          >
            Triangle
          </button>
          <button
            className={`${
              showGrid ? "bg-gray-300" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2`}
            onClick={handleGridToggle}
          >
            {showGrid ? "Hide Grid" : "Show Grid"}
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRedo}
          >
            Redo
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
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
            className="border border-gray-300 p-2 mr-2"
          />
          <label className="mr-2">Height:</label>
          <input
            type="number"
            value={carpetSize.height}
            onChange={handleHeightChange}
            className="border border-gray-300 p-2 mr-2"
          />
          <label className="mr-2">Stroke Width:</label>
          <input
            type="number"
            value={strokeWidth}
            onChange={handleStrokeWidthChange}
            className="border border-gray-300 p-2 mr-2"
          />
          <label className="mr-2">Stroke Color:</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => handleStrokeColorChange(e.target.value)}
            className="border border-gray-300 p-2"
          />
        </div>
        <div className="border border-gray-500 overflow-hidden">
          <Stage
            width={carpetSize.width}
            height={carpetSize.height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={drawingRef}
          >
            <Layer>{generateGridlines()}</Layer>
            <Layer>
              {shapes.map((shape, index) => (
                <React.Fragment key={index}>
                  {shape.type === "rect" && (
                    <Rect
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill || "gray"}
                      stroke={shape.stroke || strokeColor}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                  {shape.type === "circle" && (
                    <Circle
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.fill || "brown"}
                      stroke={shape.stroke || strokeColor}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}

                  {shape.type === "ellipse" && (
                    <Ellipse
                      x={shape.x + shape.width / 2}
                      y={shape.y + shape.height / 2}
                      radiusX={shape.width / 2}
                      radiusY={shape.height / 2}
                      fill={shape.fill || "orange"}
                      stroke={shape.stroke || strokeColor}
                      strokeWidth={shape.strokeWidth || 1}
                    />
                  )}
                  {shape.type === "triangle" && (
                    <RegularPolygon
                      x={shape.x}
                      y={shape.y}
                      sides={3}
                      radius={Math.max(shape.width, shape.height) / 2}
                      fill={shape.fill || "green"}
                      stroke={shape.stroke || strokeColor}
                      strokeWidth={shape.strokeWidth || 1}
                      rotation={-30}
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