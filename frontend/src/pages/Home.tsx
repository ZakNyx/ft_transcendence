import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import joystickSvg from "../../public/images/joystick.svg";
import robotSvg from "../../public/images/robot.svg";
import axios from "axios";

interface UserData {
  displayname: string;
}

function HomePage() {
  const [user, setUser] = useState<UserData | null>(null);

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
          const response = await axios.get<UserData>("http://localhost:3000/profile/me", {
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

  return (
    <div className="background-image min-h-screen">
      {/* Import Google Fonts */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
      </style>
      {/* Render the navigation bar */}
      <NavBar />
      {/* Render the title */}
      <h1 className="text-white font-[Roboto] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl pt-14 px-4 md:px-10 lg:px-14 relative">
        Welcome back! {user ? user.displayname : "Loading..."}.
      </h1>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center h-[65vh]">
          {/* Button with joystick image */}
          <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            <img src={joystickSvg} alt="Joystick" className="mr-3 w-8 h-8" />
            Join the Queue
          </button>
          <div className="text-white m-5 text-xl">- Or -</div>
          {/* Button with robot image */}
          <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            <img src={robotSvg} alt="Robot" className="mr-3 w-8 h-8" />
            Play against AI
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
