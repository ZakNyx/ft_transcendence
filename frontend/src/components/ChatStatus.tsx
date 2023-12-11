import React from "react";

interface ChatStatus {
  status: "ONLINE" | "OFFLINE" | "INGAME" ;
}


const ChatStatus: React.FC<{ status: string }> = ({ status }) => {
  let statusColorClass = "bg-gray-500"; // Default gray color
  console.log(status)

  switch (status) {
    case "ONLINE":
      statusColorClass = "bg-green-500"; // Green for online status
      break;
    case "OFFLINE":
      statusColorClass = "bg-gray-500"; // Red for offline status
      break;
    case "INGAME":
      statusColorClass = "bg-blue-500"; // Blue for in-game status (adjust as needed)
      break;

    default:
      break;
  }

  return (
    <div className={`absolute top-[140px]  right-36 w-4 md:w-6 lg:w-7 xl:w-8 h-4 md:h-6 lg:h-7 xl:h-8 rounded-full border-2 border-white  ${statusColorClass}`}></div>
  );
};

export default ChatStatus;