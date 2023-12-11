import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const InvToRoomButton = (props: any) => {
  //console.log("props:=-------------", props);
  //console.log("props userId d invitee:=-------------", props.dataState.dataState.userId);
  //console.log("props userId d sender:=-------------", props.dataState.userId);
  //console.log("props: roomId=-------------", props.dataState.roomId);
  const [isButtonDisabled, setIsButtonDisabled] = useState<any>(false);
  const [display, setDisplay] = useState<any>(true);

  const toggleDiv = () => {
    setDisplay(!display);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent the form from submitting traditionally

    props.dataState.socketId.emit("roomInvite", {
      invitee: props.dataState.dataState.userId,
      senderId: props.dataState.userId,
      roomId: props.dataState.roomId,
      notifId: null,
    });

    setIsButtonDisabled(true);
  };

  return (
    <div className="icon w-[95%] h-full flex-wrap m-auto">
      <div className="icon w-full h-[50px] flex items-center">
        <div className="w-full h-full flex items-center">
          <img
            className="logoImg rounded-[40px] w-[40px] h-[40px]"
            src={props.dataState.dataState.picture}
            alt={""}
          />

          <div
            className="groupName text-white w-full ml-[20px]"
          >
            {props.dataState.dataState.displayname}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button
            // here we need to send a notif to the user and desactivate the click button for him once he clicks waiting for the feedback
            type="submit"
            disabled={isButtonDisabled}
            onClick={toggleDiv}
            className={`w-[50px] h-[30px] bg-npc-purple hover:bg-purple-hover rounded-xl text-sm mr-[10px] hover:dark:shadow-lg hover:shadow-lg ${isButtonDisabled} ? 'bg-npc-gray hover:shadow-none' : 'enabled-button' `}
          >
            <div
              className="w-full h-full text-gray-200 text-center mt-[5px]"
            >
              Invite
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

function ExistinUser(props: any) {
  return (
    <div
      key={props.index}
      className="w-[350px] max-h-[80px] m-auto my-[40px] p-auto border-3 rounded-2xl border-solid
     bg-npc-gray shadow-xl dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]"
    >
      <InvToRoomButton dataState={props} />
    </div>
  );
}

export default function invToRoom(props: any) {
  const userId = props.userId;
  // const socket = props.socket;

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get("id");

  const [dataState, setDataState] = useState<any>(null);

  const token = Cookies.get("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/invToRoom/${receivedData}`,
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
          setDataState(response.data);
        }
      } catch (error) {
        navigate("/chat", { replace: true });
      }
    };

    fetchData();

    props.socket.on("blocked", () => {
      fetchData();
    });
    props.socket.on("unblocked", () => {
      fetchData();
    });
    props.socket.on("banned", () => {
      fetchData();
    });
    props.socket.on("unbanned", () => {
      fetchData();
    });
    props.socket.on("kicked", () => {
      fetchData();
    });
    props.socket.on("leftRoom", () => {
      fetchData();
    });
    props.socket.on("joinedChatRoom", () => {
      fetchData();
    });

    return () => {
      //   socket.off('joinedChatRoom')
      //   socket.off('leftRoom')
      //   socket.off('kicked')
      //   socket.off('unbanned')
      //   socket.off('banned')
      //   socket.off('unblocked')
      //   socket.off('blocked')
    };
  }, []);

  if (dataState) {
    return (
      <div className="w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-y-scroll bg-npc-gray h-[86vh] flex flex-col justify-between shadow-xl">
        <div className="w-full h-full flex-wrap justify-center">
          <div className="w-full h-1/12 m-1 flex items-center justify-center text-gray-200 text-center font-bold text-xl md:text-3xl">
            Join a Room
          </div>
          <hr className=" w-[50%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
          <div className="h-[88%] convs  overflow-y-scroll">
            {dataState.map((users: any, index: number) => (
              <ExistinUser
                key={index}
                index={users.id}
                dataState={users}
                socketId={props.socket}
                roomId={Number(receivedData)}
                userId={props.userId}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}