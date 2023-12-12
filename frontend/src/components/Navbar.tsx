import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import { initializeSocket } from "./socketManager";
import Validate from "../components/Validate";
import Notification from "./Notification";
import { InitSocket, RoomId, isSent, myGameOppName, setIsSent, setMyGameOppName, setRoomId, sock } from "../pages/variables";
import Swal from "sweetalert2";
import { Socket } from "socket.io-client";

interface UserData {
  userID: string;
  username: string;
  picture: string;
  displayname: string;
  gamesPlayed: number;
  wins: number;
  loses: number;
  winrate: number;
  elo: number;
  status: string;
  status2fa: boolean;
  secret2fa: boolean;
  secretAuthUrl: boolean;
  notifications: notifData[];
}

interface notifData {
  int: number;
  reciever: string;
  sender: string;
  sernderDisplayName: string;
  senderPicture: string;
  type: string;
  data: string;
}

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [invitationReceived, setInvitationReceived] = useState<boolean>(false);
  const [isGameDeclined, setIsGameDeclined] = useState<boolean>(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/"

  const navigate = useNavigate();
  InitSocket();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const openDropdown = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prevIsOpen) => !prevIsOpen);
  };

  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [opponent, setOpponent] = useState<UserData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

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
          const response = await axios.get(`http://localhost:3000/profile/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setUser(response.data);
          setUsername(response.data.username);
          if (!socket) setSocket(initializeSocket(token));
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Redirect to localhost:5137/ if Axios returns a 401 error
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/");
          } // Redirect to the root path
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/");
      }
    };
    // Call the fetchUserData function
    fetchUserData();
  }, [username]);

  const [notifications, setNotifications] = useState<notifData[] | null>(null);
  useEffect(() => {
    const fetchNotifications = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          const response = await axios.get<notifData[]>(
            `http://localhost:3000/profile/notifications/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if(socket)
    {
      socket.on("notification", async() => await fetchNotifications())
    }
    return (() => {
      socket?.off("notification");
    })
  });

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
  
  useEffect(() => {
    
    sock?.on('sendInvitationToOpp', (inviSender: string) => {
      setMyGameOppName(inviSender);
      setInvitationReceived(true);
      // setIsSent(true);
    })

    const redirectToInvitedGame = () => {
      if (sock)
        sock.emit('AcceptingInvitation', {acceptation: true, OppName: myGameOppName});
    }
  
    const invitationDenied = () => {
      if (sock) {
        sock.emit('AcceptingInvitation', {acceptation: false, OppName: myGameOppName});
        navigate('/home');
      }
    } 
    
    if (invitationReceived) {
      Swal.fire({
        title: `${myGameOppName} invited you to a game!`,
        showDenyButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'Accept',
        denyButtonText: `Deny`,
      }).then((result) => {
        if (result.isConfirmed) {
          redirectToInvitedGame();
        } else if (result.isDenied) {
          invitationDenied();
        }
        setInvitationReceived(false);
      })
    }

  }, [isSent, invitationReceived]);

  
  if (isLoginPage) {
    return null; // Don't render the NavBar on the login page
  }

  return (
    <header>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
      </style>
      <Validate />
      <nav className="navbar flex justify-between items-center w-auto h-16 mx-auto top-0">
        <div className="relative">
          <NavLink to="/home">
            <img
              className="top-2 left-2 w-32 h-auto cursor-pointer"
              src="../../images/pingpong.png"
              alt="PingPong"
            />
          </NavLink>
        </div>
        <div>
          <SearchBar />
        </div>
        <div>
          <ul className="float-right mr-10 flex leading-[80px] space-x-3 uppercase rounded items-center">
            <li>
              <NavLink to="/home">
                <IconButton
                  imagePath="../../images/Home.svg"
                  isActive={window.location.pathname === "/home"}
                />
              </NavLink>
            </li>

            <li>
              <NavLink to="/chat">
                <IconButton
                  imagePath="../../images/Chat.svg"
                  isActive={window.location.pathname === "/chat"}
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard">
                <IconButton
                  imagePath="../../images/Leaderboard.svg"
                  isActive={window.location.pathname === "/leaderboard"}
                />
              </NavLink>
            </li>
            <div>
              <li onClick={toggleNotification} className="relative">
                <IconButton
                  imagePath="../../images/Notification.svg"
                  isActive={isNotificationOpen}
                />
                {/* Notification counter */}
                {!isNotificationOpen && (notifications && notifications.length > 0) && (
                  <div className="absolute w-4 h-4 bg-red-600 rounded-full text-white text-xs -top-1 -right-1 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </li>
            </div>

            <div className="absolute z-10 right-10 top-[4rem] origin-top-right bg-npc-gray shadow-lg rounded-2xl bg-opacity-90">
              {isNotificationOpen && <Notification />}
            </div>
            <li className="flex items-center">
              <div
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {user && (
                  <img
                    src={user.picture}
                    alt="profile picture"
                    className="w-12 h-12 cursor-pointer rounded-[30px] flex-shrink-0 min-w-[48px] min-h-[48px]"
                  />
                )}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 z-10 mt-2 w-40 text-left origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 bg-opacity-90 focus:outline-none max-h-screen overflow-y-auto"
                    style={{ top: "3.5rem", right: "-2.5rem" }}
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../images/user.svg"
                          alt="User"
                        />
                        <NavLink to="/profile" className="block">
                          Profile
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../images/setting.svg"
                          alt="User"
                        />
                        <NavLink to="/settings" className="block">
                          Settings
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../images/logout.svg"
                          alt="logout"
                        />
                        <NavLink
                          onClick={() => {
                            // Clear the 'token' cookie
                            document.cookie =
                              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                              // window.location.reload();
                              navigate("/");
                          }}
                          to="/"
                        >
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