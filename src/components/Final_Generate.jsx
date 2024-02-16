import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../App.css";
import JSZip from "jszip";

const backendUrl = "http://localhost:8000/send_here/";

const MergeImages = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [combinedScaleFactor, setCombinedScaleFactor] = useState(1);
  const [sentImages, setSentImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imagesGenerated, setImagesGenerated] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //  image from FinalCanvas
    const finalCanvasData = localStorage.getItem("combinedImage");
    const finalCanvasImage = new Image();
    finalCanvasImage.onload = () => {
      context.drawImage(
        finalCanvasImage,
        dragOffsetX,
        dragOffsetY,
        finalCanvasImage.width * combinedScaleFactor,
        finalCanvasImage.height * combinedScaleFactor
      );
    };
    finalCanvasImage.src = finalCanvasData;

    //  image from FirezeImage
    const firezeCanvasData = localStorage.getItem("FirezeImage");
    const firezeCanvasImage = new Image();
    firezeCanvasImage.onload = () => {
      context.drawImage(firezeCanvasImage, 0, 0);
    };
    firezeCanvasImage.src = firezeCanvasData;
  }, [dragOffsetX, dragOffsetY, combinedScaleFactor]);

  const handleMouseDown = (event) => {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const offsetX = event.clientX - dragStartX;
      const offsetY = event.clientY - dragStartY;
      setDragOffsetX(offsetX);
      setDragOffsetY(offsetY);
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    //  image data from FinalCanvas
    const finalCanvasData = localStorage.getItem("combinedImage");
    const finalCanvasImage = new Image();
    finalCanvasImage.onload = () => {
      context.drawImage(
        finalCanvasImage,
        dragOffsetX,
        dragOffsetY,
        finalCanvasImage.width * combinedScaleFactor,
        finalCanvasImage.height * combinedScaleFactor
      );
    };
    finalCanvasImage.src = finalCanvasData;

    //  image data from FirezeImage
    const firezeCanvasData = localStorage.getItem("FirezeImage");
    const firezeCanvasImage = new Image();
    firezeCanvasImage.onload = () => {
      context.drawImage(firezeCanvasImage, 0, 0);
    };
    firezeCanvasImage.src = firezeCanvasData;
  };

  const handleResizeCombined = (event) => {
    const scaleFactor = parseFloat(event.target.value) / 100;
    setCombinedScaleFactor(scaleFactor);
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleSend = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const blob = dataURItoBlob(dataURL);
    let formData = new FormData();
    formData.append("image", blob, "combinedImage.png");

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Image sent successfully \n", responseData.urls);
        setSentImages(responseData.urls);
        setImagesGenerated(true);
      } else {
        console.error("Error sending image");
      }
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData);
    }
  };

  const uploadImage = async (formData) => {
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Image uploaded successfully \n", responseData.urls);
        setSentImages(responseData.urls);
        setImagesGenerated(true);
      } else {
        console.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleDownloadZip = () => {
    setDownloadingZip(true);

    const zip = new JSZip();
    const promises = sentImages.map((imageUrl, index) => {
      return fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`image_${index + 1}.png`, blob);
        })
        .catch((error) => console.error("Error fetching image:", error));
    });

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "images.zip";
        a.click();
        setDownloadingZip(false);
      });
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-full mt-7 ">
          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              ></path>
              <path
                fillRule="evenodd"
                d="M10 3a7 7 0 00-7 7c0 3.038 2.462 5.5 5.5 5.5h2A5.5 5.5 0 0015 10a5.5 5.5 0 00-5.5-5.5zm0-2a9 9 0 100 18 9 9 0 000-18zM9 9h2v2H9V9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="mt-2 text-sm font-semibold">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="flex justify-center mt-4">
          <input
            type="range"
            min="10"
            max="200"
            defaultValue="100"
            onChange={handleResizeCombined}
            className="w-64 mb-0 bg-gray-200 h-3 rounded-full overflow-hidden cursor-pointer"
          />
        </div>
        <div className="flex justify-center mt-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="border-2 border-black"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSend}
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send Image
          </button>
          {imagesGenerated && (
            <button
              onClick={handleDownloadZip}
              className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={downloadingZip}
            >
              {downloadingZip ? "Downloading..." : "Download Zip"}
            </button>
          )}
        </div>
        {imagesGenerated && (
          <>
            <h2 className="text-3xl font-bold mt-8 mb-4 text-center text-blue-600 border-b-4 border-blue-600 pb-2 shadow-lg rounded-lg">
              Generated Images
            </h2>
            <div className="flex flex-wrap justify-center mt-4">
              {sentImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Sent Image ${index + 1}`}
                  className={`max-w-xs max-h-xs m-2 cursor-pointer image-hover
          ${index === selectedImageIndex ? "border-2 border-blue-500" : ""}`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </>
        )}
        <div className="flex justify-between w-full mt-4">
          <button
            onClick={() => navigateTo("/wallpaper")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Wallpaper
          </button>
          <button
            onClick={() => navigateTo("/rosette")}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Rosette
          </button>
          <button
            onClick={() => navigateTo("/fireze")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Fireze
          </button>
        </div>
      </div>
    </>
  );
};

export default MergeImages;
