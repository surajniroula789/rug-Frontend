import React, { useEffect, useRef, useState } from "react";

const backendUrl = "http://localhost:8000/send_me";

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} {...props} style={{ border: "2px solid black" }} />;
});

const CanvasPage = () => {
  const [rosetteImg, setRosetteImg] = useState("");
  const [wallpaperImg, setWallpaperImg] = useState("");

  useEffect(() => {
    const storedWallpaperImage = localStorage.getItem("wallpaperImage");
    const storedRosetteImage = localStorage.getItem("rosetteImage");

    setRosetteImg(storedRosetteImage);
    setWallpaperImg(storedWallpaperImage);
  }, []);

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
      <button onClick={sendData}>Send</button>
    </>
  );
};

export default CanvasPage;
