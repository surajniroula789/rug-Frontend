import React from "react";
import Header from "./Header";
import logo from "../assets/images/design.jpg";

const Home = () => {
  return (
    <>
      <Header />

      <div className="pt-40 bg-white">
        <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div className="md:5/12 lg:w-5/12">
              <img src={logo} alt="image" />
            </div>
            <div className="md:7/12 lg:w-6/12">
              <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
                we design the galainch
              </h2>
              <p className="mt-6 text-gray-600">Hello Darling</p>
              <p className="mt-4 text-gray-600">Let's Do It</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
