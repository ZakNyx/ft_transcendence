import logoImg from "../../../images/panda.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const JoinRoomButton = (props: any) => {
  const [display, setDisplay] = useState(true);
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toggleDiv = () => {
    setDisplay(!display);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent the form from submitting traditionally

    setIsButtonDisabled(true);
    if (props.group.visibility === "protected") {
      props.socket.emit("joinRoom", {
        visibility: "protected",
        password: password,
        roomId: props.group.id,
        userId: props.userId,
        joinDate: new Date(),
      });
    } else {
      props.socket.emit("joinRoom", {
        visibility: "public",
        password: password,
        roomId: props.group.id,
        userId: props.userId,
        joinDate: new Date(),
      });
    }
    setIsButtonDisabled(false);
  };

  return (
    <div className="icon w-full h-full">
      <div className="icon w-full h-12 flex justify-around items-center">
        <div className="w-full h-full flex justify-around items-center">
          <img
            className="logoImg rounded-3xl w-[40px] h-[40px]"
            src={
              props.group.image
                ? `data:image/jpeg;base64,${props.group.image}`
                : logoImg
            }
            alt={""}
          />

          <div className="groupName text-gray-200 w-[50%] ml-4 font-semibold text-sm md:text-base">
            {props.group.RoomName}
          </div>
        </div>
        <div className="w-[25%] h-full ">
          <form
            onSubmit={handleSubmit}
            className="w-full h-full mt-1.5 ml-11 flex-wrap"
          >
            <button
              type="submit"
              disabled={isButtonDisabled}
              onClick={toggleDiv}
              className={`date w-12 h-8 bg-npc-purple hover:bg-purple-hover text-sm base:text-md text-gray-200 rounded-md ml-[-65px] hover:shadow-lg transition-all ${
                isButtonDisabled
                  ? "bg-[#9d88c0] hover:shadow-none"
                  : "enabled-button"
              }`}
            >
              Join
            </button>
            {props.group.visibility === "protected" && !display && (
              
              <div
                className={`${display} w-32 h-8 ml-[-80px] mt-[15px] rounded-xl p-4 bg-[#1A1C26] flex items-center`}
              >
                <input
                  // required
                  id="i"
                  type="password"
                  placeholder="Password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  className={` ${display} w-full h-5 bg-[#1A1C26]  text-white text-center placeholder:text-sm placeholder:text-gray-200`} 
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

function ExistinRoom(props: any) {
  return (
    <div
      key={props.index}
      className="w-4/6 max-h-[100px] m-auto my-10 p-auto border-3 
     bg-npc-gray shadow-xl"
    >
      <JoinRoomButton
        group={props.groupsList}
        socket={props.socket}
        userId={props.userId}
      />
    </div>
  );
}

export default function JoinRoom(props: any) {
  const userId = props.userId;
  const [rooms, setRooms] = useState<any>(null);

  const token = Cookies.get("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/chat/groupsList",
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
          setRooms(response.data);
        }
      } catch (error) {
        navigate("/chat", { replace: true });
      }
    };
    fetchData();
    props.socket.on("createdRoom", () => {
      fetchData();
    });
    props.socket.on("joinedChatRoom", () => {
      fetchData();
    });
    props.socket.on("unbanned", () => {
      fetchData();
    });
    props.socket.on("kicked", () => {
      fetchData();
    });

    return () => {
      // props.socket.off('joinedChatRoom')
    };
  }, []);

  if (rooms) {
    return (
      <div className="w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl bg-npc-gray h-[86vh] shadow-xl">
        <div className="w-full h-full flex-wrap justify-center mt-3">
          <div className="w-full h-1/12 m-1 flex items-center justify-center text-gray-200 text-center font-bold text-xl md:text-3xl">
            Join a Room
          </div>
          <hr className="w-3/4 h-1 mx-auto mb-2 bg-gray-600 opacity-10" />
          <div className="h-11/12 convs my-4 overflow-y-scroll">
            {rooms.map((room: any, index: number) => (
              <ExistinRoom
                key={index}
                index={room.id}
                groupsList={room}
                socket={props.socket}
                userId={userId}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
