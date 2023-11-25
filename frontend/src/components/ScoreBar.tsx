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
  sernderdisplayname: string;
  senderPicture: string;
  type: string;
  data: string;
}

interface UserData {
  userID: string;
  username: string;
  picture: string;
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
          const socket = initializeSocket('');
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
      // console.log('scoreboard is unmount')
    })
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
          // Configure Axios to send the token in the headers
          const response = await axios.get(`http://localhost:3000/profile/${opps}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setOpp(response.data);
          const socket = initializeSocket('');
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
  }, []);


  return (
    <div className="bg-npc-gray w-[45%] max-w-screen-md rounded-lg">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&family=Roboto:wght@500&display=swap');
      </style>
      <div className="flex flex-col sm:flex-row items-center justify-between text-gray-100 font-[Montserrat] text-base sm:text-s md:text-lg lg:text-xl xl:text-2xl rounded-md p-3">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          {user && (
            <img
              src={user.picture}
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
          {opp && (
            <img
              src={opp.picture}
              alt={`${opp.username}'s profile`}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;
