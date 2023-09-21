import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";
import axios from "axios";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<number | undefined>(
    undefined,
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const openDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const [username, setUser] = useState<string | null>(null);
  const [userPicture, setUserPicture] = useState<string | null>(null);

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
          const response = await axios.get("http://localhost:3000/profile/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setUser(response.data.username);
        } catch (error) {
          // Handle errors gracefully (e.g., display an error message to the user)
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []);

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie && username) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get(
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

          setUserPicture(imageUrl);
        } else {
          // Handle the case when there is no token (e.g., display a placeholder image)
          setUserPicture("../../public/images/default.png");
        }
      } catch (error) {
        // Handle errors gracefully (e.g., display an error message to the user)
        console.error("Error fetching user picture:", error);
      }
    };

    // Call the fetchUserPicture function
    fetchUserPicture();
  }, [username]);

  const closeDropdown = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // Adjust the delay time as needed
    setDropdownTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  // Render your Navbar JSX here, using the username and userPicture states
  return (
    <header>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
      </style>
      <nav className="navbar flex justify-between items-center w-auto h-16 mx-auto top-0">
        <div className="relative">
          <NavLink to="/home">
            <img
              className="top-2 left-2 w-32 h-auto cursor-pointer"
              src="../public/images/pingpong.png"
              alt="PingPong"
            />
          </NavLink>
        </div>
        <div>
          <SearchBar />
        </div>
        <div>
          <ul className="float-right mr-10 flex leading-[80px] space-x-3   uppercase rounded items-center">
            <li>
              <NavLink to="/home">
                <IconButton
                  imagePath="../public/images/Home.svg"
                  isActive={window.location.pathname === "/home"}
                />
              </NavLink>
            </li>

            <li>
              <NavLink to="/chat">
                <IconButton
                  imagePath="../public/images/Chat.svg"
                  isActive={window.location.pathname === "/chat"}
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard">
                <IconButton
                  imagePath="../public/images/Leaderboard.svg"
                  isActive={window.location.pathname === "/leaderboard"}
                />
              </NavLink>
            </li>
            <li>
              <IconButton
                imagePath="../public/images/Notification.svg"
                isActive={window.location.pathname === "/Notification"}
              />
            </li>
            <li className="flex items-center">
              <div
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {userPicture && (
                  <img
                    src={userPicture}
                    alt="profile picture"
                    className="w-12 h-12 cursor-pointer rounded-[30px] flex-shrink-0 min-w-[48px] min-h-[48px]"
                  />
                )}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 z-10 mt-2 w-40 text-left origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-70 focus:outline-none"
                    style={{ top: "3.5rem", right: "-2.5rem" }}
                  >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/user.svg"
                          alt="User"
                        />
                        <NavLink to="/profile" className="block">
                          Profile
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/setting.svg"
                          alt="User"
                        />
                        <NavLink to="/settings" className="block">
                          Settings
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/logout.svg"
                          alt="logout"
                        />
                        <NavLink to="/" className="block">
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
