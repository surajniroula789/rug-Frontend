
import React, { useState,useRef, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {
    return <canvas ref={ref} {...props} />;
  });
  
const intToGroup = ["p111", "pm11", "p1m1", "pmm2", "p112", "p1a1", "pma2"];
const groupToInt = { "p111": 0, "pm11": 1, "p1m1": 2, "pmm2": 3, "p112": 4, "p1a1": 5, "pma2": 6 };
const colorToName = { "#000000": "Black", "#FF0000": "Red", "#00BB00": "Green", "#0000FF": "Blue", "#00BBBB": "Cyan", "#DD00DD": "Magenta",
                      "#FFFF00": "Yellow", "#DDDDDD": "Light Gray", "#999999": "Gray", "#555555": "Dark Gray" };
const nameToColor = { "Black": "#000000", "Red": "#FF0000", "Green": "#00BB00", "Blue": "#0000FF", "Cyan": "#00BBBB", "Magenta": "#DD00DD",
                      "Yellow": "#FFFF00", "#DDDDDD": "Light Gray", "#999999": "Gray", "#555555": "Dark Gray" };
const intToTool = ["Line", "Rectangle", "Oval", "Filled Rect", "Filled Oval", "Freehand"];
const toolToInt = { "Line": 0, "Rectangle": 1, "Oval": 2, "Filled Rect": 3, "Filled Oval": 4, "Freehand": 5 };
const colors = ["#000000", "#FF0000", "#00BB00", "#0000FF", "#00BBBB", "#DD00DD",
                  "#FFFF00", "#DDDDDD", "#999999", "#555555"];

