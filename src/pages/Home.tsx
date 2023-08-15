import React from "react";
import NavBar from "../components/Navbar";

function HomePage() {
  return (
    <div className="background-image min-h-screen">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Roboto:wght@500&display=swap');
      </style>
      <NavBar />
      <h1 className="text-white font-[Roboto] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl pt-14 px-4 md:px-10 lg:px-20 relative">
        Welcome back! Space Cowboy.
      </h1>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center">
          <button className="relative bg-npc-purple m-5 hover:bg-purple-hover hover:cursor-pointer text-black font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            Join the Queue
          </button>
          <p className="text-white text-xl ml-3">Or</p>
        </div>
        <button className="relative bg-npc-purple m-5 hover:bg-purple-hover hover:cursor-pointer text-black font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
          Play against AI
        </button>
      </div>
    </div>
  );
}

export default HomePage;
