import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";

function Error404() {
  return (
    <div className="background-image h-screen ">
      <NavBar />
      <div className="flex flex-col items-center justify-center h-[80vh] ">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Oops.. Error 404
        </h1>
        <p className="text-lg text-gray-200">
          PAGE NOT FOUND, RETURN TO{" "}
          <Link
            className="text-blue-400 underline hover:text-blue-600"
            to="/home"
          >
            HOME
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Error404;
