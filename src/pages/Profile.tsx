import NavBar from "../components/Navbar";
import DoughnutChart from "../components/DoughnutChart";
import "../index.css";
function Profile() {
  return (
    <div className="background-image">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
      </style>
      <NavBar />
      <div className="bg-black rounded-[150px] w-[911px] h-[450px] p-6 ml-2 mt-2">
        <h1 className="text-white font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl pt-8 pl-14">
          zihirri's Profile:
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
          <div className="">
            <DoughnutChart wins={155} losses={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
