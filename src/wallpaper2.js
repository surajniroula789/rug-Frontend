
import React, {Component, useState,useRef, useEffect } from 'react';
import CarpetItem from './common';

  

const Wallpaper extends CarpetItem{

  constructor(props) {
    super(props);
    
    //derived
    this.translation1 = useRef(150);
    this.translation2 = useRef(150);
    this.rowOffsetRef = useRef(0);
    this.groupNum = useRef(11);
    this.errorRef = useRef('');

    this.heading  ="Wallpaper Symmetry";
  }


  const checkInputs = () => {
    let newT1, newT2, newRO;
    newT1 = Number(translation1.current.value.trim());
    if (isNaN(newT1) || newT1 < 30 || newT1 > 400) {
      errorRef.current = "Translation must be a number, 30 to 400. Change not applied!";
      return false;
    }
    if (groupNum.current === 1 || groupNum.current === 5) {
      newRO = Number(rowOffsetRef.current.value.trim());
      if (isNaN(newRO)) {
        errorRef.current = "Row Offset must be a number. Change not applied!";
        return false;
      }
      newRO = newRO % newT1;
      if (newRO < 0) newRO += newT1;
      if (newRO > newT1 / 2) newRO -= newT1;
    }
    if (groupNum.current < 10) {
      newT2 = Number(translation2.current.value.trim());
      if (isNaN(newT2) || newT2 < 30 || newT2 > 400) {
        errorRef.current = "2nd Translation must be a number, 30 to 400. Change not applied!";
        return false;
      }
    }
    translation1.current = newT1;
    translation2.current = newT2;
    rowOffsetRef.current = newRO;
    errorRef.current = '';
    return true;
  };

      


  drawItem(graphics,item) {  
      if (item.type == FREEHAND_TOOL) {
          for (var i = 0; i < item.lines.length; i++) {
              drawItem(graphics,item.lines[i]);
          }
          return;
      }
      if (item.type > 2) {
          graphics.fillStyle = item.color;
      }
      else {
          graphics.strokeStyle = item.color;
          graphics.lineWidth = item.lineWidth;
          graphics.lineCap = item.lineCap;
      }
      var transY;
      var hOffset;
      if (groupNum.current == 1 || groupNum.current == 5) {
          transY = translation2.current;
          hOffset = rowOffsetRef.current/transY; // horizontal offset per vertical pixel
      }
      else if (groupNum.current < 10) {
          transY = translation2.current;
          hOffset = 0;
      }
      else {
          transY = translation1.current;
          hOffset = 0;
      }
      var a,b,i;
      switch (groupNum.current) {
          case 1:
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              break;
          case 2: // pg
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,item.x1+translation1.current/2,item.x2+translation1.current/2,-item.y1,-item.y2);  // horizontal glide reflection
              break;
          case 3: // pm
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2);  // horizontal reflextion
              break;
          case 4: //cm
              a = translation1.current/2;
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1+transY/2,item.y2+transY/2); // vertical glide reflection
              drawBasicItem(graphics,item.type,a+item.x1,a+item.x2,item.y1+transY/2,item.y2+transY/2);
              drawBasicItem(graphics,item.type,a-item.x1,a-item.x2,item.y1,item.y2); 
              break;
          case 5: //p2
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              break;
          case 6: // pgg
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,item.x1+translation1.current/2,item.x2+translation1.current/2,-item.y1,-item.y2);  // horizontal glide reflection
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1+transY/2,item.y2+transY/2); // vertical glide reflection
              drawBasicItem(graphics,item.type,-item.x1+translation1.current/2,-item.x2+translation1.current/2,-(item.y1+transY/2),-(item.y2+transY/2)); // double glide reflection
              break;
          case 7: // pmm
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2);  // horizontal reflextion
              drawBasicItem(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2);  // vertical reflection
              break;
          case 8: // cmm
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2);
              drawBasicItem(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2);
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2);
              a = translation1.current/2;
              b = transY/2;
              drawBasicItem(graphics,item.type,item.x1+a,item.x2+a,item.y1+b,item.y2+b);
              drawBasicItem(graphics,item.type,-item.x1+a,-item.x2+a,item.y1+b,item.y2+b);
              drawBasicItem(graphics,item.type,item.x1+a,item.x2+a,-item.y1+b,-item.y2+b);
              drawBasicItem(graphics,item.type,-item.x1+a,-item.x2+a,-item.y1+b,-item.y2+b);
              break;
          case 9: // pmg
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,item.x1+translation1.current/2,item.x2+translation1.current/2,-item.y1,-item.y2);  // horizontal glide reflection
              drawBasicItem(graphics,item.type,-(item.x1+translation1.current/2),-(item.x2+translation1.current/2),item.y1,item.y2);  // horizontal glide reflection
              break;
          case 10: // p4
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,item.y1,item.y2,-item.x1,-item.x2); // -90 rot.
              drawBasicItem(graphics,item.type,-item.y1,-item.y2,item.x1,item.x2); // 90 rot.
              break;
          case 11: // p4m
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,item.y1,item.y2,-item.x1,-item.x2); // -90 rot.
              drawBasicItem(graphics,item.type,-item.y1,-item.y2,item.x1,item.x2); // 90 rot.
              
              drawBasicItem(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,-item.y1,-item.y2,-item.x1,-item.x2); // -90 rot.
              drawBasicItem(graphics,item.type,item.y1,item.y2,item.x1,item.x2); // 90 rot.
              
              break;
          case 12: // p4g
              drawBasicItem(graphics,item.type,item.x1,item.x2,item.y1,item.y2);  // Untransformed item
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,-item.y1,-item.y2); // 180 rotation
              drawBasicItem(graphics,item.type,item.y1,item.y2,-item.x1,-item.x2); // -90 rot.
              drawBasicItem(graphics,item.type,-item.y1,-item.y2,item.x1,item.x2); // 90 rot.
              
              drawBasicItem(graphics,item.type,translation1.current/2-item.x1,translation1.current/2-item.x2,translation1.current/2-item.y1,translation1.current/2-item.y2);  
              drawBasicItem(graphics,item.type,translation1.current/2+item.x1,translation1.current/2+item.x2,translation1.current/2+item.y1,translation1.current/2+item.y2); 
              drawBasicItem(graphics,item.type,translation1.current/2-item.y1,translation1.current/2-item.y2,translation1.current/2+item.x1,translation1.current/2+item.x2); 
              drawBasicItem(graphics,item.type,translation1.current/2+item.y1,translation1.current/2+item.y2,translation1.current/2-item.x1,translation1.current/2-item.x2); 
              
              drawBasicItem(graphics,item.type,translation1.current/2-item.x1,translation1.current/2-item.x2,item.y1,item.y2);  
              drawBasicItem(graphics,item.type,translation1.current/2+item.x1,translation1.current/2+item.x2,-item.y1,-item.y2); 
              drawBasicItem(graphics,item.type,translation1.current/2-item.y1,translation1.current/2-item.y2,-item.x1,-item.x2); 
              drawBasicItem(graphics,item.type,translation1.current/2+item.y1,translation1.current/2+item.y2,item.x1,item.x2); 
              
              drawBasicItem(graphics,item.type,item.x1,item.x2,translation1.current/2-item.y1,translation1.current/2-item.y2);  
              drawBasicItem(graphics,item.type,-item.x1,-item.x2,translation1.current/2+item.y1,translation1.current/2+item.y2); 
              drawBasicItem(graphics,item.type,item.y1,item.y2,translation1.current/2+item.x1,translation1.current/2+item.x2); 
              drawBasicItem(graphics,item.type,-item.y1,-item.y2,translation1.current/2-item.x1,translation1.current/2-item.x2); 
              
              break;
          case 13: // p3
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,0);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,-2*Math.PI/3);
              break;
          case 14: // p3m1
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,0);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,-2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2,0);
              drawBasicItemHex(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2,2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2,-2*Math.PI/3);
              break;
          case 15: // p31m
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,0);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,-2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2,0);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2,2*Math.PI/3);
              drawBasicItemHex(graphics,item.type,item.x1,item.x2,-item.y1,-item.y2,-2*Math.PI/3);
              break;
          case 16: // p6
              for (i = 0; i < 6; i++) {
                  drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,i*Math.PI/3);
              }
              break;
          case 17: // p6m
              for (i = 0; i < 6; i++) {
                  drawBasicItemHex(graphics,item.type,item.x1,item.x2,item.y1,item.y2,i*Math.PI/3);
                  drawBasicItemHex(graphics,item.type,-item.x1,-item.x2,item.y1,item.y2,i*Math.PI/3);
              }
              break;
      }
      function drawBasicItem(graphics,type,x1,x2,y1,y2) {
          var minX = Math.min(x1,x2) - 10;
          var maxX = Math.max(x1,x2) + 10;
          var minY = Math.min(y1,y2) - 10;
          var maxY = Math.max(y1,y2) + 10;
          var startY = -transY * Math.floor(maxY/transY);
          var startX = -translation1.current * Math.floor( maxX/translation1.current );
          var ty = startY;
          while (ty+minY < canvasRef.current.height) {
              graphics.save();
              graphics.translate(0,ty);
              var tx = startX;
              if (hOffset != 0) {
                  tx += hOffset * ty;
                  while (tx+maxX < 0)
                      tx += translation1.current;
                  while (tx+maxX > translation1.current)
                      tx -= translation1.current;
              }
              while (tx+minX < canvasRef.current.width) {
                  graphics.save();
                  graphics.translate(tx,0);
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
                  tx += translation1.current;
              }
              graphics.restore();
              ty += transY;
          }
      }
      function drawBasicItemHex(graphics,type,x1,x2,y1,y2,theta) {
          var s = Math.sin(theta);
          var c = Math.cos(theta);
          var xc = (x1+x2)/2;
          var yc = (y1+y2)/2;
          var radius = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ) / 2;
          
          var temp = c*xc-s*yc; // do rotation of center
          yc = s*xc+c*yc;
          xc = temp;

          var minX = xc - radius - 10;
          var maxX = xc + radius + 10;
          var minY = yc - radius - 10;
          var maxY = yc + radius + 10;
          var trans = translation1.current;
          var transH = trans * 2/ Math.sqrt(3);
          var startY = -trans * Math.floor(maxY/trans);
          var startX = -transH * Math.floor(maxX/transH);
          var ty = startY;
          var hOffset = -Math.sqrt(3);
          while (ty+minY < canvasRef.current.height) {
              graphics.save();
              graphics.translate(0,ty);
              var tx = startX;
              tx -= hOffset * ty;
              while (tx+maxX < 0)
                  tx += transH;
              while (tx+maxX > transH)
                  tx -= transH;
              while (tx+minX < canvasRef.current.width) {
                  graphics.save();
                  graphics.translate(tx,0);
                  graphics.rotate(theta);
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
                  tx += transH;
              }
              graphics.restore();
              ty += trans;
          }
      }
  }
    
  drawGrid(graphics) { 
    graphics.save();
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
        var y,dy;
        var w = canvasRef.current.width;
        var h = canvasRef.current.height;
        if (groupNum.current < 10) {
            dy = translation2.current;
        }
        else {
            dy = translation1.current;
        }
        y = dy;
        while (y < h) {
            graphics.strokeLine(0,y,w,y);
            y += dy;
        }
        var x,dx;
        if (groupNum.current < 13 && (rowOffsetRef.current == 0 || groupNum.current != 1 && groupNum.current != 5)) {
            x = dx = translation1.current;
            while (x < w) {
                graphics.strokeLine(x,0,x,h);
                x += dx;
            }
        }
        else if (groupNum.current < 13) { // and rowOffsetRef.current is not 0 and groupNum.current is 1 or 5
            var rows = h / translation2.current;
            var offset;
            if (rowOffsetRef.current <= translation1.current/2)
                offset = rows*rowOffsetRef.current;
            else
                offset = rows*(rowOffsetRef.current - translation1.current);
            dx = translation1.current;
            if (offset > 0) {
                x = 0;
                while (x + offset > dx)
                    x -= dx;
                while (x < w) {
                    graphics.strokeLine(x,0,x+offset,h);
                    x += dx;
                }
            }
            else {
                x = dx;
                while (x + offset < w) {
                    graphics.strokeLine(x,0,x+offset,h);
                    x += dx;
                }
            }
        }
        else {
            var offset = h/Math.sqrt(3);
            dx = translation1.current*2/Math.sqrt(3);
            x = 0;
            while (x + offset > dx)
                x -= dx;
            while (x < w) {
                graphics.strokeLine(x,0,x+offset,h);
                x += dx;
            }
            offset = -offset;
            x = dx;
            while (x + offset < w) {
                graphics.strokeLine(x,0,x+offset,h);
                x += dx;
            }
        }
        graphics.restore();
    }
    graphics.restore();
  }


//chage this to set curentREf item

  return (
    <div id="content">
      
      
    
    </div>
  );
};

export default  DrawingCanvas;
