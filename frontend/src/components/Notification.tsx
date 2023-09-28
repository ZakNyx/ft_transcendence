import axios from "axios";
import React, { useEffect, useState } from "react";
import { initializeSocket } from "./socketManager";


interface notifData {
  int :number;

  reciever: string;
  sender: string;
  sernderDisplayName:string;
  senderPicture: string;
  type: string;
  data:string;
}

interface UserData {
  username: string;
  profilePicture: string;
  displayname: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<notifData[] | null>(null);

  const [jwtUser, setJwtUser] = useState<UserData | null>(null);

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

  const socket = initializeSocket('');
  useEffect(() => {
    const fetchNotifications = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          const response = await axios.get<notifData[]>(
            `http://localhost:3000/profile/notifications/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const updateUserPictures = async () => {
      if (notifications) {
        const updatedData: notifData[] = [];

        for (const user of notifications) {
          const imageUrl = await fetchUserPicture(user.sender);
          const displayname = await fetchUserDisplay(user.sender);
          user.sernderDisplayName = displayname;
          user.senderPicture = imageUrl;
          updatedData.push(user);
        }

        setNotifications(updatedData);
      }
    };

    if(notifications && notifications.length > 0)
    updateUserPictures();
  }, [notifications]);

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
          }
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

  const fetchUserDisplay = async (username:string) => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
        const response = await axios.get(
          `http://localhost:3000/profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.displayname;
        }
    } catch (error) {
      console.error("Error fetching user displayname", error);
  }
}

const acceptRequest = async (user:string) => {
  try {
    const notificationData = {
      // Customize the notification data as needed
      reciever: jwtUser?.username,
      sender: user,
      type: "friendRequest",
      status: "accept",
    };
    // Emit the "sendNotification" event to the WebSocket server
    socket.emit("replyToFriendRequest", notificationData);
    window.location.reload();
  } catch (error: any) {
    console.error("Error fetching user data:", error);
  }
};

const cancelFriendRequest = async (user: string) => {
  try {
    const notificationData = {
      // Customize the notification data as needed
      reciever: jwtUser?.username,
      sender: user,
      type: "friendRequest",
      status: "reject",
    };
    // Emit the "sendNotification" event to the WebSocket server
    socket.emit("replyToFriendRequest", notificationData);
    window.location.reload();
  } catch (error: any) {
    console.error("Error fetching user data:", error);
  }
};

  return (
    <div className="text-gray-200 flex justify-center items-center font-montserrat pr-3 pl-3 max-h-screen overflow-y-scroll">

      <ul>
        {notifications && notifications.map((notification, index) => (
          <li className="" key={index}>
            <div className="items-center flex space-x-3">
              <img
                className="w-8 md:w-10 lg:w-10 xl:w-10 h-8 md:h-10 lg:h-10 xl:h-10 rounded-full"
                src={notification.senderPicture}
                alt="User profile picture"
              />
              <p className="max-w-[12rem] break-words text-xs xs:text-xs md:text-xs lg:text-sm">
                <b>{notification.sernderDisplayName}</b> has sent you a friend request.
              </p>
              <div className="space-x-2">
                <button onClick={()=> {acceptRequest(notification.sender)}} className="rounded-md bg-npc-purple hover:bg-purple-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm ">
                  Accept
                </button>
                <button onClick={()=> {cancelFriendRequest(notification.sender)}} className="rounded-md bg-red-500 hover:bg-red-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
  
  );
};

export default Notifications;
