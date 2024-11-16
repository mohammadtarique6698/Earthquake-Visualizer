import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white w-full mt-8 text-center rounded-lg">
      <p className="py-4">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-bold">Earthquake Analyser App</span>. All rights
        reserved by <span className="font-bold">Mohammad Tarique</span>.
      </p>
    </footer>
  );
};

export default Footer;
