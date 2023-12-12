import React from "react";

interface FriendsStatus {
  status: "ONLINE" | "OFFLINE" | "INGAME" ;
}


const FriendsStatus: React.FC<{ status: string, image: string }> = ({ status, image }) => {
  let statusColorClass = "bg-gray-500"; // Default gray color

  switch (status) {
    case "ONLINE":
      statusColorClass = "border-green-400"; // Green for online status
      break;
    case "OFFLINE":
      statusColorClass = "border-gray-400"; // Red for offline status
      break;
    case "INGAME":
      statusColorClass = "border-blue-400"; // Blue for in-game status (adjust as needed)
      break;

    default:
      break;
  }

  return (
    <img
    className={`w-14 sm:w-16 md:w-20 lg:w-24 h-14 sm:h-16 md:h-20 lg:h-24 rounded-full mb-2 border-4 ${statusColorClass}`}
    src={image}
    alt="User profile picture"
  />  );
};

export default FriendsStatus;