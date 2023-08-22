
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
        playerScore: 3,
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
    <div className="bg-black rounded-[50px] w-[911px] p-6 ml-7 mt-7 shadow-[0px_10px_30px_20px_#00000024]">
      <h1 className="text-white font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4">
        Match History
      </h1>
      <ul className="space-y-4">
        {matchHistory.map((match, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-white font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
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
            <span className={`text-${match.result === "win" ? "green" : "red"}-500`}>
              {match.result === "win" ? "Won" : "Lost"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}; 

export default MatchHistory;