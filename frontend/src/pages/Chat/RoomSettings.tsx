import { useLocation } from "react-router-dom";
import logoImg from "../../../public/images/panda.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BannedUsers from "../../../public/images/userBanned.svg";
import Cookies from "js-cookie";

const GroupBar = (props: any) => {
  const encodedData = encodeURIComponent(props.roomState.room.id);
  if (encodedData) {
    return (
      <div className="w-full h-full flex-wrap justify-center">
        <div className="w-full h-full flex p-[auto] items-center justify-center">
          <img
            className="logoImg rounded-[50px] ml-[30px] w-[60px] h-[60px] flex justify-center items-center"
            src={
              props.roomState.room.image
                ? `data:image/jpeg;base64,${props.roomState.room.image}`
                : logoImg
            }
            alt={""}
          />
          <div className="w-[70%] h-full ml-[20px] flex items-center justify-center">
            <div className=" text-black dark:text-white w-full h-[50%] flex justify-center items-center">
              {props.roomState.room.RoomName}
            </div>
          </div>
          <div className="w-[20%] h-full flex items-center justify-end">
            <div className="w-full h-full flex flex-row justify-end items-center">
              <Link to={`/chat/groupConv/?id=${encodedData}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mr-[20px] dark:text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
      </div>
    );
  }
};

const ParticipantOwner = (props: any) => {
  const role = props.roomState.rooms[0].role;
  const [display, setDisplay] = useState(true);

  // //console.log("props in Owner:  ", props.roomState.rooms[0]);

  const handleButtonClick = (action: any) => {
    if (props.socket) {
      //console.log("THE action:", action);
      // //console.log("THE action:", action);
      props.socket.emit(action, {
        userId: props.userId,
        subjectId: props.roomState.userId,
        roomId: props.roomState.rooms[0].RoomId,
      });
    }
    setDisplay(true);
  };

  return (
    <div
      key={props.index}
      className="w-full h-full flex-wrap justify-around items-center"
    >
      <div className="w-full h-full flex p-[auto] items-center justify-start">
        <img
          className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px] mr-[25px]"
          src={props.roomState.image}
          alt={""}
        />

        <div className=" text-black dark:text-white w-[20%] h-full flex items-center">
          {props.roomState.username}
        </div>
        <div className="w-full h-full flex-wrap items-center">
          <div className="w-full h-full flex items-center justify-end">
            <div
              className={`w-[70px] h-[30px] text-white rounded-[25px] bg-[#6F37CF] text-center flex justify-center items-center ${
                role === "OWNER" ? "opacity-[100%]" : "opacity-[70%]"
              } `}
            >
              {role}
            </div>
            <div className="w-[20px] h-full flex flex-row justify-end items-center ml-[10px]">
              <button
                onClick={() => {
                  setDisplay(!display);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`
                                    ${
                                      props.userId !== props.roomState.userId
                                        ? "w-8 h-8 dark:text-white text-center"
                                        : ""
                                    }
                                    `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-[95%] h-full mt-[-20px] flex justify-end items-start">
            <div
              className={`${
                display ? "hidden" : ""
              } w-[150px] z-10 flex items-center bg-[#1A1C26] text-white rounded-[15px] shadow-2xl`}
            >
              <ul className="w-full flex flex-col items-center text-center">
                <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                  <button
                    onClick={() => handleButtonClick("transferOwnership")}
                  >
                    Transfer Ownership
                  </button>
                </li>
                {props.roomState.rooms[0].role === "USER" && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("promote")}>
                      Promote
                    </button>
                  </li>
                )}
                {props.roomState.rooms[0].role === "ADMIN" && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("demote")}>
                      Demote
                    </button>
                  </li>
                )}
                {props.roomState.rooms[0].muted === false && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("mute")}>
                      Mute
                    </button>
                  </li>
                )}
                {props.roomState.rooms[0].muted && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("unmute")}>
                      Unmute
                    </button>
                  </li>
                )}
                <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                  <button onClick={() => handleButtonClick("kick")}>
                    Kick
                  </button>
                </li>
                <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                  <button onClick={() => handleButtonClick("ban")}>Ban</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
    </div>
  );
};

