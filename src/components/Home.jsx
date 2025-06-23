import React from "react";
import Header from "./Header";
import rosetteImage from "../assets/images/rosettee.png";
import friezeImage from "../assets/images/border.jpg";
import wallpaperImage from "../assets/images/wallpaperr.jpg";
import fullGalaincha from "../assets/images/full.jpg";

const Home = () => {
  const partsData = [
    {
      name: "Galaincha",
      description:
        "Discover captivating rosette motifs that serve as beautiful centerpieces, elevating the appeal of your carpets or textiles.",
      image: fullGalaincha,
    },
    {
      name: "Frieze (Border)",
      description:
        "Explore our elegant frieze designs, featuring intricate border patterns that add sophistication and charm to your carpets or textiles.",
      image: friezeImage,
    },
    {
      name: "Rosette (Center)",
      description:
        "Discover captivating rosette motifs that serve as beautiful centerpieces, elevating the appeal of your carpets or textiles.",
      image: rosetteImage,
    },
    {
      name: "Wallpaper",
      description:
        "Transform your space with our stylish wallpaper designs, offering a seamless backdrop that enhances any interior decor.",
      image: wallpaperImage,
    },
  ];

  return (
    <>
      <Header />
      <div className="pt-16 bg-gray-100">
        <div className="container mx-auto px-6">
          {partsData.map((part) => (
            <div
              key={part.name}
              className={`flex flex-col md:flex-row items-center justify-between py-12 ${
                part.name === "Rosette (Center)" ? "md:flex-row-reverse" : ""
              }`}
            >
              {part.name === "Galaincha" ? (
                <>
                  <div
                    className={`md:w-1/2 ${
                      part.name === "Galaincha" ? "md:pr-8" : "md:pl-8"
                    }`}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                      {part.name}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {part.description}
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full rounded-lg shadow-lg"
                      style={{ maxWidth: "250px" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="md:w-1/2">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full rounded-lg shadow-lg"
                      style={{ maxWidth: "250px" }}
                    />
                  </div>
                  <div
                    className={`md:w-1/2 ${
                      part.name === "Wallpaper" ? "md:pl-8" : "md:pr-8"
                    }`}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                      {part.name}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {part.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
