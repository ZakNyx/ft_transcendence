import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";

function Error401() {
  //background-image removed
  return (
    <div className="h-screen ">
      {/* <NavBar /> */}
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Oops.. cannot view this user
        </h1>
        <p className="text-lg text-gray-200">
          Cannot view User, check in{" "}
          <Link
            className="text-blue-400 underline hover:text-blue-600"
            to="/settings"
          >
            settings
          </Link>{" "}
          if user is blocked.
        </p>
      </div>
    </div>
  );
}

export default Error401;
