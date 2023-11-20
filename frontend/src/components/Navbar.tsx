import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import { initializeSocket } from "./socketManager";
import Validate from "../components/Validate";
import Notification from "./Notification";
import { RoomId, isSent, myGameOppName, setIsSent, setMyGameOppName, setRoomId, sock } from "../pages/variables";
import Swal from "sweetalert2";

interface UserData {
  userID: string;
  username: string;
  profilePicture: string;
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

const IsGameOppOnline = (GameOppName: string) => {
  const [user, setUser] = useState<UserData | null>(null);

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
          const response = await axios.get(`http://localhost:3000/profile/${GameOppName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Set the user data in the state
          setUser(response.data);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Redirect to localhost:5137/ if Axios returns a 401 error
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // navigate("/");
          } // Redirect to the root path
          console.error("Error fetching user data:", error);
        }
      }
    };
    // Call the fetchUserData function
    fetchUserData();
    if (user) console.log(`checking opp status : ${user.status}`);
  }, [user]);
}

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSocketSet, setIsSocketSet] = useState<boolean>(false);
  const [invitationReceived, setInvitationReceived] = useState<boolean>(false);
  const [isGameDeclined, setIsGameDeclined] = useState<boolean>(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [inviSender, setInviSender] = useState<string>("");

  const navigate = useNavigate();
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
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<UserData | null>(null);

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
          const socket = initializeSocket(token);
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

  // useEffect(() => {
  //     const fetchUserData = async () => {
  //       const tokenCookie = document.cookie
  //         .split("; ")
  //         .find((cookie) => cookie.startsWith("token="));
  
  //       if (tokenCookie) {
  //         const token = tokenCookie.split("=")[1];
  //         try {
  //           // Configure Axios to send the token in the headers
  //           const response = await axios.get(`http://localhost:3000/profile/${myGameOppName}`, {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           });
  //           // Set the user data in the state
  //           setOpponent(response.data);
  //         } catch (error: any) {
  //           if (error.response && error.response.status === 401) {
  //             // Redirect to localhost:5137/ if Axios returns a 401 error
  //             document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //             navigate("/");
  //           } // Redirect to the root path
  //           console.error("Error fetching user data:", error);
  //         }
  //       }
  //     };

  //     // Call the fetchUserData function
  //     fetchUserData();
  // }, [opponent]);

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
  
  useEffect(() => {

    const fetchUserData = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
        try {
          // Configure Axios to send the token in the headers
          const response = await axios.get(`http://localhost:3000/profile/${myGameOppName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Set the user data in the state
          setOpponent(response.data);
          console.log('check Opponent status : ', response.data.status);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Redirect to localhost:5137/ if Axios returns a 401 error
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/");
          } // Redirect to the root path
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (sock) {
      sock.on('joined', (roomNumber: number) => {
          console.log('listening to joined event to set room Id in NavBar : ', roomNumber);
          setRoomId(roomNumber);
      })

      if (myGameOppName && isSent) {
        fetchUserData();
        if (opponent?.status == 'ONLINE') {
          sock.emit("sendInvitationToServer", myGameOppName);
            setIsSent(false);
        }
        else if (opponent?.status == 'OFFLINE') {
          Swal.fire({
            title: `${myGameOppName} is Offline!`
          });
        }
        
      }

      sock.on('sendInvitationToOpp', (inviSender: string) => {
        setMyGameOppName(inviSender);
        console.log('you received a game invitation from : ', inviSender);
        setInvitationReceived(true);
      })
  
      sock.on('IsGameAccepted', () => {
        navigate('/game/invited');
      })
  
      sock.on('IsGameDeclined', () => {
        setIsGameDeclined(true);
      })
    }

  }, [isSent, myGameOppName, invitationReceived, RoomId, sock])

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

  // Render your Navbar JSX here, using the username and userPicture states
  if (invitationReceived) {
    Swal.fire({
      title: `${myGameOppName} invited you to a game in room Number : ${RoomId}!`,
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

  if (isGameDeclined) {
    Swal.fire({
      title: `${myGameOppName} denied your invitation!`
    });
    setIsGameDeclined(false);
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
              src="../public/images/pingpong.png"
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
            <div>
              <li onClick={toggleNotification} className="relative">
                <IconButton
                  imagePath="../public/images/Notification.svg"
                  isActive={isNotificationOpen}
                />
                {/* Notification counter */}
                {!isNotificationOpen && (user && user.notifications.length > 0) && (
                  <div className="absolute w-4 h-4 bg-red-600 rounded-full text-white text-xs -top-1 -right-1 flex items-center justify-center">
                    {user.notifications.length}
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
                    className="absolute right-0 z-10 mt-2 w-40 text-left origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 bg-opacity-90 focus:outline-none max-h-screen overflow-y-auto"
                    style={{ top: "3.5rem", right: "-2.5rem" }}
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/user.svg"
                          alt="User"
                        />
                        <NavLink to="/profile" className="block">
                          Profile
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/setting.svg"
                          alt="User"
                        />
                        <NavLink to="/settings" className="block">
                          Settings
                        </NavLink>
                      </li>
                      <li className="px-4 text-gray-700 hover:bg-gray-300 flex items-center">
                        <img
                          className="w-4 h-4 mr-2"
                          src="../../public/images/logout.svg"
                          alt="logout"
                        />
                        <NavLink
                          onClick={() => {
                            // Clear the 'token' cookie
                            document.cookie =
                              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
