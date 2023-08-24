import NavBar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import MatchHistory from "../components/MatchHistory";
import Achievements from "../components/Achievements"; // Import the Achievements component

function Profile() {
  return (
    <div className="background-image">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
      </style>
      <NavBar />
      <div className="flex">
        <div className="w-[50%]">
          <ProfileCard />
        </div>
        <div className="w-[50%]">
          <div className="">
            <Achievements />
          </div>
        </div>
      </div>
      <MatchHistory /> 
    </div>
  );
}

export default Profile;
