import DoughnutChart from "../components/DoughnutChart";
import Achievements from "../components/Achievements"

export default function ProfileCard() {
  return (
    <div className="bg-gray-900 rounded-[150px] w-[850px] h-auto p-6 ml-2 mt-3 sm:ml-14 lg:ml-14 lg:mt-14 shadow-[0px_10px_30px_20px_#00000024]">
      <h1 className="text-gray-200 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl pt-8 pl-14">
        Zihirri's Profile
      </h1>
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            src="../../public/images/zihirri.jpg"
            alt="profile image"
            className="w-52 h-50 rounded-[7rem] mr-6 md:mr-3 lg:mr-6 ml-[35px]"
          />
          <div className="  ">
            <h1 className="text-white font-[Rubik] text-4xl">Zihirri</h1>
            <h2 className="text-white font-[Rubik] text-2xl flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="../public/images/trophy.png"
                alt="42 Logo"
              />
              Elo - 1000
            </h2>
            <h2 className="text-white font-[Rubik] text-2xl flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="../public/images/rank.png"
                alt="42 Logo"
              />
              Rank - #667
            </h2>
          </div>
        </div>
        <div className="w-30">
          <DoughnutChart wins={12} losses={12} />
        </div>
      </div>
    </div>
  );
}
