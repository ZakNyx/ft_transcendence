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
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[50%] mb-4 lg:mb-0 lg:pr-4 lg:flex-shrink-0">
          <ProfileCard />
        </div>
        <div className="w-full lg:w-[50%]">
          <Achievements />
        </div>
      </div>
      <MatchHistory />
    </div>
  );
}

export default Profile;

