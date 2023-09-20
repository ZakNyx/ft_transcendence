import DoughnutChart from "../components/DoughnutChart";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  displayname: string;
}

export default function ProfileCard() {
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
          const response = await axios.get("http://localhost:3000/profile/me", {
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
    <div className="background-gray rounded-[30px] h-auto p-6 mt-3 sm:ml-8 lg:ml-8 lg:mt-14 shadow-[0px_10px_30px_20px_#00000024] animate-fade-in-top">
      <h1 className="text-gray-200 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-5xl">
        {user ? user.displayname : "Loading..."}'s Profile
      </h1>
      <div className="flex items-center">
        <div className="flex items-center">
          <img
            src="../../public/images/zihirri.jpg"
            alt="profile image"
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
          />
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
              Elo - 1000
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
          <DoughnutChart wins={12} losses={12} />
        </div>
      </div>
    </div>
  );
}
