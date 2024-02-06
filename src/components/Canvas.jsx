import React, { useRef, useEffect } from "react";
import Header from "./Header";
import CanvasPage from "./CanvasPageComp";

const Canvas = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const handleMouseDown = (event) => {
      isDrawing.current = true;
      lastPosition.current = getMousePosition(event);
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const handleMouseMove = (event) => {
      if (!isDrawing.current) return;

      const currentPosition = getMousePosition(event);
      context.beginPath();
      context.moveTo(lastPosition.current.x, lastPosition.current.y);

      // Check if the current position is within the canvas boundaries
      if (
        currentPosition.x >= 0 &&
        currentPosition.x <= canvas.width &&
        currentPosition.y >= 0 &&
        currentPosition.y <= canvas.height
      ) {
        context.lineTo(currentPosition.x, currentPosition.y);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();
        lastPosition.current = currentPosition;
      }
    };

    const getMousePosition = (event) => {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Run only once after the component is mounted

  return (
    <>
      <Header />
      <CanvasPage />
      <canvas
        ref={canvasRef}
        width={1500}
        height={600}
        style={{ border: "1px solid black" }}
      ></canvas>
    </>
  );
};
export default Canvas;
