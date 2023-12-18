import React from "react";
import Header from "./Header";
import ImageComponent from "./ImageComponent";

const Design = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center  uppercase ">
        <ImageComponent className="rounded-lg shadow-lg" />
      </div>
    </>
  );
};

export default Design;
