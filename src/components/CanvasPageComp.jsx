import React, { useEffect, useRef, useState } from "react";

const backendUrl = "http://localhost:8000/send_me";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const SendToBackend = () => {
  const sendData = async () => {
    const data = [
      {
        type: "rosette",
        image_data: rosetteImg,
      },
      {
        type: "wallpaper",
        image_data: wallpaperImg,
      },
    ];
    await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <button
        className=" mt-6 ml-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={sendData}
      >
        Send
      </button>
    </>
  );
};

export default SendToBackend;