const ParticipantAdmin = (props: any) => {
  const role = props.roomState.rooms[0].role;
  const [display, setDisplay] = useState<any>(true);

  const handleButtonClick = (action: any) => {
    if (props.socket) {
      props.socket.emit(action, {
        userId: props.userId,
        subjectId: props.roomState.userId,
        roomId: props.roomState.rooms[0].RoomId,
      });
    }
    setDisplay(true);
  };
  return (
    <div
      key={props.index}
      className="w-full h-full flex-wrap justify-around items-center"
    >
      <div className="w-full h-full flex p-[auto] items-center justify-start">
        <img
          className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px] mr-[25px]"
          src={props.roomState.image}
          alt={""}
        />

        <div className=" text-black dark:text-white w-full h-full flex items-center ">
          {props.roomState.username}
        </div>
        <div className="w-full h-full flex-wrap justify-end items-center">
          <div className="w-full h-full flex items-center justify-end">
            <div
              className={`w-[70px] h-[30px] text-white rounded-[25px] bg-[#6F37CF] text-center flex justify-center items-center ${
                role === "OWNER" ? "opacity-[100%]" : "opacity-[70%]"
              } `}
            >
              {role}
            </div>
            <div className="w-[10px] h-full flex flex-row justify-end items-center ml-[20px]">
              <button
                onClick={() => {
                  setDisplay(!display);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`
                                    ${
                                      props.userId !== props.roomState.userId
                                        ? "w-8 h-8 dark:text-white text-center"
                                        : ""
                                    }
                                    `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-[95%] h-full mt-[-20px] flex justify-end items-start">
            <div
              className={`${
                display ? "hidden" : ""
              } w-[150px] z-10 flex items-center bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white rounded-[15px] text-black shadow-xl  dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]`}
            >
              <ul className="w-full flex flex-col items-center text-center">
                {props.roomState.rooms[0].muted === false && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("mute")}>
                      Mute
                    </button>
                  </li>
                )}
                {props.roomState.rooms[0].muted && (
                  <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                    <button onClick={() => handleButtonClick("unmute")}>
                      Unmute
                    </button>
                  </li>
                )}
                <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                  <button onClick={() => handleButtonClick("kick")}>
                    Kick
                  </button>
                </li>
                <li className="w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]">
                  <button onClick={() => handleButtonClick("ban")}>Ban</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
    </div>
  );
};

const ParticipantAdmin1 = (props: any) => {
  const role = props.roomState.rooms[0].role;
  return (
    <div
      key={props.index}
      className="w-full h-full flex-wrap justify-around items-center"
    >
      <div className="w-full h-full flex p-[auto] items-center justify-start">
        <img
          className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px] mr-[25px]"
          src={props.roomState.image}
          alt={""}
        />

        <div className=" text-black dark:text-white w-full h-full flex items-center">
          {props.roomState.username}
        </div>
        <div className="w-[30%] h-full flex items-center justify-end mr-[30px]">
          <div
            className={`w-[70px] h-[30px] text-white rounded-[25px] bg-[#6F37CF] text-center flex justify-center items-center ${
              role === "OWNER" ? "opacity-[100%]" : "opacity-[70%]"
            }`}
          >
            {props.roomState.rooms[0].role}
          </div>
        </div>
      </div>
      <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
    </div>
  );
};

const ParticipantUser = (props: any) => {
  // //console.log("participants:    ", props);
  const role = props.roomState.rooms[0].role;
  return (
    <div
      key={props.key}
      className="w-full h-full flex-wrap justify-around items-center"
    >
      <div className="w-full h-full flex p-[auto] items-center justify-start">
        <img
          className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px] mr-[25px]"
          src={props.roomState.image}
          alt={""}
        />

        <div className=" text-black dark:text-white w-full h-full flex items-center">
          {props.roomState.username}
        </div>
        <div className="w-[20%] h-full flex items-center justify-around">
          <div
            className={`w-[70px] h-[30px] text-white rounded-[25px] bg-[#6F37CF] text-center flex justify-center items-center ${
              role === "OWNER" ? "opacity-[100%]" : "opacity-[70%]"
            }`}
          >
            {props.roomState.rooms[0].role}
          </div>
        </div>
      </div>
      <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
    </div>
  );
};

