import React from "react";

const BlockList = () => {
  const blocklists = [
    {
      username: "First",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Ilias",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "The one tha showed first",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Ilias",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Wassim",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Wassim",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Ilias",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Wassim",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Ilias",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Jad",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Bihe",
      picture: "../../public/images/ie-laabb.jpg",
    },
    {
      username: "Wassim",
      picture: "../../public/images/ie-laabb.jpg",
    },
  ];
  return (
    <div className="flex justify-center items-center font-montserrat pr-3 pl-3 background-gray">
      <div className="max-w-screen-md  h-[20vh] w-[25vw] overflow-y-auto">
        <ul className="text-gray-200">
          {blocklists.map((blocklist, index) => (
            <li className="" key={index}>
              <div className="items-center flex space-x-3">
                <img
                  className="w-8 md:w-10 lg:w-10 xl:w-10 h-8 md:h-10 lg:h-10 xl:h-10 rounded-full"
                  src={blocklist.picture}
                  alt="User profile picture"
                />
                <p className="max-w-[12rem] break-words text-xs xs:text-xs md:text-xs lg:text-sm">
                  <b>{blocklist.username}</b> is blocked.
                </p>
                <div className="">
                  <button className="rounded-md bg-red-500 hover:bg-red-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm">
                    Unblock
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlockList;
