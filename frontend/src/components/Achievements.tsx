import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Achievements() {
  const [user, setUser] = useState<any>(null);
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
          // console.log(response.data);
          setUser(response.data);
        } catch (error: any) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [username]);

  let friend: boolean = false;
  let played: boolean = false;
  let won: boolean = false;
  if (user) {
    friend = user.friends?.length >= 1;

    played = user.gamesPlayed >= 1;

    won = user.wins >= 1;
  }
  return (
    <div>
      <div className="background-gray rounded-[30px] h-[44vh] p-6 mt-7 shadow-[0px_10px_30px_20px_#00000024] animate-fade-in-top overflow-y-scroll">
        <h2 className="text-gray-200 font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4">
          Achievements
        </h2>
        <div className="h-[44vh] flex items-center justify-center">
          {!friend && !played && !won ? (
            <div className="text-center">
              <p className="text-gray-200 font-[Rubik] text-lg mb-28">
                Boohoo! You haven't achieved anything yet (In life too)
              </p>
            </div>
          ) : (
            <ul>
              {friend && (
                <li className="flex items-center space-x-4 mb-4">
                  <img
                    src="../../public/images/bronze.png"
                    alt="bronze"
                    className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl"
                  />
                  <div className="text-gray-200 font-[Rubik]">
                    <h3 className="text-lg">Not So lonely ...</h3>
                    <span className="ml-6 text-sm">Got His First Friend</span>
                  </div>
                </li>
              )}
              {played && (
                <li className="flex items-center space-x-4 mb-4">
                  <img
                    src="../../public/images/silver.png"
                    alt="silver"
                    className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl "
                  />
                  <div className="text-gray-200 font-[Rubik]">
                    <h3 className="text-lg">How did it go ?</h3>
                    <span className="ml-6 text-sm">Played First Game</span>
                  </div>
                </li>
              )}
              {won && (
                <li className="flex items-center space-x-4 mb-4">
                  <img
                    src="../../public/images/gold.png"
                    alt="gold"
                    className="2xl:w-24 xl:w-20 lg:w-16 w-12 max-w-22 2xl:h-24 xl:h-20 lg:h-16 h-12 object-contain rounded-xl"
                  />
                  <div className="text-gray-200 font-[Rubik]">
                    <h3 className="text-lg">The Next Faker</h3>
                    <span className="ml-6 text-sm">Got His First Win</span>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
