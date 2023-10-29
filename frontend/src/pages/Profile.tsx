import NavBar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import MatchHistory from "../components/MatchHistory";
import Achievements from "../components/Achievements"; // Import the Achievements component
import FriendList from "../components/FriendList";

function Profile() {
  return (
    //background-image removed
    <div className="min-h-screen">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
      </style>
      {/* <NavBar /> */}
      <div className="flex lg:items-center flex-col lg:flex-row">
        <div className="mb-4 lg:mb-0 lg:pr-4 lg:flex-shrink-0 gap-6 lg:w-[50%] ">
          <ProfileCard />
        </div>
        <div className="lg:w-[48%]">
          <FriendList />
        </div>
      </div>
      <div className="flex lg:items-center flex-col lg:flex-row">
        <div className="lg:w-[50%]">
          <MatchHistory />
        </div>
        <div className="lg:w-[48%]">
          <Achievements />
        </div>
      </div>
    </div>
  );
}

export default Profile;
