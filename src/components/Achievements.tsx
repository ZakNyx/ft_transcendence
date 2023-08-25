import React from "react";

export default function Achievements() {
  return (
    <div>
      <div className="bg-gray-900 rounded-[30px] w-[800px] h-auto  p-6 ml-7 mt-7  shadow-[0px_10px_30px_20px_#00000024]">
        <h2 className="text-gray-200 font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4">
          Achievements
        </h2>
        <div className="">
          <ul>
            <li className="flex items-center space-x-4 mb-4">
              <img
                src="../../public/images/bronze.png"
                alt="bronze"
                className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl"
              />
              <div className="text-gray-200 font-[Rubik]">
                <h3 className="text-lg">Welcome to Pisslo</h3>
                <span className="ml-6 text-sm">Reach 1000 Elo</span>
              </div>
            </li>
            <li className="flex items-center space-x-4 mb-4">
              <img
                src="../../public/images/silver.png"
                alt="silver"
                className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl"
              />
              <div className="text-gray-200 font-[Rubik]">
                <h3 className="text-lg">Finally out of that hole</h3>
                <span className="ml-6 text-sm">Reach 2500 Elo</span>
              </div>
            </li>
            <li className="flex items-center space-x-4 mb-4">
              <img
                src="../../public/images/gold.png"
                alt="gold"
                className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl"
              />
              <div className="text-gray-200 font-[Rubik]">
                <h3 className="text-lg">The Next Faker</h3>
                <span className="ml-6 text-sm">Reach 5000 Elo</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
