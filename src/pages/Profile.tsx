import NavBar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard"
import MatchHistory from "../components/MatchHistory"

function Profile() {
  return (
    <div className="background-image">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');
      </style>
      <NavBar/>
      <ProfileCard/>
      <MatchHistory/>
   </div>
  )
}

export default Profile;
