import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface userData {
  username: string;
  displayname: string;
  profilePicture: string;
  friends: userData[];
}

export default function FriendList() {
  const [userFriends, setUserFriends] = useState<userData[] | null>(null);
  const [newuserFriends, setnewUserFriends] = useState<userData[] | null>(null);
  let { username } = useParams(); // Get the username parameter from the URL
  if (!username) {
    username = "me";
  }
  useEffect(() => {
    // Function to fetch user data and set it in the state
    const fetchFriendList = async () => {
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
          console.log(response.data.friends);
          setUserFriends(response.data.friends);
        } catch (error: any) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchFriendList();
  }, [username]);

  useEffect(() => {
    const fetchUserPicture = async (username: string) => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get<string>(
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
          return "URL_OF_PLACEHOLDER_IMAGE";
        }
      } catch (error) {
        console.error("Error fetching user picture:", error);
        return "URL_OF_PLACEHOLDER_IMAGE";
      }
    };

    const updateUserPictures = async () => {
      if (userFriends) {
        const updatedData: userData[] = [];

        for (const user of userFriends) {
          const imageUrl = await fetchUserPicture(user.username);
          user.profilePicture = imageUrl;
          updatedData.push(user);
        }

        setnewUserFriends(updatedData);
      }
    };
    if (userFriends && userFriends.length) updateUserPictures();
  }, [userFriends]);

  return (
    <div className="font-montserrat text-white background-gray rounded-[30px] p-6 mt-6 mx-auto lg:max-w-[95%] shadow-[0px_10px_20px_20px_#00000024] animate-fade-in-top ">
      <h1 className="text-gray-200 font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4">
        Friend List
      </h1>
      {newuserFriends && newuserFriends.length > 0 ? (
        <div className="flex flex-wrap overflow-hidden overflow-y-scroll h-[18rem]">
          {newuserFriends.map((friend, index) => (
            <Link
              key={index}
              to={`/profile/${friend.username}`} // <---- Link to the profile
              className="w-1/4 p-2 flex flex-col items-center text-center"
            >
              <img
                className="w-14 sm:w-16 md:w-20 lg:w-24 h-14 sm:h-16 md:h-20 lg:h-24 rounded-full mb-2"
                src={friend.profilePicture}
                alt="User profile picture"
              />
              <p className="text-gray-200 text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl max-w-[6rem] break-words hover:text-gray-400 active :text-gray-500">
                {friend.displayname}
              </p>
              <button className="p-1 md:p-2 bg-npc-purple hover:bg-purple-hover text-gray-200 text-xs md:text-base rounded-md">Invite Game</button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-[18rem] flex items-center  justify-center">
          <p className="text-gray-200 font-[Rubik] text-lg text-center ">
            Huh? You have no friends. how surprising...
          </p>
        </div>
      )}
    </div>
  );
}
