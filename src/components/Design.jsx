import React from "react";
import Header from "./Header";
import ImageComponent from "./ImageComponent";
import CarpetForm from "./CarpetForm";

const Design = () => {
  const handleSubmit = ({ length, breadth }) => {
    // Here, you can make a backend API call to process the dimensions and generate the border using our algorithm
    //  let's log the dimensions.
    // console.log("Length:", length);
    // console.log("Breadth:", breadth);
  };
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center  uppercase ">
        <ImageComponent className="rounded-lg shadow-lg" />
      </div>
      <div className="flex justify-center items-center h-screen">
        <CarpetForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default Design;
