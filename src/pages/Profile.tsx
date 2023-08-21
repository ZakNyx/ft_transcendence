import NavBar from "../components/Navbar";
import DoughnutChart from "../components/DoughnutChart"

function Profile() {
  return (
    <div className="background-image">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;500&display=swap');
      </style>
      <NavBar />
      <div className="bg-black rounded-[155px] w-[911px] h-[450px] flex items-center p-6 ml-7 mt-7">
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
        <div>
        <DoughnutChart wins={60} losses={40} />
      </div>
      </div>
    </div>
);
}

export default Profile;
