import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const Rossette = () => {
  const navigate = useNavigate();
  const [canvasImage, setCanvasImage] = useState(null); // State to store the image data

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    localStorage.setItem("rosetteImage", dataURL); // Store image data in local storage
    // Navigate to the canvas page
    navigate("/combined");
  };

  const canvasRef = useRef(null);
  const OcanvasRef = useRef(null);

  const itemsRef = useRef([]);
  const itemCountRef = useRef(0);
  const dragItemRef = useRef(null);

  // wallpaper specific
  const currentColorRef = useRef("#000000");
  const currentToolRef = useRef(5);
  const currentLineWidthRef = useRef(5);
  const currentLineCapRef = useRef("round");

  const clearedItemsRef = useRef(null);

  const startingRef = useRef(true);
  const colors = [
    "#FF0000", // Red
    "#00BB00", // Green
    "#00BBBB", // Purple
    "#DD00DD", // Yellow
    "#FFFF00", // Blue
    "#0000FF",
    "#000000", // Black
  ];

  const [FREEHAND_TOOL, setFreeHandTool] = useState(5);
  const rotationCount = useRef(5);
  const reflection = useRef(false);
  const groupNum = useRef(11);
  const errorRef = useRef("");

  useEffect(() => {
    installMouser(canvasRef.current);
    addExtraFunctionsToGraphics(canvasRef.current.getContext("2d"));
    addExtraFunctionsToGraphics(OcanvasRef.current.getContext("2d"));
  }, []);

  const drawAll = () => {
    OcanvasRef.current.getContext("2d").fillStyle = "#FFFFFF";
    let k2 = OcanvasRef.current.getContext("2d");

    k2.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < itemCountRef.current; i++) {
      drawItem(k2, itemsRef.current[i]);
    }
    draw();
  };

  const draw = () => {
    console.log("hi");
    console.log(itemsRef.current);
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (dragItemRef.current) {
      drawItem(canvasRef.current.getContext("2d"), dragItemRef.current);
    }
    if (document.getElementById("showGridCB").checked) {
      drawGrid();
    }
  };

  function drawBasicItem(graphics, type, x1, x2, y1, y2) {
    if (type == 0) graphics.strokeLine(x1, y1, x2, y2);
    else if (type == 1) graphics.strokeRectFromCorners(x1, y1, x2, y2);
    else if (type == 2) graphics.strokeOval(x1, y1, x2, y2);
    else if (type == 3) graphics.fillRectFromCorners(x1, y1, x2, y2);
    else graphics.fillOval(x1, y1, x2, y2);
  }

  const drawItemToOSC = (item) => {
    drawItem(OcanvasRef.current.getContext("2d"), item);
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (document.getElementById("showGridCB").checked) {
      drawGrid();
    }
  };

  function addExtraFunctionsToGraphics(graphics) {
    graphics.strokeLine = function (x1, y1, x2, y2) {
      graphics.beginPath();
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
      graphics.stroke();
    };
    graphics.fillOval = function (x1, y1, x2, y2) {
      var x, y, horizontalRadius, verticalRadius;
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
      horizontalRadius = (Math.max(x1, x2) - x) / 2;
      verticalRadius = (Math.max(y1, y2) - y) / 2;
      x += horizontalRadius;
      y += verticalRadius;
      graphics.save();
      graphics.translate(x, y);
      graphics.scale(horizontalRadius, verticalRadius);
      graphics.beginPath();
      graphics.arc(0, 0, 1, 0, 2 * Math.PI, false);
      graphics.restore();
      graphics.fill();
    };
    graphics.strokeOval = function (x1, y1, x2, y2) {
      var x, y, horizontalRadius, verticalRadius;
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
      horizontalRadius = (Math.max(x1, x2) - x) / 2;
      verticalRadius = (Math.max(y1, y2) - y) / 2;
      x += horizontalRadius;
      y += verticalRadius;
      graphics.save();
      graphics.translate(x, y);
      graphics.scale(horizontalRadius, verticalRadius);
      graphics.beginPath();
      graphics.arc(0, 0, 1, 0, 2 * Math.PI, false);
      graphics.restore();
      graphics.stroke();
    };
    graphics.fillRectFromCorners = function (x1, y1, x2, y2) {
      var x, y, width, height;
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
      width = Math.max(x1, x2) - x;
      height = Math.max(y1, y2) - y;
      graphics.fillRect(x, y, width, height);
    };
    graphics.strokeRectFromCorners = function (x1, y1, x2, y2) {
      var x, y, width, height;
      x = Math.min(x1, x2);
      y = Math.min(y1, y2);
      width = Math.max(x1, x2) - x;
      height = Math.max(y1, y2) - y;
      graphics.strokeRect(x, y, width, height);
    };
  }

  function drawItem(graphics, item) {
    console.log(itemsRef.current);

    if (item.type == FREEHAND_TOOL) {
      for (var i = 0; i < item.lines.length; i++)
        drawItem(graphics, item.lines[i]);
      return;
    }
    if (item.type > 2) {
      graphics.fillStyle = item.color;
    } else {
      graphics.strokeStyle = item.color;
      graphics.lineWidth = item.lineWidth;
      graphics.lineCap = item.lineCap;
    }
    drawBasicItem(graphics, item.type, item.x1, item.x2, item.y1, item.y2);
    var dx = canvasRef.current.width / 2;
    var dy = canvasRef.current.height / 2;
    if (rotationCount.current > 0) {
      var da = (2 * Math.PI) / rotationCount.current;
      for (var i = 0; i < rotationCount.current; i++) {
        graphics.save();
        graphics.translate(dx, dy);
        graphics.rotate(i * da);
        graphics.translate(-dx, -dy);
        drawBasicItem(graphics, item.type, item.x1, item.x2, item.y1, item.y2);
        graphics.restore();
      }
    }
    if (reflection) {
      graphics.save();
      graphics.translate(dx, dy);
      graphics.scale(-1, 1);
      graphics.translate(-dx, -dy);
      drawBasicItem(graphics, item.type, item.x1, item.x2, item.y1, item.y2);
      if (rotationCount.current > 0) {
        var da = (2 * Math.PI) / rotationCount.current;
        for (var i = 0; i < rotationCount.current; i++) {
          graphics.save();
          graphics.translate(dx, dy);
          graphics.rotate(i * da);
          graphics.translate(-dx, -dy);
          drawBasicItem(
            graphics,
            item.type,
            item.x1,
            item.x2,
            item.y1,
            item.y2
          );
          graphics.restore();
        }
      }
      graphics.restore();
    }
  }
  function installMouser(theCanvas) {
    function convertX(clientX) {
      return Math.round(clientX - theCanvas.getBoundingClientRect().left);
    }

    function convertY(clientY) {
      return Math.round(clientY - theCanvas.getBoundingClientRect().top);
    }

    function doMouseDrag(evt) {
      console.log("drag");
      if (dragItemRef.current == null) {
        console.log("null dragitme");
        return;
      }

      dragItemRef.current.x2 = convertX(evt.clientX);
      dragItemRef.current.y2 = convertY(evt.clientY);

      if (currentToolRef.current === FREEHAND_TOOL) {
        var segment = {};
        segment.type = 0;
        segment.color = currentColorRef.current;
        segment.lineWidth = currentLineWidthRef.current;
        segment.lineCap = currentLineCapRef.current;
        segment.x1 = dragItemRef.current.x1;
        segment.x2 = dragItemRef.current.x2;
        segment.y1 = dragItemRef.current.y1;
        segment.y2 = dragItemRef.current.y2;
        dragItemRef.current.lines.push(segment);
        drawItemToOSC(segment);
        dragItemRef.current.x1 = segment.x2;
        dragItemRef.current.y1 = segment.y2;
      } else {
        draw();
      }
      evt.preventDefault();
    }

    function doMouseUp(evt) {
      console.log("up");
      if (dragItemRef.current == null) {
        console.log("up and null");
        return;
      }

      theCanvas.removeEventListener("mousemove", doMouseDrag);
      theCanvas.removeEventListener("mouseup", doMouseUp);
      const { x1, y1, x2, y2 } = dragItemRef.current;
      console.log(x1, x2, "\t", y1, y2);
      if (
        (currentToolRef.current === FREEHAND_TOOL &&
          dragItemRef.current.lines.length > 0) ||
        (currentToolRef.current === 0 &&
          (dragItemRef.current.x1 !== dragItemRef.current.x2 ||
            dragItemRef.current.y1 !== dragItemRef.current.y2)) ||
        (currentToolRef.current > 0 &&
          currentToolRef.current < FREEHAND_TOOL &&
          dragItemRef.current.x1 !== dragItemRef.current.x2 &&
          dragItemRef.current.y1 !== dragItemRef.current.y2)
      ) {
        if (itemCountRef.current < itemsRef.current.length)
          itemsRef.current.splice(
            itemCountRef.current,
            itemsRef.current.length - itemCountRef.current
          );

        itemsRef.current.push(dragItemRef.current);
        console.log("pushed");
        itemCountRef.current = itemsRef.current.length;
        document.getElementById("undo").disabled = false;
        document.getElementById("redo").disabled = true;
        document.getElementById("clear").disabled = false;
        document.getElementById("savebtn").disabled = false;
        clearedItemsRef.current = null;

        if (currentToolRef.current !== FREEHAND_TOOL) {
          drawItemToOSC(dragItemRef.current);
        }
      } else {
        console.log("else part");
      }

      dragItemRef.current = null;
      evt.preventDefault();
    }

    function doMouseDown(evt) {
      console.log("UP");
      if (startingRef.current) {
        drawAll();
        startingRef.current = false;
      }

      if (dragItemRef.current != null || evt.button > 0) {
        console.log("down ad null");
        return;
      }

      document.getElementById("error").innerHTML = "&nbsp;";
      theCanvas.addEventListener("mousemove", doMouseDrag);
      document.addEventListener("mouseup", doMouseUp);

      dragItemRef.current = {};
      dragItemRef.current.type = currentToolRef.current;
      dragItemRef.current.color = currentColorRef.current;
      dragItemRef.current.lineWidth = currentLineWidthRef.current;
      dragItemRef.current.lineCap = currentLineCapRef.current;
      dragItemRef.current.x1 = dragItemRef.current.x2 = convertX(evt.clientX);
      dragItemRef.current.y1 = dragItemRef.current.y2 = convertY(evt.clientY);

      if (currentToolRef.current === FREEHAND_TOOL) {
        dragItemRef.current.lines = [];
      }

      evt.preventDefault();
    }

    theCanvas.addEventListener("mousedown", doMouseDown);
  }

  // Convert the vanilla functions to React functions
  const selectLineWidth = (lineWidth) => {
    currentLineWidthRef.current = Number(lineWidth);
    if (
      currentToolRef.current === FREEHAND_TOOL ||
      currentLineWidthRef.current >= 3
    ) {
      currentLineCapRef.current = "round";
    } else {
      currentLineCapRef.current = "butt";
    }
    // You can add any additional logic here
  };

  const selectTool = (tool) => {
    currentToolRef.current = tool;
    if (
      currentToolRef.current === FREEHAND_TOOL ||
      currentLineWidthRef.current >= 3
    ) {
      currentLineCapRef.current = "round";
    } else {
      currentLineCapRef.current = "butt";
    }
    // You can add any additional logic here
  };

  const selectColor = (num) => {
    num = Number(num);
    currentColorRef.current = colors[num];
    // You can add any additional logic here
  };

  const selectRotationCount = (count) => {
    if (count !== rotationCount.current) {
      rotationCount.current = count;
      drawAll();
    }
  };

  const doReflect = (reflect) => {
    reflection.current = reflect;
    drawAll();
  };

  const colorToName = {
    "#000000": "Black",
    "#FF0000": "Red",
    "#00BB00": "Green",
    "#0000FF": "Blue",
    "#00BBBB": "Cyan",
    "#DD00DD": "Magenta",
    "#FFFF00": "Yellow",
    "#DDDDDD": "Light Gray",
    "#999999": "Gray",
    "#555555": "Dark Gray",
  };

  const nameToColor = {
    Black: "#000000",
    Red: "#FF0000",
    Green: "#00BB00",
    Blue: "#0000FF",
    Cyan: "#00BBBB",
    Magenta: "#DD00DD",
    Yellow: "#FFFF00",
    "Light Gray": "#DDDDDD",
    Gray: "#999999",
    "Dark Gray": "#555555",
  };

  const intToTool = [
    "Line",
    "Rectangle",
    "Oval",
    "Filled Rect",
    "Filled Oval",
    "Freehand",
  ];

  const toolToInt = {
    Line: 0,
    Rectangle: 1,
    Oval: 2,
    "Filled Rect": 3,
    "Filled Oval": 4,
    Freehand: 5,
  };

  // Undo function
  const undo = () => {
    if (clearedItemsRef.current !== null) {
      itemsRef.current = clearedItemsRef.current;
      itemCountRef.current = itemsRef.current.length;
      drawAll();
      document.getElementById("undo").disabled = false;
      document.getElementById("redo").disabled = true;
      clearedItemsRef.current = null;
    } else if (itemCountRef.current > 0) {
      itemCountRef.current--;
      drawAll();
      if (itemCountRef.current === 0)
        document.getElementById("undo").disabled = true;
      document.getElementById("redo").disabled = false;
    }
    document.getElementById("clear").disabled = itemCountRef.current === 0;
    document.getElementById("savebtn").disabled = itemCountRef.current === 0;
  };

  // Redo function
  const redo = () => {
    if (itemCountRef.current < itemsRef.current.length) {
      itemCountRef.current++;
      drawAll();
      if (itemCountRef.current === itemsRef.current.length)
        document.getElementById("redo").disabled = true;
      document.getElementById("clear").disabled = false;
      document.getElementById("savebtn").disabled = false;
    }
  };

  // Clear drawing function
  const clearDrawing = () => {
    if (itemsRef.current.length === 0) return;
    if (itemCountRef.current > 0) {
      if (itemsRef.current.length > itemCountRef.current)
        itemsRef.current.splice(
          itemCountRef.current,
          itemsRef.current.length - itemCountRef.current
        );
      clearedItemsRef.current = itemsRef.current;
    } else {
      clearedItemsRef.current = null;
    }
    itemsRef.current = [];
    itemCountRef.current = 0;
    drawAll();
    document.getElementById("clear").disabled = true;
    document.getElementById("savebtn").disabled = true;
    document.getElementById("redo").disabled = true;
    document.getElementById("undo").disabled = clearedItemsRef.current === null;
  };

  const handleRotationChange = (value) => {
    const count = parseInt(value); // Convert value to integer
    selectRotationCount(count);
  };

  return (
    <>
      <Header />
      <div id="content" class="container mx-auto p-4">
        <h2 className="relative text-cente  font-semibold text-white mt-4 mb-7">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-4 py-2 rounded-lg">
            Rosette Design
          </span>
        </h2>
        <div class="flex justify-center items-center mb-8">
          <Canvas
            ref={canvasRef}
            width={300}
            height={300}
            id="c1"
            class="rounded-full border border-gray-500"
          />
        </div>

        <Canvas ref={OcanvasRef} width={300} height={300} id="c2" hidden />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <td class="p-4 bg-gray-300">
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  id="reflectionCB"
                  class="form-checkbox h-4 w-4 text-indigo-600"
                  checked={reflection.current}
                  onChange={(e) => doReflect(e.target.checked)}
                />
                <span class="ml-2 font-semibold">Reflection</span>
              </label>
            </div>
            <div class="mt-4">
              <p class="font-semibold">Rotations:</p>
              <div class="mt-2">
                {[...Array(20)].map((_, index) => {
                  const value = index + 1;
                  return (
                    <label key={value} class="inline-flex items-center mr-6">
                      <input
                        type="radio"
                        name="rotations"
                        value={value}
                        id={`r${value}`}
                        class="form-radio h-4 w-4 text-indigo-600"
                        checked={rotationCount.current === value}
                        onChange={(e) => handleRotationChange(e.target.value)}
                      />
                      <span class="ml-2">{value === 1 ? "none" : value}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </td>

          <div class="ml-40 bg-gray-200 p-6 rounded-lg shadow-md">
            <div className="space-x-2">
              <button
                id="undo"
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={undo}
                title="Remove the most recently drawn item. Can also undo Clear if used immediately after clearing."
              >
                Undo
              </button>
              <button
                id="redo"
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={redo}
                title="Restore the draw item that was removed most recently by Undo."
              >
                Redo
              </button>
              <button
                id="clear"
                className="btn bg-red-100-200 hover:bg-red-200-300 text-red-800 font-semibold py-2 px-4 rounded"
                onClick={clearDrawing}
                title="Clear the current image. This can be undone if you click 'Undo' immediately after clearing."
              >
                Clear
              </button>
              {/* save buttom */}

              <button
                id="savebtn"
                className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSave}
              >
                Send_to_Rostte_Canvas
              </button>
            </div>
          </div>

          <div class="ml-40 bg-gray-200 p-6 rounded-lg shadow-md">
            <div class="grid grid-cols-3 gap-6">
              <div>
                <p class="font-semibold text-gray-800 mb-2">Tool:</p>
                <div>
                  {[...Array(6).keys()].map((tool) => (
                    <label key={tool} class="flex items-center mb-2">
                      <input
                        type="radio"
                        name="tool"
                        value={tool}
                        id={`t${tool}`}
                        onClick={() => selectTool(tool)}
                        class="mr-2"
                        checked="checked"
                      />
                      <span class="text-gray-800">
                        {
                          [
                            "Line",
                            "Rectangle",
                            "Oval",
                            "Filled Rect",
                            "Filled Oval",
                            "Freehand",
                          ][tool]
                        }
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p class="font-semibold text-gray-800 mb-2">Line Width:</p>
                <div>
                  {[1, 2, 3, 4, 5, 10].map((width) => (
                    <label key={width} class="flex items-center mb-2">
                      <input
                        type="radio"
                        name="linewidth"
                        value={width}
                        id={`lw${width}`}
                        onClick={() => selectLineWidth(width)}
                        class="mr-2"
                        checked="checked"
                      />
                      <span class="text-gray-800">{width}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p class="font-semibold text-gray-800 mb-2">Color:</p>
                <div>
                  {[...Array(7).keys()].map((color) => (
                    <label key={color} class="flex items-center mb-2">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        id={`c${color}`}
                        onClick={() => selectColor(color)}
                        class="mr-2"
                        checked="checked"
                      />
                      <span class="text-gray-800">
                        {
                          [
                            "Red",
                            "Green",
                            "Cyan",
                            "Magenta",
                            "Yellow",
                            "Blue",
                            "Black",
                          ][color]
                        }
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p id="showGridCB"></p>
        <p id="error"></p>

        {canvasImage && (
          <img
            src={canvasImage}
            alt="Design"
            class="mt-8 rounded border border-gray-500"
          />
        )}
      </div>
    </>
  );
};

export default Rossette;