const ParticipantsNumber = (props: any) => {
  const encodedData = encodeURIComponent(props.roomState.room.id);
  if (encodedData) {
    const [display, setDisplay] = useState(true);

    const formRef = useRef(null);

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: any) => {
      setInputValue(e.target.value);
    };

    const handleSubmit = (e: any) => {
      e.preventDefault();
      props.socket.emit("changePassword", [
        props.roomState.room.id,
        inputValue,
      ]);
      setInputValue("");
    };

    const handleKeyPress = (e: any) => {
      if (e.key === "Enter") {
        // Trigger form submission when the Enter key is pressed
        handleSubmit(e);
        setDisplay(true);
      }
    };
    const maxLength = 15;

    return (
      <div className="w-full h-full flex-wrap justify-center">
        <div className="w-full h-full flex justify-around items-center">
          <div className="dark:text-white">Participants:</div>
          <div className="dark:text-white">
            {props.roomState.participants.length}
          </div>
          {props.roomState.role !== "USER" && (
            <div>
              <Link to={`/chat/bannedUsers/?id=${encodedData}`}>
                <img className="w-[30px] h-[30px] " src={BannedUsers} alt="" />
              </Link>
            </div>
          )}

          {props.roomState.role === "OWNER" &&
            props.roomState.room.visibility == "protected" && (
              <div>
                <button
                  onClick={() => {
                    setDisplay(!display);
                  }}
                  className={`flex items-center justify-center w-[25px] rounded-full ${
                    !display ? "mt-[26px]" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.94 4.99939L19.001 10.0604L18.0394 11.022C17.8618 11.0074 17.6823 11 17.501 11C13.9111 11 11.001 13.9101 11.001 17.5C11.001 17.6813 11.0084 17.8608 11.023 18.0384L9.06283 19.9985C8.78596 20.2753 8.44162 20.4752 8.06386 20.5782L2.94817 21.9734C2.38829 22.1261 1.87456 21.6123 2.02726 21.0525L3.42244 15.9368C3.52547 15.559 3.7253 15.2147 4.00217 14.9378L13.94 4.99939ZM21.0312 2.96948C22.4286 4.36695 22.4286 6.63268 21.0312 8.03014L20.061 8.99939L15 3.93939L15.9705 2.96948C17.368 1.57202 19.6337 1.57202 21.0312 2.96948ZM14.2792 13.9754C14.5939 15.0656 13.9396 16.1991 12.838 16.4716L12.2538 16.6161C12.2089 16.9038 12.1855 17.199 12.1855 17.4998C12.1855 17.8145 12.2111 18.123 12.2601 18.4232L12.7996 18.5532C13.9121 18.8211 14.5734 19.9661 14.2496 21.0636L14.0633 21.6949C14.5024 22.0805 15.0029 22.3937 15.5474 22.6165L16.0407 22.0977C16.8293 21.2685 18.1515 21.2687 18.9398 22.0982L19.4385 22.623C19.9821 22.4027 20.4821 22.0925 20.9213 21.7101L20.7233 21.0242C20.4085 19.9339 21.0629 18.8005 22.1645 18.528L22.7482 18.3835C22.7931 18.0958 22.8165 17.8006 22.8165 17.4998C22.8165 17.1851 22.7909 16.8765 22.7418 16.5762L22.2029 16.4464C21.0904 16.1785 20.4291 15.0335 20.7529 13.9359L20.9391 13.3051C20.4999 12.9193 19.9995 12.6061 19.4549 12.3833L18.9618 12.9018C18.1732 13.7311 16.8509 13.7309 16.0627 12.9013L15.5639 12.3765C15.0203 12.5967 14.5204 12.9068 14.0811 13.2892L14.2792 13.9754ZM17.501 18.9998C16.7004 18.9998 16.0513 18.3282 16.0513 17.4998C16.0513 16.6714 16.7004 15.9998 17.501 15.9998C18.3016 15.9998 18.9507 16.6714 18.9507 17.4998C18.9507 18.3282 18.3016 18.9998 17.501 18.9998Z"
                      fill="#8F8F8F"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    display ? "hidden" : ""
                  } w-[150px] z-10 flex items-center bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white rounded-[15px] text-black shadow-xl  dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]`}
                >
                  <ul className="w-full flex flex-col items-center text-center">
                    <li className="w-full h-full rounded-[15px] hover:bg-[#6F37CF]">
                      <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="w-full h-full rounded-[15px]"
                      >
                        <input
                          type="password"
                          placeholder="change password"
                          maxLength={maxLength}
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPress}
                          className="
                                    w-full h-full bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white text-center"
                        />
                        <button
                          type="submit"
                          style={{ display: "none" }}
                        ></button>
                      </form>
                      {/* <button onClick={() => setDisplay(true)}>Change Password</button> */}
                    </li>
                  </ul>
                </div>
              </div>
            )}
        </div>
        <hr className=" w-[90%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
      </div>
    );
  }
};

