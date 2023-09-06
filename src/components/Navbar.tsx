import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";
function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<number | undefined>(
    undefined,
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const openDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

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
                <img
                  src="../../public/images/zihirri.jpg"
                  alt="profile picture"
                  className="w-12 h-12 cursor-pointer rounded-[30px] flex-shrink-0 min-w-[48px] min-h-[48px]"
                />
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
