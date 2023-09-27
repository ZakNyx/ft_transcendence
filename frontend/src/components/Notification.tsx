import React, { useState } from "react";

const Notifications = () => {
  const notifications = [
    {
      username: "First",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
  ];

  return (
    <div className="text-gray-200 flex justify-center items-center font-montserrat pr-3 pl-3 max-h-screen overflow-y-scroll">

      <ul>
        {notifications.map((notification, index) => (
          <li className="" key={index}>
            <div className="items-center flex space-x-3">
              <img
                className="w-8 md:w-10 lg:w-10 xl:w-10 h-8 md:h-10 lg:h-10 xl:h-10 rounded-full"
                src={notification.picture}
                alt="User profile picture"
              />
              <p className="max-w-[12rem] break-words text-xs xs:text-xs md:text-xs lg:text-sm">
                <b>{notification.username}</b> has sent you a friend request.
              </p>
              <div className="space-x-2">
                <button className="rounded-md bg-npc-purple hover:bg-purple-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm ">
                  Accept
                </button>
                <button className="rounded-md bg-red-500 hover:bg-red-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm">
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
