import React from "react";

interface OnlineStatus {
  status: "ONLINE" | "OFFLINE" | "INGAME" ;
}

const OnlineStatus: React.FC<OnlineStatus> = ({ status }) => {
  let statusColorClass = "bg-gray-500"; // Default gray color

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
    <div className={`absolute bottom-1 right-10 w-7 h-7 rounded-full border-2 border-white  ${statusColorClass}`}></div>
  );
};

export default OnlineStatus;