import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { HiOutlineX } from "react-icons/hi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-black text-white py-4 px-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-bold capitalize">
            The Earthquake Analyser
          </h4>
        </div>

        <div className="hidden sm:flex">
          <ul className="flex flex-col sm:flex-row gap-8 items-center font-bold text-md">
            <li className="hover:scale-105 transition-all duration-200">
              <a href="/">Home</a>
            </li>
            <li className="hover:scale-105 transition-all duration-200 w-full">
              <a href="https://my-personal-portfolio-website-beta.vercel.app/">
                About
              </a>
            </li>
            <li className="w-full hover:scale-105 transition-all duration-200">
              <a
                href="mailto:mohammadtarique661998@gmail.com"
                className="text-white hover:text-gray-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* For mobile screens */}
        <div className="sm:hidden">
          <button onClick={toggle}>
            {isOpen ? (
              <HiOutlineX className="w-7 h-7" />
            ) : (
              <HiMenu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`${
          isOpen ? "w-full flex justify-center items-center" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-4 items-center font-bold text-md w-full">
          <li className="w-full text-center hover:scale-105 transition-all duration-200 bg-orange-200 py-2 rounded-xl">
            <a href="/">Home</a>
          </li>
          <li className="hover:scale-105 transition-all duration-200">
            <a href="https://my-personal-portfolio-website-beta.vercel.app/">
              About me
            </a>
          </li>
          <li className="w-full text-center hover:scale-105 transition-all duration-200 bg-orange-200 py-2 rounded-xl">
            <a
              href="mailto:mohammadtarique661998@gmail.com"
              className="text-white hover:text-gray-300"
            >
              Contact me
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