const Frieze = () => {
  const canvasRef=useRef(null);
  const OcanvasRef=useRef(null);
  const canvasFinalRef = useRef(null);
  const OcanvasFinalRef = useRef(null);

    
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


  
  const FREEHAND_TOOL=useRef(5);
  const translate = useRef(200);
  
  const groupNum = useRef(1);
  const errorRef = useRef('');


  useEffect(()=>{

    installMouser(canvasRef.current);
    addExtraFunctionsToGraphics(canvasRef.current.getContext("2d"));
    addExtraFunctionsToGraphics(OcanvasRef.current.getContext("2d"));
    addExtraFunctionsToGraphics(canvasFinalRef.current.getContext("2d"));
    addExtraFunctionsToGraphics(OcanvasFinalRef.current.getContext("2d"));
    doResize();
    window.onresize = doResize;
    
    
  },[])

  const drawAll = () => {

    OcanvasRef.current.getContext("2d").fillStyle = '#FFFFFF';
    canvasFinalRef.current.getContext("2d").fillStyle = '#FFFFFF';

    let k2  = OcanvasRef.current.getContext("2d");
    
    
    k2.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < itemCountRef.current; i++) {
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


      return;
      
      
      const finalContext = canvasFinalRef.current.getContext("2d");
      
      const sourceCanvas = OcanvasRef.current;


    
      // Draw at the top
    finalContext.drawImage(sourceCanvas, 0, 0);

    // Draw at the right (rotate top by 90 degrees clockwise)
    finalContext.save(); // Save the current transformation state
    finalContext.translate(600-sourceCanvas.height, 0); // Move the origin to the top-right corner
    finalContext.rotate(Math.PI / 2); // Rotate by 90 degrees clockwise
    finalContext.drawImage(sourceCanvas, 0, 0); // Draw the rotated image
    finalContext.restore(); // Restore the original transformation state

    // Draw at the bottom (rotate top by 180 degrees)
    finalContext.save(); // Save the current transformation state
    finalContext.translate(600-sourceCanvas.height, 600-sourceCanvas.height); // Move the origin to the bottom-right corner
    finalContext.rotate(Math.PI); // Rotate by 180 degrees
    finalContext.drawImage(sourceCanvas, 0, 0); // Draw the rotated image
    finalContext.restore(); // Restore the original transformation state

    // Draw at the left (rotate top by 90 degrees anticlockwise)
    finalContext.save(); // Save the current transformation state
    finalContext.translate(0, 600-sourceCanvas.height); // Move the origin to the bottom-left corner
    finalContext.rotate(-Math.PI / 2); // Rotate by 90 degrees anticlockwise
    finalContext.drawImage(sourceCanvas, 0, 0); // Draw the rotated image
    finalContext.restore(); // Restore the original transformation state


  };
  

  function drawBasicItem(graphics,type,x1,x2,y1,y2) {
    // describes the way to draw line rectangle or 
    
      
    var minX = Math.min(x1,x2) - 10;
    var maxX = Math.max(x1,x2) + 10;
    var startX = -translate.current * Math.floor( maxX/translate.current );
    while (startX+minX < canvasRef.current.width) {
        graphics.save();
        graphics.translate(startX,0);
        if (type == 0)
            graphics.strokeLine(x1, y1, x2, y2);
        else if (type == 1)
            graphics.strokeRectFromCorners(x1, y1, x2, y2);
        else if (type == 2)
            graphics.strokeOval(x1, y1, x2, y2);
        else if (type == 3)
            graphics.fillRectFromCorners(x1, y1, x2, y2);
        else 
            graphics.fillOval(x1, y1, x2, y2);
        graphics.restore();
        startX += translate.current;
    }

    
    var startX = -translate.current * Math.floor( maxX/translate.current );
    const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
    const graphics2 = OcanvasFinalRef.current.getContext("2d");
    
    const theCanvas = OcanvasFinalRef.current;  
    function convertX(clientX) { 
        return Math.round(clientX - theCanvas.getBoundingClientRect().left);
      }

      function convertY(clientY) {
          return Math.round(clientY - theCanvas.getBoundingClientRect().top);
      }
    
      const x1_ = convertX(x1)
    const x2_ = convertX(x2)

    const y1_ = convertY(y1)
    const y2_ = convertY(y2)
    
    while (startX+minX < 600) {
      graphics2.save(); // Save the current transformation state
      graphics2.translate(startX, 0);
      for (let i = 0; i < 1; i++) {      
        graphics2.save();
        
    
        // Rotate based on the current iteration
        graphics2.rotate(rotations[1]);
        
        if (type == 0)
            graphics2.strokeLine(x1_, y1_, x2_, y2_);
        else if (type == 1)
            graphics2.strokeRectFromCorners(x1_, y1_, x2_, y2_);
        else if (type == 2)
            graphics2.strokeOval(x1_, y1_, x2_, y2_);
        else if (type == 3)
            graphics2.fillRectFromCorners(x1_, y1_, x2_, y2_);
        else 
            graphics2.fillOval(x1_, y1_, x2_, y2_);
    
        graphics2.restore();
      }
      graphics2.restore()
      startX += translate.current;
    }




}



    const drawItemToOSC = (item) => {
        drawItem(OcanvasRef.current.getContext("2d"), item);
        //drawItem4Sides(canvasFinalRef.current.getContext("2d"), item);
        
        canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
        canvasFinalRef.current.getContext("2d").drawImage(OcanvasFinalRef.current, 0, 0);
        
        if (document.getElementById('showGridCB').checked) {
            drawGrid();
        }
    };

function addExtraFunctionsToGraphics(graphics) {
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



function drawItem(graphics,item) {
  // decribes which particular item to draw
  if (item.type == FREEHAND_TOOL.current) {
      // if free hand tool; then recursive call is there
      // 
      for (var i = 0; i < item.lines.length; i++) {
          drawItem(graphics,item.lines[i]);
      }
      return;

  }

  const final_graphics  = OcanvasFinalRef.current.getContext("2d");
  if (item.type > 2) {
      graphics.fillStyle = item.color;
      //
      final_graphics.fillStyle = item.color;
  }
  else {
      graphics.strokeStyle = item.color;
      graphics.lineWidth = item.lineWidth;
      graphics.lineCap = item.lineCap;

      //
      final_graphics.strokeStyle = item.color;
      final_graphics.lineWidth = item.lineWidth;
      final_graphics.lineCap = item.lineCap;
  }
  drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);
  if (groupNum.current == 1 || groupNum.current == 3 || groupNum.current == 6) {
     drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2);
  }
  if (groupNum.current == 2 || groupNum.current == 3) {
      drawBasicItem(graphics,item.type,item.x1,item.x2,128-item.y1,128-item.y2);
  }
  if (groupNum.current == 3 || groupNum.current == 4) {
      drawBasicItem(graphics,item.type,-item.x1,-item.x2,128-item.y1,128-item.y2);
  }
  if (groupNum.current == 5 || groupNum.current == 6) {
      drawBasicItem(graphics,item.type,item.x1+translate.current/2,item.x2+translate.current/2,128-item.y1,128-item.y2);
  }
  if (groupNum.current == 6) {
      drawBasicItem(graphics,item.type,-item.x1+translate.current/2,-item.x2+translate.current/2,128-item.y1,128-item.y2);
  }
}

