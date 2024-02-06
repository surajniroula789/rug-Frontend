import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const Rossette = () => {
  const [canvasImage, setCanvasImage] = useState(null); // State to store the image data

  const handleSend = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    localStorage.setItem("rosetteImage", dataURL); // Store image data in local storage
    // Navigate to the canvas page
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL(); // This will give you a base64-encoded PNG image
    // Now you can do something with the dataURL, like saving it or displaying it
    console.log(dataURL);
    // Add your logic for saving or displaying the image here
  };

  const canvasRef = useRef(null);
  const OcanvasRef = useRef(null);

  const itemsRef = useRef([]);
  const itemCountRef = useRef(0);
  const dragItemRef = useRef(null);

  // wallpaper specific
  const currentColorRef = useRef("#000ff0");
  const currentToolRef = useRef(2);
  const currentLineWidthRef = useRef(3);
  const currentLineCapRef = useRef("round");

  const clearedItemsRef = useRef(null);

  const startingRef = useRef(true);
  const colors = [
    "#000000",
    "#FF0000",
    "#00BB00",
    "#0000FF",
    "#00BBBB",
    "#DD00DD",
    "#FFFF00",
    "#DDDDDD",
    "#999999",
    "#555555",
  ];

  const [FREEHAND_TOOL, setFreeHandTool] = useState(5);
  const rotationCount = useRef(14);
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

  const drawGrid = () => {};

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
      // You can add any additional logic here
    }
  };

  const doReflect = (reflect) => {
    reflection.current = reflect;
    // You can add any additional logic here
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

  return (
    <>
      <Header />
      <div id="content">
        <h2>
          Rosette Symmetry
          <br />
          <span style={{ fontSize: "60%" }}>
            (Rotation and Dihedral Groups)
          </span>
        </h2>

        <Canvas ref={canvasRef} width={600} height={600} id="c1" />
        <Canvas ref={OcanvasRef} width={800} height={600} id="c2" hidden />

        <table border={0} cellPadding={5} cellSpacing={5} align="center">
          <tbody>
            <tr>
              <td valign="top" bgcolor="#DDDDDD">
                <p>
                  <label>
                    <input
                      type="checkbox"
                      id="reflectionCB"
                      onChange={(e) => doReflect(e.target.checked)}
                      checked={reflection.current}
                    />
                    <b>Reflection</b>
                  </label>
                </p>
                <p>
                  <b>Rotations:</b>
                  <br />
                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                  ].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="rotations"
                        value={value}
                        id={`r${value}`}
                        onChange={(e) => selectRotationCount(e.target.value)} // Change this
                        checked={rotationCount.current === value}
                      />
                      {value === 1 ? "none" : value}
                    </label>
                  ))}
                </p>
              </td>
              <td valign="top">
                <p align="center" id="bb">
                  <button
                    id="undo"
                    title="Remove the most recently drawn item. Can also undo Clear if used immediately after clearing."
                  >
                    Undo
                  </button>
                  <button
                    id="redo"
                    title="Restore the draw item that was removed most recently by Undo."
                  >
                    Redo
                  </button>
                  <button
                    id="clear"
                    title="Clear the current image. This can be undone if you click 'Undo' immediately after clearing."
                  >
                    Clear
                  </button>
                  <input
                    type="checkbox"
                    onChange={draw}
                    id="showSlicesCB"
                    style={{ marginLeft: "30px" }}
                  />
                  <label htmlFor="showSlicesCB" style={{ color: "white" }}>
                    Show Slices
                  </label>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                  <button
                    id="savebtn"
                    onClick={handleSave}
                    title="Save to local file. This will not save the image; it saves a specification of the image that can be reloaded into this web app."
                  >
                    Save
                  </button>
                  <button title="Load image specification from a local file. File load cannot be undone.">
                    Load
                  </button>
                </p>
              </td>
              <td valign="top" bgcolor="#DDDDDD">
                <p>
                  <b>Tool:</b>
                  <br />
                  {[0, 1, 2, 3, 4, 5].map((tool) => (
                    <label key={tool}>
                      <input
                        type="radio"
                        name="tool"
                        value={tool}
                        id={`t${tool}`}
                        onClick={() => selectTool(tool)}
                        checked={currentToolRef.current === tool}
                      />
                      {tool === 5 ? "Freehand" : ` Tool ${tool}`}
                    </label>
                  ))}
                </p>
                <p>
                  <b>Line Width:</b>
                  <br />
                  {[1, 2, 3, 4, 5, 10, 20].map((width) => (
                    <label key={width}>
                      <input
                        type="radio"
                        name="linewidth"
                        value={width}
                        id={`lw${width}`}
                        onClick={() => selectLineWidth(width)}
                        checked={currentLineWidthRef.current === width}
                      />
                      {width}
                    </label>
                  ))}
                </p>
                <p>
                  <b>Color:</b>
                  <br />
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((color) => (
                    <label key={color}>
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        id={`c${color}`}
                        onChange={drawGrid} // Change this
                        onClick={() => selectColor(color)}
                        checked={
                          colors[currentColorRef.current] === colors[color]
                        }
                      />
                      {color === 7 ? "Light Gray" : ` Color ${color}`}
                    </label>
                  ))}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <p id="showGridCB"></p>
        <p id="error"></p>
        {canvasImage && (
          <img
            src={canvasImage}
            alt="Design"
            className="mt-4 rounded border border-gray-500"
          />
        )}
      </div>
    </>
  );
};

export default Rossette;
