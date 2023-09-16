import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/Navbar";
import axios from "axios";
import BackToTop from "../components/BackToTop.tsx";
export default function Leaderboard() {

  const [dataa, setData] = useState(null);

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
          const response = await axios.get("http://localhost:3000/user/leaderboard/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          console.log(response.data);
          setData(response.data);
        } catch (error) {
          // Handle errors gracefully (e.g., display an error message to the user)
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []);

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async (username) => {
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

          return imageUrl;
        } else {
          // Handle the case when there is no token (e.g., display a placeholder image)
          return "URL_OF_PLACEHOLDER_IMAGE";
        }
      } catch (error) {
        // Handle errors gracefully (e.g., display an error message to the user)
        console.error("Error fetching user picture:", error);
        // Return the URL of a placeholder image or handle the error as needed
        return "URL_OF_PLACEHOLDER_IMAGE";
      }
    };

    // Function to update profile pictures in the user data
    const updateUserPictures = async () => {
      if (dataa) {
        const updatedDataa = [];

        for (const user of dataa) {
          const imageUrl = await fetchUserPicture(user.username);
          user.profilePicture = imageUrl;
          updatedDataa.push(user);
        }

        // Update the state with the updated data
        setData(updatedDataa);
      }
    };

    // Call the function to update user pictures
    updateUserPictures();
  }, [dataa]);

  return (
    <div className="background-image min-h-screen">
      <NavBar />
      <h1 className="flex flex-col justify-center items-center font-montserrat font-bold text-4xl text-gray-200 mt-8">
        Leaderboard
      </h1>
      <BackToTop />
      <div className="p-6 mt-6 mx-auto lg:max-w-[90%]">
        {dataa && dataa.map((item, index) => (
          <div
            key={item.userID}
            className="flex rounded-2xl p-4 mb-4 justify-between bg-npc-gray shadow-[0px_2px_4px_2px_#00000006]"
          >
            <div className="flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                #{index + 1}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Rank
              </p>
            </div>

            <div className="flex items-center justify-center  mr-4">
            {item.profilePicture && (
                  <img
                    src={item.profilePicture}
                    alt="profile picture"
                    className="w-8 md:w-10 lg:w-16 xl:w-20 h-8 md:h-10 lg:h-16 xl:h-20 rounded-full"
                  />
                )}
              <h1 className="font-montserrat font-bold text-white ml-4 text-xs md:text-sm lg:text-base xl:text-xl">
                {item.displayname}
              </h1>
            </div>

            <div className="hidden sm:flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.Gamesplayed}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Games Played
              </p>
            </div>

            <div className="hidden sm:flex flex-col justify-center mr-4">
              <h2 className=" font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.wins}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Games Won
              </p>
            </div>

            <div className="flex flex-col justify-center mr-4">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.winrate}%
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Winrate
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="font-montserrat font-semibold text-white text-sm md:text-base lg:text-xl xl:text-2xl">
                {item.elo}
              </h2>
              <p className="font-montserrat text-npc-light-gray text-xs md:text-xs lg:text-sm xl:text-base">
                Elo
              </p>
            </div>

            <div className="flex flex-col justify-center ">
              <a href="">
                <img
                  src="../../public/images/greaterthan.svg"
                  className="w-8 md:w-10 lg:w-12 xl:w-12 h-8 md:h-10 lg:h-12 xl:h-12"
                ></img>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
