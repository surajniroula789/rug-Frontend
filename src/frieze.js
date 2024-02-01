import React, { useState, useEffect, useRef } from 'react';

import useMyCanvas from './o';

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} />;
});

const MyDrawingApp = () => {
  const canvasRef=useRef(null);
  const OcanvasRef=useRef(null);
  
  
  
  const [translationInput, setTranslationInput] = useState(null);
  const [currentTool, setCurrentTool] = useState(1);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentLineWidth, setCurrentLineWidth] = useState(2);
  const [currentLineCap, setCurrentLineCap] = useState('butt');
  const [translate, setTranslate] = useState(200);
  const [groupNum, setGroupNum] = useState(0);
  
  //these to normal constatnts
  const dragItemRef = useRef(null);
  const itemsRef = useRef([]);

  
  const [itemCount, setItemCount] = useState(0);
  const setItemsRef = (value) => {
    itemsRef.current = value;
  };

  const [clearedItems, setClearedItems] = useState(null);
  const [starting, setStarting] = useState(true);
  
  const [FREEHAND_TOOL,setFreeHandTool]=useState(5);

  const colors = [
    '#000000',
    '#FF0000',
    '#00BB00',
    '#0000FF',
    '#00BBBB',
    '#DD00DD',
    '#FFFF00',
    '#DDDDDD',
    '#999999',
    '#555555',
  ];




  useEffect(() => {

    
    installMouser(canvasRef.current);
    addaddExtraFunctionsToGraphics(canvasRef.current.getContext("2d"));
    addaddExtraFunctionsToGraphics(OcanvasRef.current.getContext("2d"));
    
    setTranslationInput(document.getElementById('translation'));
    drawAll()


  }, []);

  

  const checkInput = () => {
    const newT = Number(translationInput.value);
    if (isNaN(newT) || newT < 20 || newT > 1000) {
      document.getElementById('tmsg').innerHTML =
        'Translation must be a number, 10 to 1000! Change not applied';
      return false;
    }
    document.getElementById('tmsg').innerHTML = '&nbsp;';
    setTranslate(newT);
    return true;
  };

  const drawAll = () => {

    OcanvasRef.current.getContext("2d").fillStyle = '#FFFFFF';
    let k2  = OcanvasRef.current.getContext("2d");
    
    
    k2.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < itemCount; i++) {
      drawItem(k2, itemsRef.current[i]);
    }
    draw();
  };


