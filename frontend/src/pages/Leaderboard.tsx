import React from "react";
import NavBar from "../components/Navbar";
import data from "./data.tsx";
import BackToTop from "../components/BackToTop.tsx";
export default function Leaderboard() {
  return (
    <div className="background-image min-h-screen">
      <NavBar />
      <h1 className="flex flex-col justify-center items-center font-montserrat font-bold text-4xl text-gray-200 mt-8">
        Leaderboard
      </h1>
      <BackToTop />
      <div className="p-6 mt-6 mx-auto lg:max-w-[90%]">
        {data.map((item, index) => (
          <div
            key={item.userID}
            className="flex rounded-2xl p-4 mb-4 justify-between bg-npc-gray shadow-[0px_2px_4px_2px_#00000006]"
          >
            <div className="flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                #{index + 1}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Rank
              </p>
            </div>

            <div className="flex items-center justify-center  mr-4">
              <img
                className="w-8 md:w-10 lg:w-16 xl:w-20 h-8 md:h-10 lg:h-16 xl:h-20 rounded-full"
                src={item.picture}
                alt={item.displayName}
              />
              <h1 className="font-montserrat font-bold text-white ml-4 text-xs md:text-sm lg:text-base xl:text-xl">
                {item.displayName}
              </h1>
            </div>

            <div className="hidden sm:flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.gameplayed}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Games Played
              </p>
            </div>

            <div className="hidden sm:flex flex-col justify-center mr-4">
              <h2 className=" font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.wins}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Games Won
              </p>
            </div>

            <div className="flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.winrate}%
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Winrate
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.elo}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Elo
              </p>
            </div>

            <div className="flex flex-col justify-center ">
              <a href="">
                <img
                  src="../../public/images/greaterthan.svg"
                  className="w-8 md:w-10 lg:w-12 xl:w-12 h-8 md:h-10 lg:h-12 xl:h-12"
                ></img>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
