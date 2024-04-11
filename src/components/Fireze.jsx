import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const intToGroup = ["p111", "pm11", "p1m1", "pmm2", "p112", "p1a1", "pma2"];
const groupToInt = {
  p111: 0,
  pm11: 1,
  p1m1: 2,
  pmm2: 3,
  p112: 4,
  p1a1: 5,
  pma2: 6,
};
const colorToName = {
  "#FF0000": "Red",
  "#00BB00": "Green",
  "#0000FF": "Blue",
  "#00BBBB": "Cyan",
  "#DD00DD": "Magenta",
  "#FFFF00": "Yellow",
  "#000000": "Black",
};
const nameToColor = {
  Red: "#FF0000",
  Green: "#00BB00",
  Blue: "#0000FF",
  Cyan: "#00BBBB",
  Magenta: "#DD00DD",
  Yellow: "#FFFF00",
  Black: "#000000",
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
const colors = [
  "#FF0000",
  "#00BB00",
  "#0000FF",
  "#00BBBB",
  "#DD00DD",
  "#FFFF00",
  "#000000",
];

const FriezeSymmetry = ({ onSend }) => {
  const navigate = useNavigate();
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

  const FREEHAND_TOOL = useRef(5);
  const translate = useRef(200);

  const groupNum = useRef(1);
  const errorRef = useRef("");

  useEffect(() => {
    installMouser(canvasRef.current);
    addExtraFunctionsToGraphics(canvasRef.current.getContext("2d"));
    addExtraFunctionsToGraphics(OcanvasRef.current.getContext("2d"));
    doResize();
    window.onresize = doResize;
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
  };

  function drawBasicItem(graphics, type, x1, x2, y1, y2) {
    // describes the way to draw line rectangle or
    var minX = Math.min(x1, x2) - 10;
    var maxX = Math.max(x1, x2) + 10;
    var startX = -translate.current * Math.floor(maxX / translate.current);
    while (startX + minX < canvasRef.current.width) {
      graphics.save();
      graphics.translate(startX, 0);
      if (type == 0) graphics.strokeLine(x1, y1, x2, y2);
      else if (type == 1) graphics.strokeRectFromCorners(x1, y1, x2, y2);
      else if (type == 2) graphics.strokeOval(x1, y1, x2, y2);
      else if (type == 3) graphics.fillRectFromCorners(x1, y1, x2, y2);
      else graphics.fillOval(x1, y1, x2, y2);
      graphics.restore();
      startX += translate.current;
    }
  }

  const drawItemToOSC = (item) => {
    drawItem(OcanvasRef.current.getContext("2d"), item);
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if ((document.getElementById("showGridCB").checked = false)) {
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
    console.log(groupNum.current, "\t new tranlsate", translate.current);
    // decribes which particular item to draw
    if (item.type == FREEHAND_TOOL.current) {
      // if free hand tool; then recursive call is there
      //
      for (var i = 0; i < item.lines.length; i++) {
        drawItem(graphics, item.lines[i]);
      }
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
    if (
      groupNum.current == 1 ||
      groupNum.current == 3 ||
      groupNum.current == 6
    ) {
      drawBasicItem(graphics, item.type, -item.x1, -item.x2, item.y1, item.y2);
    }
    if (groupNum.current == 2 || groupNum.current == 3) {
      drawBasicItem(
        graphics,
        item.type,
        item.x1,
        item.x2,
        128 - item.y1,
        128 - item.y2
      );
    }
    if (groupNum.current == 3 || groupNum.current == 4) {
      drawBasicItem(
        graphics,
        item.type,
        -item.x1,
        -item.x2,
        128 - item.y1,
        128 - item.y2
      );
    }
    if (groupNum.current == 5 || groupNum.current == 6) {
      drawBasicItem(
        graphics,
        item.type,
        item.x1 + translate.current / 2,
        item.x2 + translate.current / 2,
        128 - item.y1,
        128 - item.y2
      );
    }
    if (groupNum.current == 6) {
      drawBasicItem(
        graphics,
        item.type,
        -item.x1 + translate.current / 2,
        -item.x2 + translate.current / 2,
        128 - item.y1,
        128 - item.y2
      );
    }
  }

  function doResize() {
    var rect = document.getElementById("frieze").getBoundingClientRect();
    canvasRef.current.width = rect.width;
    canvasRef.current.height = 128;
    // canvasRef.current.height = 65;
    // canvasRef.current.width = 600;
    OcanvasRef.current.width = canvasRef.current.width;
    OcanvasRef.current.height = canvasRef.current.height;
    drawAll();
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

      if (currentToolRef.current === FREEHAND_TOOL.current) {
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
        (currentToolRef.current === FREEHAND_TOOL.current &&
          dragItemRef.current.lines.length > 0) ||
        (currentToolRef.current === 0 &&
          (dragItemRef.current.x1 !== dragItemRef.current.x2 ||
            dragItemRef.current.y1 !== dragItemRef.current.y2)) ||
        (currentToolRef.current > 0 &&
          currentToolRef.current < FREEHAND_TOOL.current &&
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

        if (currentToolRef.current !== FREEHAND_TOOL.current) {
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

      if (currentToolRef.current === FREEHAND_TOOL.current) {
        dragItemRef.current.lines = [];
      }

      evt.preventDefault();
    }

    theCanvas.addEventListener("mousedown", doMouseDown);
  }

  function doApply() {
    if (checkInputs()) {
      drawAll();
    }
  }

  function checkForReturnKey(evt) {
    if (evt.keyCode == 13) doApply();
  }

  function checkInputs() {
    let newT = Number(document.getElementById("translation").value);
    console.log("new", newT);
    if (isNaN(newT) || newT < 20 || newT > 1000) {
      document.getElementById("tmsg").innerHTML =
        "Translation must be a number, 10 to 1000! Change not applied";
      console.log("asda issue trans");
      return false;
    }
    document.getElementById("tmsg").innerHTML = "&nbsp;";
    translate.current = newT;
    console.log(translate.current, "updated");
    return true;
  }

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
  //chage this to set curentREf item

  const drawGrid = () => {
    let graphics = canvasRef.current.getContext("2d");

    graphics.lineWidth = 1;
    graphics.lineCap = "butt";
    graphics.globalAlpha = 0.5;
    for (var i = 0; i < 2; i++) {
      graphics.save();
      if (i == 1) {
        graphics.strokeStyle = "black";
        graphics.translate(0.5, 0.5);
      } else {
        graphics.strokeStyle = "white";
        graphics.translate(-0.5, -0.5);
      }
      var w = canvasRef.current.width;
      var h = canvasRef.current.height;
      var dx;
      if (groupNum.current == 0 || groupNum.current == 2) dx = translate;
      else dx = translate / 2;
      var x = dx;
      while (x < w) {
        graphics.strokeLine(x, 0, x, h);
        x += dx;
      }
      if (groupNum.current > 1) {
        graphics.strokeLine(0, h / 2, w, h / 2);
      }
      graphics.restore();
    }
    graphics.globalAlpha = 1.0;
  };

  const selectGroup = (num) => {
    console.log(num, "Asdsad", groupNum.current);
    num = Number(num);
    if (num === groupNum.current) {
      return;
    }
    groupNum.current = num;
  };
  // Convert the vanilla functions to React functions
  const selectLineWidth = (lineWidth) => {
    currentLineWidthRef.current = Number(lineWidth);
    if (
      currentToolRef.current === FREEHAND_TOOL.current ||
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
      currentToolRef.current === FREEHAND_TOOL.current ||
      currentLineWidthRef.current >= 3
    ) {
      currentLineCapRef.current = "round";
    } else {
      currentLineCapRef.current = "butt";
    }
    // You can add any additional logic here
  };

  const selectColor = (num) => {
    if (currentColorRef.current == num) {
      return;
    } else {
      currentColorRef.current = num;
    }
    console.log("new color", currentColorRef.current);
    // You can add any additional logic here
  };

  const sendDesign = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL(); // Capture the canvas content as an image
    localStorage.setItem("FirezeImage", dataURL);
    // onSend(dataURL); // Pass the image data to the parent component
    navigate("/c-fireze");
  };

  return (
    <>
      <Header />
      <div id="content">
        <h2 className="relative text-center font-semibold text-white mt-4 mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-4 py-2 rounded-lg">
            Frieze Design
          </span>
        </h2>

        <div id="frieze">
          <Canvas ref={canvasRef} width={500} id="c1" />
          <Canvas ref={OcanvasRef} height={128} id="c2" hidden />
        </div>
        {/* <div className="flex items-center justify-center h-full">
          <div id="frieze" className="flex items-center justify-center">
            <Canvas ref={canvasRef} width={500} id="c1" />
            <Canvas ref={OcanvasRef} height={128} id="c2" hidden />
          </div>
        </div> */}

        <label>
          <input
            type="checkbox"
            name="show grid"
            onchange="toggleArea()"
            id="showGridCB"
            className="mb-4"
            hidden
          />
        </label>

        <div className="flex flex-wrap justify-center gap-4 mt-24">
          <div className="ml-36 flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow-md">
            {/* Undo/Redo/Clear Buttons */}
            <div className="space-x-2">
              <button
                className="px-4 py-2 text-black rounded-md shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4"
                id="undo"
                onClick={undo}
                title="Remove the most recently drawn item. Can also undo Clear if used immediately after clearing."
              >
                Undo
              </button>
              <button
                className="px-4 py-2 text-black rounded-md shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4"
                id="redo"
                onClick={redo}
                title="Restore the draw item that was removed most recently by Undo."
              >
                Redo
              </button>
              <button
                id="clear"
                className="px-4 py-2 text-black rounded-md shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4"
                onClick={clearDrawing}
                title="Clear the current image. This can be undone if you click 'Undo' immediately after clearing."
              >
                Clear
              </button>
              {/* Save Button */}

              <button
                id="savebtn"
                className="px-4 py-2 text-black rounded-md bg-green-200 shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4"
                onClick={sendDesign}
              >
                Send to frieze
              </button>
            </div>
          </div>

          <div className="mx-auto border border-gray-400 bg-gray-200 p-4 rounded-md shadow-lg">
            <tr>
              <th colSpan="2">
                <span id="error" className="text-red-500">
                  &nbsp;
                </span>
              </th>
            </tr>
            <tr>
              <td colSpan="4" className="text-center">
                <label
                  className="block text-gray-700 mb-2"
                  title="Horizontal translation in pixels, in the range 20 to 1000. You must click Apply or press Enter for a change to take effect."
                >
                  Translation Amount:
                  <input
                    type="text"
                    onKeyDown={checkForReturnKey}
                    size="4"
                    maxLength="4"
                    id="translation"
                    className="border border-gray-300 px-2 py-1 rounded-md ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <button
                  onClick={doApply}
                  title="Check input and if legal, apply to the current image. You can also do this by pressing Enter in an input box."
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply
                </button>
                <br />
                <span id="tmsg" className="text-red-500">
                  &nbsp;
                </span>
              </td>
            </tr>
            <tr>
              <td valign="top" className="pr-4">
                <div className="mb-4">
                  <b className="block text-gray-700">Symmetry Group:</b>
                  {intToGroup.map((group, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name="group"
                        value={index}
                        id={`g${index}`}
                        onClick={() => selectGroup(index)}
                        className="form-radio"
                        checked="checked"
                      />
                      <span>{group}</span>
                    </label>
                  ))}
                </div>
              </td>
              <td valign="top" className="pr-4">
                <div className="mb-4">
                  <b className="block text-gray-700">Tool:</b>
                  {intToTool.map((tool, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name="tool"
                        value={index}
                        id={`t${index}`}
                        onClick={() => selectTool(index)}
                        className="form-radio"
                        checked="checked"
                      />
                      <span>{tool}</span>
                    </label>
                  ))}
                </div>
              </td>
              <td valign="top" className="pr-4">
                <div className="mb-4">
                  <b className="block text-gray-700">Line Width:</b>
                  {[1, 2, 3, 4, 5, 10].map((width, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name="linewidth"
                        value={width}
                        id={`lw${width}`}
                        onClick={() => selectLineWidth(width)}
                        className="form-radio"
                        checked="checked"
                      />
                      <span>{width}</span>
                    </label>
                  ))}
                </div>
              </td>
              <td valign="top">
                <div className="mb-4">
                  <b className="block text-gray-700">Color:</b>
                  {Object.entries(colorToName).map(([color, name], index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        id={`c${index}`}
                        onClick={() => selectColor(color)}
                        className="form-radio"
                        checked="checked"
                      />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriezeSymmetry;