const draw = () => {
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (dragItemRef.current) {
      drawItem(canvasRef.current.getContext("2d"), dragItemRef.current);
    }
    if (document.getElementById('showGridCB').checked) {
      drawGrid();
    }
  };
  

  

  const drawItemToOSC = (item) => {
    drawItem(OcanvasRef.current.getContext("2d"), item);
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (document.getElementById('showGridCB').checked) {
      drawGrid();
    }
  };


  const drawItem = (ctx, item) => {
    if (item.type === FREEHAND_TOOL) {
        // Ensure lines array is initialized
        if (!item.lines) {
          item.lines = [];
        }
    
        // Loop through lines and recursively draw
        for (var i = 0; i < item.lines.length; i++) {
          drawItem(ctx, item.lines[i]);
        }
        return;
      }
    if (item.type > 2) {
      ctx.fillStyle = item.color;
    } else {
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.lineWidth;
      ctx.lineCap = item.lineCap;
    }
    drawBasicItem(ctx, item.type, item.x1, item.x2, item.y1, item.y2);
    if (groupNum === 1 || groupNum === 3 || groupNum === 6) {
      drawBasicItem(ctx, item.type, -item.x1, -item.x2, item.y1, item.y2);
    }
    if (groupNum === 2 || groupNum === 3) {
      drawBasicItem(ctx, item.type, item.x1, item.x2, 128 - item.y1, 128 - item.y2);
    }
    if (groupNum === 3 || groupNum === 4) {
      drawBasicItem(ctx, item.type, -item.x1, -item.x2, 128 - item.y1, 128 - item.y2);
    }
    if (groupNum === 5 || groupNum === 6) {
      drawBasicItem(ctx, item.type, item.x1 + translate / 2, item.x2 + translate / 2, 128 - item.y1, 128 - item.y2);
    }
    if (groupNum === 6) {
      drawBasicItem(ctx, item.type, -item.x1 + translate / 2, -item.x2 + translate / 2, 128 - item.y1, 128 - item.y2);
    }
  };

  const drawBasicItem = (ctx, type, x1, x2, y1, y2) => {
    const minX = Math.min(x1, x2) - 10;
    const maxX = Math.max(x1, x2) + 10;
    let startX = -translate * Math.floor(maxX / translate);
    while (startX + minX < canvasRef.current.width) {
      ctx.save();
      ctx.translate(startX, 0);
      if (type === 0) ctx.strokeLine(x1, y1, x2, y2);
      else if (type === 1) ctx.strokeRect(x1, y1, x2, y2);
      else if (type === 2) ctx.strokeOval(x1, y1, x2, y2);
      else if (type === 3) ctx.fillRect(x1, y1, x2, y2);
      else ctx.fillOval(x1, y1, x2, y2);
      ctx.restore();
      startX += translate;
    }
  };

  const drawGrid = () => {
    
    addaddExtraFunctionsToGraphics(canvasRef.current.getContext("2d"));
    addaddExtraFunctionsToGraphics(OcanvasRef.current.getContext("2d"));
    let graphics=canvasRef.current.getContext("2d")
    graphics.lineWidth = 1;
    graphics.lineCap = 'butt';
    graphics.globalAlpha = 0.5;
    for (let i = 0; i < 2; i++) {
      graphics.save();
      if (i === 1) {
        graphics.strokeStyle = 'black';
        graphics.translate(0.5, 0.5);
      } else {
        graphics.strokeStyle = 'white';
        graphics.translate(-0.5, -0.5);
      }
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      let dx;
      if (groupNum === 0 || groupNum === 2) dx = translate;
      else dx = translate / 2;
      let dy;
      if (groupNum === 0 || groupNum === 1) dy = translate;
      else dy = translate / 2;
      let x = -dx + translate * Math.floor(dx / translate);
      while (x < w) {
        graphics.beginPath();
        graphics.moveTo(x, 0);
        graphics.lineTo(x, h);
        graphics.stroke();
        x += dx;
      }
      let y = -dy + translate * Math.floor(dy / translate);
      while (y < h) {
        graphics.beginPath();
        graphics.moveTo(0, y);
        graphics.lineTo(w, y);
        graphics.stroke();
        y += dy;
      }
      graphics.restore();
    }
    graphics.globalAlpha = 1;
  };

  const installMouser   = (theCanvas) =>{
    function convertX(clientX) {
        return Math.round(clientX - theCanvas.getBoundingClientRect().left);
    }
    function convertY(clientY) {
        return Math.round(clientY - theCanvas.getBoundingClientRect().top);
    }
    function doMouseDrag(evt) {
      if (!dragItemRef.current) {
        // Check if dragItemRef.current is null
        console.log("mouse dragging dragItemRef.current is null");
        return;
      }
    
      dragItemRef.current.x2 = convertX(evt.clientX);
      dragItemRef.current.y2 = convertY(evt.clientY);
    
      if (currentTool === FREEHAND_TOOL) {
        var segment = {};
        segment.type = 0;
        segment.x1 = dragItemRef.current.x1;
        segment.x2 = dragItemRef.current.x2;
        segment.y1 = dragItemRef.current.y1;
        segment.y2 = dragItemRef.current.y2;
        segment.color = currentColor;
        segment.lineWidth = currentLineWidth;
        segment.lineCap = currentLineCap;
        dragItemRef.current.lines.push(segment);
        drawItemToOSC(segment);
    
        const { x1, x2, y1, y2 } = dragItemRef.current;
        dragItemRef.current = {
          ...dragItemRef.current,
          x1: x2,
          y1: y2,
        };
      }
      else  {
          draw();
      }
    }
    function doMouseUp(evt) {
      evt.preventDefault();
      console.log("mouse UP");
      // if (dragItemRef.current == null){
      //   return;
      // }
    
      window.removeEventListener("mousemove", doMouseDrag);
      window.removeEventListener("mouseup", doMouseUp);
    
      if (
        (currentTool === FREEHAND_TOOL && dragItemRef.current.lines.length > 0) ||
        (currentTool === 0 && (dragItemRef.current.x1 !== dragItemRef.current.x2 || dragItemRef.current.y1 !== dragItemRef.current.y2)) ||
        (currentTool > 0 && currentTool < FREEHAND_TOOL && dragItemRef.current.x1 !== dragItemRef.current.x2 && dragItemRef.current.y1 !== dragItemRef.current.y2)
      ) {
        if (itemCount < itemsRef.current.length) {
          // Remove elements from itemCount to the end of the array
          if (Array.isArray(itemsRef.current)) {
            console.log("array:ok");
            //itemsRef.current.splice(itemCount, itemsRef.current.length - itemCount);
            itemsRef.current.splice(itemCount, itemsRef.current.length - itemCount);
          }
          else {
            console.log(itemsRef.current.length,"len");
          }
        }
    
        
        
        setItemsRef((prevItems) => (Array.isArray(prevItems) ? [...prevItems, dragItemRef.current] : []));

        // Update the itemCount
        setItemCount(itemsRef.current.length);
    
        if (currentTool !== FREEHAND_TOOL) {
          drawItem(OcanvasRef.current.getContext("2d"), dragItemRef.current);
        }
        document.getElementById("undo").disabled = false;
        document.getElementById("redo").disabled = true;
        document.getElementById("clear").disabled = false;
        document.getElementById("savebtn").disabled = false;
        // clearedItems = null; // You may need to handle clearedItems with useRef as well
    
        dragItemRef.current = null;
      }
      draw(); // Not needed with useRef
    }
    function doMouseDown(evt) {
      evt.preventDefault();
      console.log("mouse down");
      if (starting) {
        drawAll();
        setStarting(false);
      }
      // dragItemRef.current is not null, but is something to get run code
      if (dragItemRef.current != null || evt.button > 0){
        console.log("mouse down, returned!!");
        return;
      }
    
      // window.getElementById("tmsg").innerHTML = "&nbsp;";
      window.addEventListener("mousemove", doMouseDrag);
      window.addEventListener("mouseup", doMouseUp);
    
      const v_dragItem = {
        type: currentTool,
        color: currentColor,
        lineWidth: currentLineWidth,
        lineCap: currentLineCap,
        x1: convertX(evt.clientX),
        x2: convertX(evt.clientX),
        y1: convertY(evt.clientY),
        y2: convertY(evt.clientY),
        // Assuming FREEHAND_TOOL is defined elsewhere in your code
        ...(currentTool === FREEHAND_TOOL ? { lines: [] } : {}),
      };
    
      dragItemRef.current = v_dragItem;
      // setDragItem(v_dragItem); // Not needed with useRef
    
    }
    theCanvas.addEventListener("mousedown", doMouseDown);
    
  }


  const drawGridWithLineSize = () => {
    var graphics = canvasRef.current.getContext("2d");
    graphics.strokeStyle = 'black';
    graphics.lineWidth = 1;
    graphics.globalAlpha = 0.3;
    let x;
    if (groupNum === 0 || groupNum === 2) x = translate;
    else x = translate / 2;
    while (x < canvasRef.current.width) {
      graphics.beginPath();
      graphics.moveTo(x, 0);
      graphics.lineTo(x, canvasRef.current.height);
      graphics.stroke();
      x += translate;
    }
    let y;
    if (groupNum === 0 || groupNum === 1) y = translate;
    else y = translate / 2;
    while (y < canvasRef.current.height) {
      graphics.beginPath();
      graphics.moveTo(0, y);
      graphics.lineTo(canvasRef.current.width, y);
      graphics.stroke();
      y += translate;
    }
    graphics.globalAlpha = 1;
    graphics.lineWidth = currentLineWidth;
    graphics.strokeStyle = currentColor;
  };


  const createNewItem = (type, x1, y1) => {
    return {
      type,
      x1,
      y1,
      x2: x1,
      y2: y1,
      color: currentColor,
      lineWidth: currentLineWidth,
      lineCap: currentLineCap,
      lines: [],
    };
  };

  const updateItem = (x, y) => {
    const newItem = { ...itemsRef.current[itemCount - 1], x2: x, y2: y };
    itemsRef.current[itemCount - 1] = newItem;
  };

  const addPointToItem = (x, y) => {
    const newItem = itemsRef.current[itemCount - 1];
    newItem.lines.push({
      type: currentTool,
      x1: newItem.x2,
      y1: newItem.y2,
      x2: x,
      y2: y,
      color: currentColor,
      lineWidth: currentLineWidth,
      lineCap: currentLineCap,
    });
    newItem.x2 = x;
    newItem.y2 = y;
  };

  const stopItem = () => {
    drawAll();
    drawItemToOSC(itemsRef.current[itemCount - 1]);
    setStarting(false);
  };

  const stopAddingPointsToItem = () => {
    drawAll();
    drawItemToOSC(itemsRef.current[itemCount - 1]);
  };

  const findItemAtPosition = (x, y) => {
    for (let i = itemCount - 1; i >= 0; i--) {
      if (itemsRef.current[i].type < 3) {
        if (
          x >= Math.min(itemsRef.current[i].x1, itemsRef.current[i].x2) - 5 &&
          x <= Math.max(itemsRef.current[i].x1, itemsRef.current[i].x2) + 5 &&
          y >= Math.min(itemsRef.current[i].y1, itemsRef.current[i].y2) - 5 &&
          y <= Math.max(itemsRef.current[i].y1, itemsRef.current[i].y2) + 5
        ) {
          return itemsRef.current[i];
        }
      } else {
        if (
          x >= Math.min(itemsRef.current[i].x1, itemsRef.current[i].x2) &&
          x <= Math.max(itemsRef.current[i].x1, itemsRef.current[i].x2) &&
          y >= Math.min(itemsRef.current[i].y1, itemsRef.current[i].y2) &&
          y <= Math.max(itemsRef.current[i].y1, itemsRef.current[i].y2)
        ) {
          return itemsRef.current[i];
        }
      }
    }
    return null;
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const undo = () => {
    if (itemsRef.current.length > 0) {
      setClearedItems(itemsRef.current.pop());
      setItemCount(itemCount - 1);
      drawAll();
    }
  };

  const redo = () => {
    if (clearedItems) {
      setItemsRef([...itemsRef.current, clearedItems]);
      setClearedItems(null);
      setItemCount(itemCount + 1);
      drawAll();
    }
  };

  const clearCanvas = () => {
    setItemsRef([]);
    setItemCount(0);
    setClearedItems(null);
    drawAll();
  };
  const changeLineWidth = () => {
    const newLineWidth = parseInt(document.getElementById('widthinput').value);
    setCurrentLineWidth(newLineWidth);
  };

  const changeColor = (newColor) => {
    setCurrentColor(newColor);
  };

  const handleLineCapChange = () => {
    const lineCapSelect = document.getElementById('linecapselect');
    setCurrentLineCap(lineCapSelect.value);
  };

  const handleToolChange = () => {
    const toolSelect = document.getElementById('toolselect');
    setCurrentTool(parseInt(toolSelect.value));
  };

  const handleGroupNumChange = () => {
    const groupNumSelect = document.getElementById('groupnumselect');
    setGroupNum(parseInt(groupNumSelect.value));
    drawAll();
  };

  const addaddExtraFunctionsToGraphics=(graphics)=> {
    graphics.strokeLine = function(x1,y1,x2,y2) {
       graphics.beginPath();
       graphics.moveTo(x1,y1);
       graphics.lineTo(x2,y2);
       graphics.stroke();
    }
   graphics.fillOval = function(x1,y1,x2,y2) {
       var x,y,horizontalRadius,verticalRadius;
       x = Math.min(x1,x2);
       y = Math.min(y1,y2);
       horizontalRadius = (Math.max(x1,x2) - x) / 2;
       verticalRadius = (Math.max(y1,y2) - y) / 2;
       x += horizontalRadius;
       y += verticalRadius;
       graphics.save();
       graphics.translate(x,y);
       graphics.scale(horizontalRadius,verticalRadius);
       graphics.beginPath();
       graphics.arc(0,0,1,0,2*Math.PI,false);
       graphics.restore();
       graphics.fill();
    }
    graphics.strokeOval = function(x1,y1,x2,y2) {
       var x,y,horizontalRadius,verticalRadius;
       x = Math.min(x1,x2);
       y = Math.min(y1,y2);
       horizontalRadius = (Math.max(x1,x2) - x) / 2;
       verticalRadius = (Math.max(y1,y2) - y) / 2;
       x += horizontalRadius;
       y += verticalRadius;
       graphics.save();
       graphics.translate(x,y);
       graphics.scale(horizontalRadius,verticalRadius);
       graphics.beginPath();
       graphics.arc(0,0,1,0,2*Math.PI,false);
       graphics.restore();
       graphics.stroke();
    }
    graphics.fillRectFromCorners = function(x1,y1,x2,y2) {
       var x,y,width,height;
       x = Math.min(x1,x2);
       y = Math.min(y1,y2);
       width = Math.max(x1,x2) - x;
       height = Math.max(y1,y2) - y;
       graphics.fillRect(x,y,width,height);
    }
    graphics.strokeRectFromCorners = function(x1,y1,x2,y2) {
       var x,y,width,height;
       x = Math.min(x1,x2);
       y = Math.min(y1,y2);
       width = Math.max(x1,x2) - x;
       height = Math.max(y1,y2) - y;
       graphics.strokeRect(x,y,width,height);
    }
  }
  return (
    <div>
      
      <div>
        <Canvas
          ref={canvasRef}
          width={800}
          height={600}
          id="c1"
          />
          <Canvas
          
          ref={OcanvasRef}
          width={800}
          height={600}
          id="c2"
          
          />
          
          </div>
          <div>
            <label htmlFor="toolselect">Tool:</label>
            <select id="toolselect" onChange={handleToolChange}>
              <option value="0">Line</option>
              <option value="1">Rectangle</option>
              <option value="2">Ellipse</option>
              <option value="3">Filled Rectangle</option>
              <option value="4">Filled Ellipse</option>
              <option value="5">Freehand</option>
            </select>
          </div>
          <div>
            <label htmlFor="widthinput">Line Width:</label>
            <input
              type="number"
              id="widthinput"
              min="1"
              max="50"
              value={currentLineWidth}
              onChange={changeLineWidth}
            />
          </div>
          <div>
            <label htmlFor="linecapselect">Line Cap:</label>
            <select id="linecapselect" onChange={handleLineCapChange}>
              <option value="butt">Butt</option>
              <option value="round">Round</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div>
            <label htmlFor="colorselect">Color:</label>
            <select
              id="colorselect"
              onChange={(e) => changeColor(e.target.value)}
              value={currentColor}
            >
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button id="savebtn">Save</button>
            <button onClick={undo} id="undo">Undo</button>
            <button onClick={redo} id="redo">Redo</button>
            <button onClick={clearCanvas}id="clear">Clear Canvas</button>
          </div>
          <div>
            <label htmlFor="groupnumselect">Group Number:</label>
            <select id="groupnumselect" onChange={handleGroupNumChange}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              id="translation"
              placeholder="Translation"
              onBlur={checkInput}
            />
            <span id="tmsg" style={{ color: 'red' }}>&nbsp;</span>
          </div>
          <div>
            <label>
              <input type="checkbox" id="showGridCB" onChange={drawAll} />
              Show Grid
            </label>
          </div>
        </div>
      );
    };
    

    export default MyDrawingApp;
    