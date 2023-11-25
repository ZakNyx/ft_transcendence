import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface UserData {
  username: string;
  picture: string;
  displayname: string;
}

const BlockList: React.FC = () => {
  const [blocklist, setBlockList] = useState<UserData[] | null>(null);

  useEffect(() => {
    const fetchBlockList = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          const response = await axios.get<UserData[]>(
            `http://localhost:3000/profile/blocks/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setBlockList(response.data);
          console.log(response.data)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchBlockList();
  }, []);


  const handleClick = async (param: {
    displayname: string;
    username: string;
  }) => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        const response = await axios.put(
          `http://localhost:3000/user/unblock`,
          { username: param.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // If validation is successful, set the 2faValidated cookie to true with a 24-hour expiration
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Success" + "</h1>",
          text: `${param.displayname} has been unblocked.`,
          icon: "success",
          background: "#252526",
          timer: 2000,
        });
        window.location.reload();
        // close(); // This appears to be a missing function
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <div>
      <span className="font-semibold text-gray-200 opacity-90 ml-2">
        Block List
      </span>
      <div className="flex justify-center items-center font-montserrat pr-3 pl-3 background-gray">
        <div className="max-w-screen-md h-[20vh] w-[50vw] lg:w-[30vw] overflow-y-auto">
          <ul className="text-gray-200">
            {blocklist &&
              blocklist.map((blocklist, index) => (
                <li className="mb-3 flex items-center" key={index}>
                  <img
                    className="w-8 md:w-10 lg:w-10 xl:w-10 h-8 md:h-10 lg:h-10 xl:h-10 rounded-full"
                    src={blocklist.picture}
                    alt="User profile picture"
                  />
                  <p className="max-w-[10rem] pl-3 break-words text-xs xs:text-xs md:text-xs lg:text-sm username">
                    <b>{blocklist.displayname}</b> is blocked.
                  </p>
                  <div className="ml-auto">
                    <button
                      onClick={() =>
                        handleClick({
                          displayname: blocklist.displayname,
                          username: blocklist.username,
                        })
                      }
                      className="rounded-md bg-red-500 hover:bg-red-hover p-1.5 shadow-md text-xs xs:text-xs md:text-xs lg:text-sm"
                    >
                      Unblock
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlockList;
