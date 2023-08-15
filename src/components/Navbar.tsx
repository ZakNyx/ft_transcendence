import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <header>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
      </style>
      <nav className="navbar flex justify-between items-center w-auto mx-auto">
        <div>
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
            <li>
              <NavLink
                to="/profile"
                className={`hover:text-gray-300 hover:underline decoration-1  font-[Montserrat] font-bold ${
                  window.location.pathname === "/profile"
                    ? "text-white underline decoration-1"
                    : "text-[#2E2D2D]"
                }`}
              >
                PROFILE
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
