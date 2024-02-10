import React, { Component, useRef, useEffect, useState } from 'react';

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} />;
});

class CarpetItem extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = useRef(null);
    this.OcanvasRef = useRef(null);
    this.itemsRef = useRef([]);
    this.itemCountRef = useRef(0);
    this.dragItemRef = useRef(null);

    // Other state variables and refs...
    this.currentColorRef = useRef("#000000");
    this.currentToolRef = useRef(5);
    this.currentLineWidthRef = useRef(3);
    this.currentLineCapRef = useRef("round");
    this.clearedItemsRef = useRef(null);
    this.startingRef = useRef(true);
    this.FREEHAND_TOOL =useRef(5);
    this.groupNum = useRef(1);
    this.errorRef = useRef('');
    
    
    this.heading  ="";


  }

  componentDidMount() {
    this.installMouser(this.canvasRef.current);
    this.addExtraFunctionsToGraphics(this.canvasRef.current.getContext("2d"));
    this.addExtraFunctionsToGraphics(this.OcanvasRef.current.getContext("2d"));
    // Other initialization logic...
  }

  // Other class methods...
  addExtraFunctionsToGraphics(graphics) {
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

  drawAll = () => {

    OcanvasRef.current.getContext("2d").fillStyle = '#FFFFFF';
    let k2  = OcanvasRef.current.getContext("2d");
    
    
    k2.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < itemCountRef.current; i++) {
      drawItem(k2, itemsRef.current[i]);
    }
    draw();
  };

  draw = () => {
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (dragItemRef.current) {
      drawItem(canvasRef.current.getContext("2d"), dragItemRef.current);
    }
    if (document.getElementById('showGridCB').checked) {
      drawGrid();
    }
  };

  drawItemToOSC = (item) => {
    drawItem(OcanvasRef.current.getContext("2d"), item);
    canvasRef.current.getContext("2d").drawImage(OcanvasRef.current, 0, 0);
    if (document.getElementById('showGridCB').checked) {
      drawGrid();
    }
  };

  doApply() {
    if (checkInputs()) {
        drawAll();
    }
  }
  checkForReturnKey(evt) {
    if (evt.keyCode == 13)
       doApply();
  }

  
 // Undo function
 undo = () => {
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
redo = () => {
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
clearDrawing = () => {
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



selectColor = (color) => {
  currentColorRef.current = colors[color];
};

selectLineWidth = (lineWidth) => {
  currentLineWidthRef.current = Number(lineWidth);
  if (currentToolRef.current === FREEHAND_TOOL || currentLineWidthRef.current >= 3) {
    currentLineCapRef.current = "round";
  } else {
    currentLineCapRef.current = "butt";
  }
};

selectTool = (tool) => {
  currentToolRef.current = Number(tool);
  if (currentToolRef.current === FREEHAND_TOOL || currentLineWidthRef.current >= 3) {
    currentLineCapRef.current = "round";
  } else {
    currentLineCapRef.current = "butt";
  }
};


selectGroup = (num) => {
  num = Number(num);
  if (num === groupNum.current) {
    return;
  }
  groupNum.current = num;
  if (num === 1 || num === 5) {
  //   offsetHolderRef.current.style.display = "inline";
  //   offsetHolderRef.current.value = "" + rowOffsetRef.current;
  // } else {
  //   offsetHolderRef.current.style.display = "none";
  }
  // if (num < 10) {
  //   trans2HolderRef.current.style.display = "inline";
  //   translation2.current.value = "" + translation2.current;
  // } else {
  //   trans2HolderRef.current.style.display = "none";
  // }
  // // Call your drawAll function here
  drawAll();
};


installMouser(theCanvas) {
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

      if ((currentToolRef.current === FREEHAND_TOOL && dragItemRef.current.lines.length > 0) ||
          (currentToolRef.current === 0 && (dragItemRef.current.x1 !== dragItemRef.current.x2 || dragItemRef.current.y1 !== dragItemRef.current.y2)) ||
          (currentToolRef.current > 0 && currentToolRef.current < FREEHAND_TOOL && dragItemRef.current.x1 !== dragItemRef.current.x2 && dragItemRef.current.y1 !== dragItemRef.current.y2)) {

          if (itemCountRef.current < itemsRef.current.length)
              itemsRef.current.splice(itemCountRef.current, itemsRef.current.length - itemCountRef.current);

          itemsRef.current.push(dragItemRef.current);
          itemCountRef.current = itemsRef.current.length;
          document.getElementById("undo").disabled = false;
          document.getElementById("redo").disabled = true;
          document.getElementById("clear").disabled = false;
          document.getElementById("savebtn").disabled = false;
          clearedItemsRef.current = null;

          if (currentToolRef.current !== FREEHAND_TOOL) {
              drawItemToOSC(dragItemRef.current);
          }
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

      if (currentToolRef.current === FREEHAND_TOOL) {
          dragItemRef.current.lines = [];
      }

      evt.preventDefault();
  }

  theCanvas.addEventListener("mousedown", doMouseDown);
}





  render() {
    return (
      <div id="content">
        <h2>{ heading }</h2>
        
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
        hidden
        />
        
        
      </div>
    );
  }
}

const colorToName = {
  "#000000": "Black", "#FF0000": "Red", "#00BB00": "Green", "#0000FF": "Blue", "#00BBBB": "Cyan",
  "#DD00DD": "Magenta", "#FFFF00": "Yellow", "#DDDDDD": "Light Gray", "#999999": "Gray", "#555555": "Dark Gray"
};

const nameToColor = {
  "Black": "#000000", "Red": "#FF0000", "Green": "#00BB00", "Blue": "#0000FF", "Cyan": "#00BBBB",
  "Magenta": "#DD00DD", "Yellow": "#FFFF00", "Light Gray": "#DDDDDD", "Gray": "#999999", "Dark Gray": "#555555"
};

const intToTool = ["Line", "Rectangle", "Oval", "Filled Rect", "Filled Oval", "Freehand"];

const toolToInt = {
  "Line": 0, "Rectangle": 1, "Oval": 2, "Filled Rect": 3, "Filled Oval": 4, "Freehand": 5
};

export default CarpetItem;
