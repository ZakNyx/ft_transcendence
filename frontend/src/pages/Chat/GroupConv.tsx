import { useEffect, useRef, useState } from "react";
import logoImg from "../../../public/images/panda.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ContactBar = (barData: any) => {
  const encodedData = encodeURIComponent(barData.barData.roomId);
  if (encodedData) {
    return (
      <div className="w-[98%] ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-y-scroll flex-wrap justify-center">
        <div className="w-full h-full flex p-[auto] items-center justify-between">
          <img
            className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px]"
            src={
              barData.barData.roomImage
                ? `data:image/jpeg;base64,${barData.barData.roomImage}`
                : logoImg
            }
            alt={""}
          />
          <div className="w-[70%] h-full ml-[20px] flex items-center dark:text-white">
            {barData.barData.roomName ? barData.barData.roomName : ""}
          </div>
          <div className="w-[20%] h-full flex mr-[10px]">
            <div className="w-full h-full flex flex-row justify-end items-center">
              <Link
                to={`/chat/invToRoom/?id=${encodedData}`}
                className="flex items-center justify-center bg-npc-purple hover:bg-purple-hover text-white font-bold h-6 w-6 rounded-full m-3 mb-2 transition-all"
                >
                +
              </Link>
            </div>
            <div className="w-[25px] h-full flex flex-row justify-end items-center">
              <Link to={`/chat/roomSettings/?id=${encodedData}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 dark:text-white text-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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

const Mssg = (msgData: any) => {
  if (msgData.msgData[0].senderId !== msgData.userId) {
    return (
      <div key={msgData.index} className="w-[60%] max-h-[60%] m-[15px] ">
        <div className="w-full h-full flex">
          <img
            className="logoImg rounded-3xl w-[40px] h-[40px]"
            src={msgData.msgData[1] ? msgData.msgData[1] : logoImg}
            alt=""
          />
          <div className="p-[10px] ml-[15px] max-w-[60%] w-fit bg-[#181616] text-left text-gray-200 rounded-3xl text-clip overflow-hidden text-xs md:text-sm break-words whitespace-pre-wrap">
            {msgData.msgData[0].messageContent}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full max-h-[60%] m-[15px] ml-[-10px]">
        <div className="w-full h-full flex flex-row-reverse">
          <img
            className="logoImg rounded-[50px] w-[40px] h-[40px] ml-[10px]"
            src={msgData.msgData[1] ? msgData.msgData[1] : logoImg}
            alt={""}
          />
          <div className="p-[10px] ml-[15px] max-w-[60%] w-fit h-fit bg-[#6F37CF] rounded-3xl dark:bg-[#6F37CF] text-left text-gray-200 text-clip overflow-hidden text-xs md:text-sm break-words whitespace-pre-wrap">
            {msgData.msgData[0].messageContent}
          </div>
        </div>
      </div>
    );
  }
};

const GroupConveComponent = (props: any) => {
  //console.log("userId f conv: ", props);
  // const socket = props.socket;props.

  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const [dataState, setDataState] = useState<any>(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get("id");

  const [message, setMessage] = useState("");

  const token = Cookies.get("token");

  const [componentKey, setComponentKey] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/chat/groups/${receivedData}`,
        {
          params: {
            userId: props.userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        setDataState(response.data);
      }
    } catch (error) {
      console.error("Error fetching data  in groupConv:", error);
      if (!hasNavigated) {
        setHasNavigated(true);
        navigate("/chat", { replace: true });
      }
      setComponentKey((prevKey) => prevKey + 1);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {

    // fetchData();

    props.socket.on("blocked", () => {
      fetchData();
    });

    props.socket.on("unblocked", () => {
      fetchData();
    });

    props.socket.on("kicked", (kickedId: string) => {
      if (props.userId === kickedId) {
        const path: string =
          "http://localhost:5173/chat/groupConv/?id=" + receivedData;
        if (window.location.href === path && props.userId === kickedId) {
          navigate("/chat", { replace: true });
        }
      }
    });

    props.socket.on("banned", (banned: string) => {
      if (props.userId === banned) {
        const path: string =
          "http://localhost:5173/chat/groupConv/?id=" + receivedData;
        if (props.userId === banned && window.location.href === path) {
          navigate("/chat", { replace: true });
        }
      }
    });

    props.socket.on("muted", () => {
      fetchData();
    });

    props.socket.on("unmuted", () => {
      fetchData();
    });

    function messageListener() {
      fetchData();
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 200);
    }
    props.socket.on("createdMessage", messageListener);

    return () => {
      props.socket.removeListener("createdMessage", messageListener);
      props.socket.off("unmuted");
      props.socket.off("muted");
      // socket.off('banned')
      // if (window.location.pathname === "")
      //   socket.off('leftRoom')

      // socket.off('kicked')
      // socket.off('createdRoom')
      // socket.off('unblocked')
      // socket.off('blocked')
    };
  }, [componentKey, receivedData, dataState]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //check this below
    if (props.socket && message.trim() !== "" && dataState) {
      console.log("Sendr id ==== ", props.userId);
      props.socket.emit("sendMessage", {
        messageContent: message,
        dmId: null,
        senderId: props.userId,
        roomId: dataState.roomId,
        sentAt: new Date(),
      });
      setMessage("");
    }
  };

  if (dataState) {
    return (
      <div
        // key={componentKey}
        className="lg:w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-y-scroll bg-npc-gray h-[86vh] flex flex-col justify-between shadow-xl"
      >
        <div className="w-full h-12 border-solid mb-5">
          <ContactBar barData={dataState} />
        </div>
        <div
          className="w-full h-[calc(80vh - 64px)] overflow-hidden overflow-y-scroll"
          ref={containerRef}
        >
          {dataState.msgs.map((msg: any, index: number) => (
            <Mssg
              key={index}
              index={msg.id}
              msgData={msg}
              userId={props.userId}
            />
          ))}
        </div>
        <div className="w-90 h-20 flex items-center justify-between mx-auto">
          <img
            className="logoImg rounded-3xl w-12 h-12 ml-2 mr-4 mb-1.5"
            src={dataState.userImage ? dataState.userImage : logoImg}
            alt={""}
          />
          <form
            onSubmit={handleSubmit}
            className="flex-grow flex items-center w-full"
          >
            <div className="w-full h-full bg-[#EEEEFF]  dark:text-white rounded-[10px]">
              <input
                disabled={dataState.muted}
                type="text"
                placeholder={
                  dataState.muted ? "You're muted :c" : "Type your text.."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-full bg-[#1A1C26] text-white rounded-3xl border border-gray-500 active:border-gray-700 pl-2 text-sm focus:outline-none"
                ></input>
            </div>
            <button
              type="submit"
              disabled={dataState.muted}
              className="w-10 h-full ml-2 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#6F37CF"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#6F37CC]"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  }
};
export default GroupConveComponent;