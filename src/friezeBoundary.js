
import React, { useState,useRef, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {
    return <canvas ref={ref} {...props} />;
  });
  

const ConcentricRectangle = () => {
    const canvasRef=useRef(null);
    const OcanvasRef=useRef(null);

    const itemsRef = useRef([]);
    const itemCountRef = useRef(0);
    const dragItemRef = useRef(null);

    const errorRef = useRef('');
    const clearedItemsRef = useRef(null);





    useEffect(()=>{
      

        installMouser(canvasREf.current)
    },[])
    
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
    

    

    return (

        <div id="main_content">
            
        <Canvas
            ref={canvasRef}
            width={1000}
            height={500}
            id="main"

        />
        </div>
    )
};
 



export default MainWindow;