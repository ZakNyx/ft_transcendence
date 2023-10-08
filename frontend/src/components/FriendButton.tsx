import React, { useState, useEffect } from "react";
import axios from "axios";
import { initializeSocket } from "./socketManager";


interface UserData {
  profilestatus: string;
  username: string;
}

function StateChangingButton(props: { username: string }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [jwtUser, setJwtUser] = useState<UserData | null>(null);

  const socket = initializeSocket('');
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
          // Use the `username` from the URL in the API endpoint
          const response = await axios.get(
            `http://localhost:3000/profile/${props.username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // Set the user data in the state
          setUser(response.data);
        } catch (error: any) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [user]); // Include `username` in the dependency array
  const handleButtonClick = () => {
    // Toggle between states by using a switch statement
    switch (user?.profilestatus) {
      case "notFriend":
        sendFriendRequest();
        break;
      case "requested":
        cancelFriendRequest();
        break;
      case "friend":
        unFriend();
        break;
      case "requestedBy":
        acceptRequest();
        break;
      default:
        sendFriendRequest();
    }
  };

  const sendFriendRequest = async () => {
    try {
      const notificationData = {
        // Customize the notification data as needed
        type: "friendRequest", // You can define your notification types
        data: "You have a new friend request from " + jwtUser?.username,
        reciever: user?.username,
        // Add any other relevant data
      };
      // Emit the "sendNotification" event to the WebSocket server
      socket.emit("sendNotification", notificationData);
      window.location.reload();
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      const notificationData = {
        // Customize the notification data as needed
        reciever: user?.username,
      };
      // Emit the "sendNotification" event to the WebSocket server
      socket.emit("cancelNotification", notificationData);
      window.location.reload();
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  };

  const acceptRequest = async () => {
    try {
      const notificationData = {
        // Customize the notification data as needed
        reciever: jwtUser?.username,
        sender: user?.username,
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

  const unFriend = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        await axios.put(
          `http://localhost:3000/user/unfriend`,
          { username: props.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        window.location.reload();
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  let buttonClassName = "";

  // Set the class name based on the currentState
  switch (user?.profilestatus) {
    case "notFriend":
      buttonClassName =
        "text-gray-200 bg-npc-purple hover:bg-purple-hover transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base";
      break;
    case "requested":
      buttonClassName =
        "text-gray-200 bg-gray-400 hover:bg-gray-500 transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base";
      break;
    case "friend":
      buttonClassName =
        "text-gray-200 bg-red-400 hover:bg-red-500 transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base";
      break;
    case "requestedBy":
      buttonClassName =
        "text-gray-200 bg-green-500 hover:bg-green-600 transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base";
      break;
    default:
      buttonClassName =
        "text-gray-200 bg-npc-purple hover:bg-purple-hover transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base";
  }

  return (
    <div className="">
      <button className={buttonClassName} onClick={handleButtonClick}>
        {user?.profilestatus === "notFriend"
          ? "Add Friend"
          : user?.profilestatus === "requested"
          ? "Cancel Request"
          : user?.profilestatus === "requestedBy"
          ? "Accept Request"
          : "Remove Friend"}
      </button>
    </div>
  );
}

export default StateChangingButton;