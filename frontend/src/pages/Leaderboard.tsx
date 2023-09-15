import React from "react";
import NavBar from "../components/Navbar";
import data from "./data.tsx";

export default function Leaderboard() {
  return (
    <div className="background-image min-h-screen">
      <NavBar />
      <h1 className="flex flex-col justify-center items-center font-montserrat font-bold text-4xl text-gray-200 mt-8 ">
        Leaderboard
      </h1>
      <div>
        <ul>
          {data.map((item) => (
            <li key={item.userID}>
                <img src={item.picture} alt={item.displayName}/>
                <p>{item.displayName}</p>
                <p>Wins: {item.wins}</p>
                <p>{item.elo}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
