import DoughnutChart from "../components/DoughnutChart";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import OnlineStatus from "./OnlineStatus";

interface UserData {
  userID: string;
  username: string;
  profilePicture: string;
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
  const [userPicture, setUserPicture] = useState<string | null>(null);
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
  }, [jwtUser]);

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
          console.log(response.data);
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

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get(
            `http://localhost:3000/profile/ProfilePicture/${username}`,
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });
          const imageUrl = URL.createObjectURL(blob);

          setUserPicture(imageUrl);
        } else {
          // Handle the case when there is no token (e.g., display a placeholder image)
          setUserPicture("../../public/images/default.png");
        }
      } catch (error) {
        // Handle errors gracefully (e.g., display an error message to the user)
        console.error("Error fetching user picture:", error);
      }
    };

    // Call the fetchUserPicture function
    fetchUserPicture();
  }, [username]);
  
  return (
    <div className="background-gray rounded-[30px] h-auto p-6 mt-3 sm:ml-8 lg:ml-8 lg:mt-14 shadow-[0px_10px_30px_20px_#00000024] animate-fade-in-top">
      <h1 className="text-gray-200 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-5xl">
        {user ? user.displayname : "Loading..."}'s Profile
      </h1>
      <div className="flex items-center">
        <div className="flex items-center">
          {userPicture && (
            <div className="relative">
            <img
              src={userPicture}
              alt="profile picture"
              className="w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
            />
            {/* Online / Offline status */}
            {user && <OnlineStatus status={user.status} />}
             </div>
          )}
          {jwtUser?.username !== user?.username && (
            <div className="absolute flex items-center space-x-2 top-5 right-5 mt-2 mr-2">
              {user && <FriendButton username={user.username} />}
              {user && <BlockButton username={user.username} />}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-white font-[Rubik] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-4xl">
              {user ? user.displayname : "Loading..."}
            </h1>
            <h2 className="text-white font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="../public/images/trophy.png"
                alt="Throphy"
              />
              Elo - {user ? user.elo : "..."}
            </h2>
            <h2 className="text-white font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex items-center">
              <img
                className="w-6 h-6 mr-2"
                src="../public/images/rank.png"
                alt="Medal"
              />
              Rank - #667
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
