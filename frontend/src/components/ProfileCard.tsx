import DoughnutChart from "../components/DoughnutChart";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import OnlineStatus from "./OnlineStatus";
import { initializeSocket } from "./socketManager";

interface UserData {
  userID: string;
  username: string;
  picture: string;
  displayname: string;
  gamesPlayed: number;
  wins: number;
  loses: number;
  winrate: number;
  status :string;
  elo: number;
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [jwtUser, setJwtUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  let { username } = useParams(); // Get the username parameter from the URL
  if (!username) {
    username = "me";
  }

  useEffect(() => {
    // Function to fetch user data and set it in the state
    const fetchUserData = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          // Configure Axios to send the token in the headers
          const response = await axios.get(`http://localhost:3000/profile/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setJwtUser(response.data);
        } catch (error: any) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []);

  useEffect(() => {
    // Function to fetch user data and set it in the state
    const fetchUserData = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          // Use the `username` from the URL in the API endpoint
          const response = await axios.get(
            `http://localhost:3000/profile/${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // Set the user data in the state
          setUser(response.data);
        } catch (error: any) {
          if (error.response && error.response.status == 401) {
            navigate("/Error401");
          }
          // if (error.response && error.response.status == 404) ;
          if (error.response && error.response.status == 404)
            navigate("/error404");
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [username]); // Include `username` in the dependency array

  return (
    <div className="background-gray rounded-[30px] lg:max-w-[95%] h-auto p-6 mt-3  lg:ml-8 lg:mt-14 shadow-[0px_10px_30px_20px_#00000024] animate-fade-in-top">
      <h1 className="text-gray-200 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-5xl">
        {user ? user.displayname : "Loading..."}'s Profile
      </h1>
      <div className="flex items-center">
        <div className="flex items-center">
          {user && (
            <div className="relative">
            <img
              src={user.picture}
              alt="profile picture"
              className="w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
            />
            {/* Online / Offline status */}
            {user && jwtUser?.username !== user.username && <OnlineStatus status={user.status} />}
             </div>
          )}
          {jwtUser?.username !== user?.username && (
            <div className="absolute flex items-center space-x-2 top-5 right-5 mt-2 mr-2">
              {user && <FriendButton username={user.username} />}
              {user && <BlockButton username={user.username} />}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="max-w-[10rem] pl-3 break-words text-white font-[Rubik] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-4xl">
              {user ? user.displayname : "Loading..."}
            </h1>
            <h2 className="max-w-[10rem] pl-3 break-words text-white font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="../..//public/images/trophy.png"
                alt="Throphy"
              />
              Elo - {user ? user.elo : "..."}
            </h2>
          </div>
        </div>
        <div className="">
          <DoughnutChart
            wins={user ? user.wins : 0}
            losses={user ? user.loses : 0}
          />
        </div>
      </div>
    </div>
  );
}