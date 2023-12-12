import React from "react";

interface ChatStatus {
  status: "ONLINE" | "OFFLINE" | "INGAME" ;
}


const ChatStatus: React.FC<{ status: string, image: string }> = ({ status, image }) => {
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
    className={`logoImg rounded-[50px] mt-2  h-[50px] md:h-[70px] flex items-center border-[5px] ${statusColorClass}`}
    src={image}
    alt="User profile picture"
  />  );
};

export default ChatStatus;