function doResize() {
  var rect = document.getElementById("frieze").getBoundingClientRect();
  canvasRef.current.width = rect.width;
  canvasRef.current.height = 128;
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

    function doMouseDrag(evt){
        console.log("drag");
        if (dragItemRef.current == null)
        {
          console.log("null dragitme")
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
        }
        else {
            draw();
        }
        evt.preventDefault();
    }

    function doMouseUp(evt){
        console.log("up");
        if (dragItemRef.current == null){
          console.log("up and null");
          return;
        }

        theCanvas.removeEventListener("mousemove", doMouseDrag);
        theCanvas.removeEventListener("mouseup", doMouseUp);
        const {x1,y1,x2,y2}=dragItemRef.current;
        console.log(x1,x2,"\t",y1,y2);
        if ((currentToolRef.current === FREEHAND_TOOL.current && dragItemRef.current.lines.length > 0) ||
            (currentToolRef.current === 0 && (dragItemRef.current.x1 !== dragItemRef.current.x2 || dragItemRef.current.y1 !== dragItemRef.current.y2)) ||
            (currentToolRef.current > 0 && currentToolRef.current < FREEHAND_TOOL.current && dragItemRef.current.x1 !== dragItemRef.current.x2 && dragItemRef.current.y1 !== dragItemRef.current.y2)) {

            if (itemCountRef.current < itemsRef.current.length)
                itemsRef.current.splice(itemCountRef.current, itemsRef.current.length - itemCountRef.current);

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
        }
        else{
            console.log("else part")
        }

        dragItemRef.current = null;
        evt.preventDefault();
    }

    function doMouseDown(evt){
        console.log("UP");
        if (startingRef.current) {
            drawAll();
            startingRef.current = false;
        }

        if (dragItemRef.current != null || evt.button > 0){
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
  if (evt.keyCode == 13)
     doApply();
}

function checkInputs() {
  let newT = Number(document.getElementById("translation").value);
  console.log("new",newT);
  if ( isNaN(newT) || newT < 20 || newT > 1000 ) {
      document.getElementById("tmsg").innerHTML="Translation must be a number, 10 to 1000! Change not applied";
      console.log("asda issue trans");
      return false;
  }
  document.getElementById("tmsg").innerHTML = "&nbsp;";
  translate.current = newT;
  console.log(translate.current,"updated")
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
  if (itemsRef.current.length === 0)
    return;
  if (itemCountRef.current > 0) {
    if (itemsRef.current.length > itemCountRef.current)
      itemsRef.current.splice(itemCountRef.current, itemsRef.current.length - itemCountRef.current);
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


const drawGrid=()=> {
    let graphics  = canvasRef.current.getContext("2d");
  
    graphics.lineWidth = 1;
    graphics.lineCap = "butt";
    graphics.globalAlpha = 0.5;
    for (var i = 0; i < 2; i++) {
        graphics.save();
        if (i == 1) {
            graphics.strokeStyle = "black";
            graphics.translate(0.5,0.5);
        }
        else {
            graphics.strokeStyle = "white";
            graphics.translate(-0.5,-0.5);
        }
        var w = canvasRef.current.width;
        var h = canvasRef.current.height;
        var dx;
        if (groupNum.current == 0 || groupNum.current == 2)
            dx = translate;
        else
            dx = translate/2;
        var x = dx;
        while (x < w) {
            graphics.strokeLine(x,0,x,h);
            x += dx;
        }
        if (groupNum.current > 1) {
            graphics.strokeLine(0,h/2,w,h/2);
        }
        graphics.restore();
    }
    graphics.globalAlpha = 1.0;  
}


  const selectGroup = (num) => {
    console.log(num,"Asdsad",groupNum.current)
    num = Number(num);
    if (num === groupNum.current) {
      return;
    }
    groupNum.current = num;
  }
// Convert the vanilla functions to React functions
  const selectLineWidth = (lineWidth) => {
    currentLineWidthRef.current = Number(lineWidth);
    if (currentToolRef.current === FREEHAND_TOOL.current || currentLineWidthRef.current >= 3) {
      currentLineCapRef.current = "round";
    } else {
      currentLineCapRef.current = "butt";
    }
    // You can add any additional logic here
  };

  const selectTool = (tool) => {
    currentToolRef.current = tool;
    if (currentToolRef.current === FREEHAND_TOOL.current || currentLineWidthRef.current >= 3) {
      currentLineCapRef.current = "round";
    } else {
      currentLineCapRef.current = "butt";
    }
    // You can add any additional logic here
  };

  const selectColor = (num) => {
    
    if (currentColorRef.current == num){
      return;
    }
    else{

      currentColorRef.current= num;
    } 
    console.log("new color",currentColorRef.current)
    // You can add any additional logic here
  };


  



return (

    <div id="content">
  <h2>Frieze Symmetry</h2>
  
  <div id="frieze">

    <Canvas ref={canvasRef} height={128} id="c1"/>
  </div>
  
  <div>

    <Canvas ref={canvasFinalRef} width= {600} height={600} id="c3"/>
  </div>
  <Canvas ref={OcanvasRef} height={128} id="c2" hidden />
  <Canvas ref={OcanvasFinalRef} height={600} width={600} id="c4" />
  
  
   <p align="center" id="bb">
        <button id="undo" onClick={undo} title="Remove the most recently drawn item. Can also undo Clear if used immediately after clearing.">
          Undo
        </button>
        <button id="redo" onClick={redo} title="Restore the draw item that was removed most recently by Undo.">
          Redo
        </button>
        <button id="clear" onClick={clearDrawing} title="Clear the current image. This can be undone if you click 'Undo' immediately after clearing.">
          Clear
        </button>
        <label style={{ color: 'white', fontWeight: 'bold' }}>
          <input type="checkbox" onChange={draw} id="showGridCB" style={{ marginLeft: '30px' }} />
          Show Grid
        </label>
        <button id="savebtn" style={{ marginLeft: '30px' }} title="Save to local file. This will not save the image; it saves a specification of the image that can be reloaded into this web app." disabled>
          Save
        </button>
        <button id="loadbtn" title="Load image specification from a local file. File load cannot be undone.">
          Load
        </button>
      </p>

      <table align="center" border="1" bgcolor="#D8D8D8" cellPadding="10" cellSpacing="0">
        <tbody>

        
        <tr>
            <td colSpan={2}><span id="error">&nbsp;</span></td>
        </tr>
        <tr>
          <td colSpan="4" align="center">
            <label title="Horizontal translation in pixels, in the range 20 to 1000. You must click Apply or press Enter for a change to take effect.">
              Translation Amount:
              <input type="text" onKeyDown = {checkForReturnKey} size="4" maxLength="4" id="translation" />
            </label>
            <button onClick={doApply} title="Check input and if legal, apply to the current image. You can also do this by pressing Enter in an input box.">
              Apply
            </button>
            <br />
            <span id="tmsg" style={{ color: 'red' }}>&nbsp;</span>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <b>Symmetry&nbsp;Group:</b>
            <br />
            {intToGroup.map((group, index) => (
              <label key={index}>
                <input type="radio" name="group" value={index} id={`g${index}`} onClick={() => selectGroup(index)} />
                {group}
              </label>
            ))}
          </td>
          <td valign="top">
            <b>Tool:</b>
            <br />
            {intToTool.map((tool, index) => (
              <label key={index}>
                <input type="radio" name="tool" value={index} id={`t${index}`} onClick={() => selectTool(index)} />
                {tool}
              </label>
            ))}
          </td>
          <td valign="top">
            <b>Line&nbsp;Width:</b>
            <br />
            {[1, 2, 3, 4, 5, 10, 20].map((width, index) => (
              <label key={index}>
                <input type="radio" name="linewidth" value={width} id={`lw${width}`} onClick={() => selectLineWidth(width)} />
                {width}
              </label>
            ))}
          </td>
          <td valign="top">
            <b>Color:</b>
            <br />
            {Object.entries(colorToName).map(([color, name], index) => (
              <label key={index}>
                <input type="radio" name="color" value={color} id={`c${index}`} onClick={() => selectColor(color)} />
                {name}
              </label>
            ))}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
)
};

export default Frieze;