const RoomSettings = (props: any) => {
  const userId = props.userId;
  const socket = props.socket;

  const navigate = useNavigate();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get("id");

  const [roomState, setRoomState] = useState<any>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/roomSettings/${receivedData}`,
          {
            params: {
              userId: userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200) {
          setRoomState(response.data);
        }
      } catch (error) {
        navigate("/chat", { replace: true });
      }
    };
    fetchData();

    function joinedListener() {
      fetchData();
    }
    socket.on("joinedChatRoom", joinedListener);
    socket.on("banned", (bannedId: string) => {
      if (userId === bannedId) {
        const path: string =
          "http://localhost:5173/chat/roomSettings/?id=" + receivedData;
        if (window.location.href === path && props.userId === bannedId) {
          navigate("/chat", { replace: true });
        }
      } else {
        fetchData();
      }
    });
    socket.on("muted", () => {
      fetchData();
    });
    socket.on("unmuted", () => {
      fetchData();
    });
    socket.on("promoted", () => {
      fetchData();
    });
    socket.on("demoted", () => {
      fetchData();
    });
    socket.on("ownership", () => {
      fetchData();
    });

    function leftFunc(left: string) {
      if (userId === left) {
        navigate("/chat", { replace: true });
      } else {
        fetchData();
      }
    }

    socket.on("leftRoom", leftFunc);

    socket.on("kicked", (kickedId: string) => {
      if (userId === kickedId) {
        const path: string =
          "http://localhost:5173/chat/roomSettings/?id=" + receivedData;
        if (window.location.href === path && props.userId === kickedId) {
          navigate("/chat", { replace: true });
        }
      } else {
        fetchData();
      }
    });

    return () => {
      socket.removeListener("joinedChatRoom", joinedListener);
    };
  }, []);

  if (roomState) {
    const handleSubmit = (e: any) => {
      e.preventDefault();
      if (roomState.role !== "OWNER") {
        socket.emit("leaveRoom", roomState.room.id);
        setIsButtonDisabled(true);
      }
    };
    // //console.log("roomStte: ", roomState);
    return (
      <div className="lg:w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-y-scroll bg-npc-gray h-[86vh] flex flex-col justify-between shadow-xl">
        <div className="w-full h-full flex-wrap">
          <div className="w-full h-[15%] border-solid mb-[25px] flex items-center">
            <GroupBar roomState={roomState} socket={props.socket} />
          </div>
          <div className="w-full h-[10%] mt-[25px] flex-wrap">
            <ParticipantsNumber roomState={roomState} socket={props.socket} />
          </div>
          <div className="w-full h-[10%] mt-[25px] flex-wrap">
            {roomState.participants.map((participant: any) => {
              if (roomState.role === "USER") {
                return (
                  <div key={participant.id} className="w-full h-full overflow-y-scroll">
                    {
                      <ParticipantUser
                        index={participant.id}
                        roomState={participant}
                        userId={props.userId}
                        role={roomState.role}
                      />
                    }
                  </div>
                );
              } else if (roomState.role === "OWNER") {
                return (
                  <div key={participant.id} className="w-full h-full">
                    {
                      <ParticipantOwner
                        index={participant.id}
                        roomState={participant}
                        userId={props.userId}
                        role={roomState.role}
                        socket={props.socket}
                      />
                    }
                  </div>
                );
              } else if (
                roomState.role === "ADMIN" &&
                participant.rooms[0].role === "USER"
              ) {
                return (
                  <div key={participant.id} className="w-full h-full">
                    {
                      <ParticipantAdmin
                        index={participant.id}
                        roomState={participant}
                        userId={props.userId}
                        role={roomState.role}
                        socket={props.socket}
                      />
                    }
                  </div>
                );
              } else if (
                roomState.role === "ADMIN" &&
                participant.rooms[0].role !== "USER"
              ) {
                return (
                  <div key={participant.id} className="w-full h-full">
                    {
                      <ParticipantAdmin1
                        index={participant.id}
                        roomState={participant}
                        userId={props.userId}
                        role={roomState.role}
                        socket={props.socket}
                      />
                    }
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className=" w-full h-auto flex justify-center items-start mt-[-50px]">
          {roomState.role !== "OWNER" && (
            <button
              type="submit"
              disabled={isButtonDisabled}
              onClick={handleSubmit}
              className={`w-16 h-auto bg-[#D7385E]  text-white rounded-2xl hover:shadow-2xl ${
                isButtonDisabled
                  ? "opacity-[50%] hover:shadow-none"
                  : "enabled-button"
              }`}
            >
              Leave Group
            </button>
          )}
          {roomState.role === "OWNER" && (
            <button
              type="submit"
              disabled={roomState.role === "OWNER"}
              onClick={handleSubmit}
              className={`w-16 h-auto bg-gray-600  text-white rounded-2xl hover:shadow-none`}
            >
              Leave Group
            </button>
          )}
        </div>
      </div>
    );
  }
};
export default RoomSettings;