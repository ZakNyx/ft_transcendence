import { useEffect, useState } from "react";
import joystickSvg from "../../public/images/joystick.svg";
import robotSvg from "../../public/images/robot.svg";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { InitSocket, setUsername } from "./variables";
import { initializeChatSocket } from "../components/socketManager";


interface UserData {
  displayname: string;
}

interface UserName {
  username: string;
}

function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState<UserName | null>(null);

  InitSocket();

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
          const response = await axios.get<UserData>(`http://localhost:3000/profile/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setUser(response.data);
        } catch (error) {
          // Handle errors
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []); // The empty dependency array ensures this effect runs only once

  useEffect(() => {
    // Function to fetch user data and set it in the state
    const fetchUserName = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          // Configure Axios to send the token in the headers
          const response = await axios.get<UserName>(`http://localhost:3000/profile/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Set the user data in the state
          setName(response.data);
          // setUsername(response.data);
        } catch (error) {
          // Handle errors
          console.error("Error fetching user data:", error);
        }
      }
    };
    // Call the fetchUserData function
    fetchUserName();
    if (name){
      setUsername(name.username);
    }
  }, []); // The empty dependency array ensures this effect runs only once

  //background-image removed
  return (
    <div className="min-h-screen">
      {/* Import Google Fonts */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
      </style>
      {/* Render the navigation bar */}
      {/* <NavBar /> */}
      {/* Render the title */}
      <h1 className="text-white font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl pt-14 px-4 md:px-10 lg:px-14 relative">
        Welcome back! {user ? user.displayname : "Loading..."}.
      </h1>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center h-[65vh]">
          {/* Button with joystick image */}
          <NavLink to="/game/multiplayer">
            <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
              <img src={joystickSvg} alt="Joystick" className="mr-3 w-8 h-8" />
              Join the Queue
            </button>
          </NavLink>
            <div className="text-white m-5 text-xl">- Or -</div>
            {/* Button with robot image */}
          <NavLink to="/game/singleplayer" >
            <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
              <img src={robotSvg} alt="Robot" className="mr-3 w-8 h-8" />
              Practice mode
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
