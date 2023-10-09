import React from "react";

interface ScoreBarProps {
  score: number;
  enemy_score: number;
  you: string;
  opps: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  enemy_score,
  you,
  opps,
}) => {
  return (
    <div className="bg-npc-gray w-[45%] max-w-screen-md rounded-lg">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&family=Roboto:wght@500&display=swap');
      </style>
      <div className="flex flex-col sm:flex-row items-center justify-between text-gray-100 font-[Montserrat] text-base sm:text-s md:text-lg lg:text-xl xl:text-2xl rounded-md p-3">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <img
            src="../public/images/zihirri.jpg"
            alt="Profile Owner"
            className="w-12 h-12 rounded-full"
          />
          <span className="whitespace-nowrap">{you}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-500">{score}</span>
          <span className="text-gray-500">-</span>
          <span className="text-red-500">{enemy_score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="whitespace-nowrap">{opps}</span>
          <img
            src={`../public/images/${opps}.jpg`}
            alt={`${opps}'s profile`}
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;
