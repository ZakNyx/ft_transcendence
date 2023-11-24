import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import ChatUserProfile from "./ChatUserProfile";

const ContactBar = (barData: any) => {
  return (
    <div className="w-full h-full p-[20px] flex-wrap items-center justify-center">
      <div className="w-full h-full flex items-center justify-start">
        <Popup
          trigger={
            <img
              className="logoImg rounded-full mt-5 w-[50px] h-[50px] flex items-center"
              src={barData.barData.participants[0].image}
              alt={""}
            />
          }
          modal
        >
          {
            // @ts-ignore
            (close) => (
              <ChatUserProfile
                close={close}
                userId={barData.barData.participants[0].userId}
              />
            )
          }
        </Popup>

        <div className="w-full h-full ml-[55px] flex justify-around items-center">
          <div
            className=" text-white w-full flex items-center text-md lg:text-xl mt-5"
          >
            {barData.barData.participants[0].displayname}
          </div>
          {/* <div> */}
          <Link
            to="/pvf"
            onClick={() => {
              barData.socket.emit("gameInvite", {
                id: barData.barData.participants[0].userId,
                type: "gameInvite",
              });
            }}
            // to="/chat/dmConv"
            className={` bg-npc-purple hover:bg-purple-hover   transition-all rounded-xl mr-3 hover:dark:shadow-lg hover:shadow-lg mt-5 pb-1`}
          >
            <div
              className="w-full h-full text-white text-center mt-[5px] text-sm"
            >
              Invite Game
            </div>
          </Link>
        </div>
      </div>
      <hr className=" w-[90%] h-[1px] my-[15px] bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%] flex justify-center"></hr>
    </div>
  );
};

const Mssg = (msgData: any) => {
  if (msgData.msgData.senderId !== msgData.userId) {
    return (
      <div key={msgData.index} className="max-w-[60%] max-h-[60%] m-[15px]">
        <div className="w-full h-full">
          <div className=" w-[15px] h-[15px] mt-[15px] rounded-full bg-[#181616]"></div>
          <div
            className="p-[10px] ml-[15px] mt-[10px] max-w-[60%] text-sm md:text-base  w-fit h-fit rounded-3xl bg-[#181616] text-left text-white text-clip overflow-hidden"
          >
            {msgData.msgData.messageContent}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="w-[100%] max-h-[90%] m-[15px] ml-[-30px] 
        "
      >
        <div className="w-full h-full flex flex-row-reverse justify-start ml-[20px]">
          <div className=" w-[15px] h-[15px] mt-[15px%] bg-[#6F37CF] rounded-full"></div>
          <div
            className="p-[10px] text-sm md:text-base mt-[10px] max-w-[60%] h-fit rounded-3xl bg-[#6F37CF] text-left text-white text-clip"
          >
            {msgData.msgData.messageContent}
          </div>
        </div>
      </div>
    );
  }
};

const DMConveComponent = (props: any) => {
  const maxLength = 500;

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [dataState, setDataState] = useState<any>(null);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get("id");

  const [message, setMessage] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    if (receivedData) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/chat/dms/${receivedData}`,
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
          navigate("/chat", { replace: true });
        }
      };

      fetchData();

      props.socket.on("dmDeleted", () => {
        const path: string =
          "http://localhost:5173/chat/dmConv/?id=" + receivedData;
        if (window.location.href === path) {
          navigate("/chat", { replace: true });
        }
      });

      props.socket.on("blocked", () => {
        const path: string =
          "http://localhost:5173/chat/dmConv/?id=" + receivedData;
        if (window.location.href === path) {
          navigate("/chat", { replace: true });
        }
      });

      props.socket.on("unblocked", () => {
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
      };
    }
  }, [receivedData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (props.socket && message.trim() !== "") {
      props.socket.emit("sendMessage", {
        messageContent: message,
        dmId: Number(receivedData),
        senderId: props.userId,
        roomId: null,
        sentAt: new Date(),
      });
      setMessage("");
    }
  };

  if (dataState) {
    return (
      <div className="lg:w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-hidden bg-npc-gray h-[86vh] flex flex-col justify-between shadow-xl" >
  <div className="w-full h-12 border-solid mb-5">
    <ContactBar barData={dataState.dm} userId={props.userId} socket={props.socket} />
  </div>
  <div className="w-full h-[calc(80vh - 64px)] overflow-hidden overflow-y-scroll" ref={containerRef}>
    {dataState.dm.msg.map((element: any, index: any) => (
      <Mssg key={index} index={element.id} msgData={element} userId={props.userId} />
    ))}
  </div>
  <div className="w-90 h-20 flex items-center justify-between mx-auto">
    <img className="logoImg rounded-3xl w-12 h-12 ml-2 mr-4 mb-1.5" src={dataState.image.image} alt="" />
    <form onSubmit={handleSubmit} className="flex-grow flex items-center w-full">
      <input
        type="text"
        maxLength={maxLength}
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-full bg-[#1A1C26] text-white rounded-3xl border border-gray-500 active:border-gray-700 pl-2 text-sm focus:outline-none"
      />
      <button
        type="submit"
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
          className="w-6 h-6 text-[#6F37CF]"
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

export default DMConveComponent;
