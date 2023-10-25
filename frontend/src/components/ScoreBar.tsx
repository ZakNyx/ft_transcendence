import axios from "axios";
import React, { useEffect, useState } from "react";
import { initializeSocket } from "./socketManager";
import { useNavigate } from "react-router-dom";

interface ScoreBarProps {
  score: number;
  enemy_score: number;
  you: string;
  opps: string;
}

interface notifData {
  int: number;

  reciever: string;
  sender: string;
  sernderDisplayName: string;
  senderPicture: string;
  type: string;
  data: string;
}

interface UserData {
  userID: string;
  username: string;
  profilePicture: string;
  displayname: string;
  gamesPlayed: number;
  wins: number;
  loses: number;
  winrate: number;
  elo: number;
  status2fa: boolean;
  secret2fa: boolean;
  secretAuthUrl: boolean;
  notifications: notifData[];
}


const ScoreBar: React.FC<ScoreBarProps> = ({
  score,
  enemy_score,
  you,
  opps,
}) => {

  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [oppUserPicture, setOppUserPicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [oppUsername, setOppUsername] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [opp, setOpp] = useState<UserData | null>(null);
  const navigate = useNavigate();



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
          setUser(response.data);
          setUsername(response.data.username);
          const socket = initializeSocket(token);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Redirect to localhost:5137/ if Axios returns a 401 error
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/");
          } // Redirect to the root path
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/");
      }
    };

    // Call the fetchUserData function
    fetchUserData();
    return (() => {
      console.log('scoreboard is unmount')
    })
  }, [username]);

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
          const response = await axios.get(`http://localhost:3000/profile/${opps}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setOpp(response.data);
          setOppUsername(response.data.username);
          const socket = initializeSocket(token);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Redirect to localhost:5137/ if Axios returns a 401 error
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/");
          } // Redirect to the root path
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/");
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [oppUsername]);

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie && username) {
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

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie && oppUsername) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get(
            `http://localhost:3000/profile/ProfilePicture/${oppUsername}`,
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
          setOppUserPicture(imageUrl);
        } else {
          // Handle the case when there is no token (e.g., display a placeholder image)
          setOppUserPicture("../../public/images/default.png");
        }
      } catch (error) {
        // Handle errors gracefully (e.g., display an error message to the user)
        console.error("Error fetching user picture:", error);
      }
    };

    // Call the fetchUserPicture function
    fetchUserPicture();
  }, [oppUsername]);

  return (
    <div className="bg-npc-gray w-[45%] max-w-screen-md rounded-lg">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&family=Roboto:wght@500&display=swap');
      </style>
      <div className="flex flex-col sm:flex-row items-center justify-between text-gray-100 font-[Montserrat] text-base sm:text-s md:text-lg lg:text-xl xl:text-2xl rounded-md p-3">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          {userPicture && (
            <img
              src={userPicture}
              alt="Profile Owner"
              className="w-12 h-12 rounded-full"
            />
          )}
          <span className="whitespace-nowrap">{you}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-500">{score}</span>
          <span className="text-gray-500">-</span>
          <span className="text-red-500">{enemy_score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="whitespace-nowrap">{opps}</span>
          {oppUserPicture && (
            <img
              src={oppUserPicture}
              alt={`${oppUsername}'s profile`}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;
