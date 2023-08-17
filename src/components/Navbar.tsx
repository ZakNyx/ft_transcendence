import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);
  return (
    <header>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
      </style>
      <nav className="navbar flex justify-between items-center w-auto mx-auto top-0">
        <div className="relative">
          <img
            className="top-2 left-2 w-32 h-auto cursor-pointer"
            src="../public/images/pingpong.png"
            alt="PingPong"
          />
        </div>
        <div>
          <ul className="float-right mr-10 flex leading-[80px] space-x-11 uppercase rounded">
            <li>
              <NavLink
                to="/home"
                className={`hover:text-gray-300 hover:underline decoration-1 font-[Montserrat] font-bold ${
                  window.location.pathname === "/home"
                    ? "text-white underline decoration-1"
                    : "text-[#2E2D2D]"
                }`}
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat"
                className={`hover:text-gray-300 hover:underline decoration-1  font-[Montserrat] font-bold ${
                  window.location.pathname === "/chat"
                    ? "text-white underline decoration-1"
                    : "text-[#2E2D2D]"
                }`}
              >
                CHAT
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leaderboard"
                className={`hover:text-gray-300 hover:underline decoration-1  font-[Montserrat] font-bold ${
                  window.location.pathname === "/leaderboard"
                    ? "text-white underline decoration-1"
                    : "text-[#2E2D2D]"
                }`}
              >
                LEADERBOARD
              </NavLink>
            </li>
            <li className="flex items-center">
              <img
                src="../../public/images/zihirri.jpg"
                alt="profile picture"
                className="w-12 h-12 cursor-pointer rounded-[30px] object-contain flex-shrink-0 min-w-[48px] min-h-[48px]"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 z-10 mt-2 w-40  text-left origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-70 focus:outline-none "
                  style={{ top: "4.5rem", right: "0rem" }}
                >
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center ">
                      <img
                        className="w-4 h-4 mr-2"
                        src="../../public/images/user.svg"
                        alt="User"
                      />
                      <NavLink to="/profile" className="block">
                        Profile
                      </NavLink>
                    </li>
                    <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center ">
                      <img
                        className="w-4 h-4 mr-2"
                        src="../../public/images/setting.svg"
                        alt="User"
                      />
                      <NavLink to="/settings" className="block">
                        Settings
                      </NavLink>
                    </li>
                    <li className="px-4 text-gray-700 hover:bg-gray-200 flex items-center ">
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
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
