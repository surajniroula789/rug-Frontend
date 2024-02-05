
import React, { useState,useRef, useEffect } from 'react';

const Canvas = React.forwardRef((props, ref) => {
    return <canvas ref={ref} {...props} />;
  });
  

const MainWindow = () => {
    const canvasRef=useRef(null);
    const OcanvasRef=useRef(null);

    const itemsRef = useRef([]);
    const itemCountRef = useRef(0);
    const dragItemRef = useRef(null);

    const errorRef = useRef('');
    const clearedItemsRef = useRef(null);





    useEffect(()=>{
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas background color to black
      
      // Set canvas border style
      canvas.style.border = '1px solid black';


    },[])

    

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