
import React from "react";

const MatchHistory = () => {
  const matchHistory = [
    {
      opponent: "ie-laabb",
      playerScore:5,
      opponentScore: 0,
      result: "win",
    },
    {
        opponent: "ie-laabb",
        playerScore: 3,
        opponentScore: 2,
        result: "win",
      },
      {
        opponent: "ie-laabb",
        playerScore: 5,
        opponentScore: 2,
        result: "win",
      },
      {
        opponent: "ie-laabb",
        playerScore: 3,
        opponentScore: 2,
        result: "win",
      },    {
        opponent: "ie-laabb",
        playerScore: 4,
        opponentScore: 5,
        result: "lost",
      }, 

    // ... add more matches here ...
  ];

 return (
    <div className="bg-gray-900 rounded-[30px] p-6 mt-6 mx-auto lg:max-w-[70%] shadow-[0px_10px_20px_20px_#00000024]" >
      <h1 className="text-gray-200 font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4">
        Match History
      </h1>
      <ul className="space-y-4">
        {matchHistory.map((match, index) => (
          <li
            key={index}
            className={`flex items-center justify-between text-gray-100 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-md p-3 ${
              match.result === "win" ? "linear-grad-green" : "lenin-grad-red"
            }`}
          >
            <div className="flex items-center space-x-2">
              <img
                src="../public/images/zihirri.jpg"
                alt="Profile Owner"
                className="w-12 h-12 rounded-full"
              />
              <span>Zihirri</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">{match.playerScore}</span>
              <span className="text-gray-500">-</span>
              <span className="text-red-500">{match.opponentScore}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={`../public/images/${match.opponent}.jpg`}
                alt={`${match.opponent}'s profile`}
                className="w-12 h-12 rounded-full"
              />
              <span>{match.opponent}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;