import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";

interface PropsType {
  userId: string;
  socket: Socket;
}

const DmRoomButton = (props: any) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState<any>(false);

  const token = Cookies.get("token");

  const handleButtonClick = () => {
    // console.log('emitting the server backend with this socket.id : ', props.socket.id);
    // console.log(`check userId before emitting createDM : ${props.userData.userData.username}`);
    props.socket.emit("createDm", {
      senderId: props.userData.userId,
      receiverName: props.userData.userData.username,
      token: token,
    });
    setIsButtonDisabled(true);
  };

  return (
    <div className="icon w-[95%] h-full flex-wrap m-auto">
      <div className="icon w-full h-[50px] flex items-center">
        <div className="w-full h-full flex items-center">
          <img
            className="logoImg rounded-[40px] w-[40px] h-[40px]"
            src={props.userData.userData.image}
            alt={""}
          />

          <div
            className="groupName text-gray-200 text-sm md:text-base w-full ml-6"
          >
            {props.userData.userData.username}
          </div>
        </div>
        <Link
          to="/pvf"
          onClick={() => {
            props.socket.emit("gameInvite", {
              id: props.userData.userData.userId,
              type: "gameInvite",
            });
          }}
          className={`w-16 h-7 rounded-md mr-4 bg-npc-purple hover:shadow-lg ${
            props.userData.userData.Status === "online"
              ? ""
              : "pointer-events-none"
          }`}
        >
          <div
            className="w-full h-full  text-gray-200 text-center mt-0.5"
          >
            Play
          </div>
        </Link>
        <button
          // to="/chat/dmConv/"
          type="button"
          disabled={isButtonDisabled}
          onClick={handleButtonClick}
          className={`w-16 h-7 bg-npc-purple hover:bg-purple-hover active:bg-purple-active transition-all rounded-md shadow-xl ${
            isButtonDisabled
              ? "bg-[#9d88c0] hover:shadow-none"
              : "enabled-button"
          }`}
        >
          <div
            className="w-full h-full text-gray-200 text-center mt-1 text-sm"
          >
            DM
          </div>
        </button>
      </div>
    </div>
  );
};

function ExistinUser(userData: any) {
  return (
    // The user container
    <div
      key={userData.index}
      className="w-[350px] max-h-[80px] m-auto my-[40px] p-auto border-3 rounded-[25px] border-solid
     bg-npc-gray shadow-2xl"
    >
      <DmRoomButton userData={userData} socket={userData.socket} />
    </div>
  );
}

export default function AddPeople(props: PropsType) {
  const socket = props.socket;
  const userId = props.userId;
  const [addUsers, setAddUsers] = useState<any>(null);

  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/chat/addPeople",
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
          console.log("check response : ", response.data);
          setAddUsers(response.data);
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
        navigate("/chat", { replace: true });
      }
    };
    fetchData();

    socket.on("dmDeleted", () => {
      fetchData();
    });
    socket.on("blocked", () => {
      fetchData();
    });
    socket.on("unblocked", () => {
      fetchData();
    });
    props.socket.on("createdDm", () => {
      fetchData();
    });

    return () => {
      socket.off("createdDm");
      socket.off("unblocked");
      socket.off("blocked");
      socket.off("dmDeleted");
    };
  }, []);

  if (addUsers) {
    return (
      <div className="lg:w-2/3 lg:h-5/6 ml-0 mr-4 my-4 rounded-xl bg-[#232429]">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-full h-1/12 m-1 flex items-center justify-center text-gray-200 text-center font-bold text-xl md:text-3xl">
            Create a Conversation
          </div>
          <hr className="w-3/4 h-1 mx-auto mb-2 bg-npc-purple opacity-15 border-0 rounded dark:opacity-10" />
          <div className="h-11/12 convs my-4 overflow-y-scroll">
            {addUsers.map((user: any, index: number) => (
              <ExistinUser
                key={index}
                index={user.id}
                userData={user}
                userId={userId}
                socket={socket}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
