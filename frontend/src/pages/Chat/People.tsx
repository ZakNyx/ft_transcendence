import DMComp from "./DM.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function DMsComponent(props: any) {
  const [dmData, setDmData] = useState<any>(null);

  const token = Cookies.get("token");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/chat/dms", {
          params: {
            userId: props.userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setDmData(response.data);
        }
      } catch (error) {
        navigate("/chat", { replace: true });
      }
    };

    fetchData();

    props?.socket?.on("dmDeleted", () => {
      fetchData();
    });
    props?.socket?.on("createdDm", () => {
      fetchData();
    });
    props?.socket?.on("createdMessage", () => {
      fetchData();
    });
    props?.socket?.on("blocked", () => {
      fetchData();
    });
    props?.socket?.on("unblocked", () => {
      fetchData();
    });

    return () => {
      props.socket.off("unblocked");
      props.socket.off("blocked");
      props.socket.off("createdMessage");
      props.socket.off("createdDm");
      props.socket.off("dmDeleted");
    };
  }, []);

  if (dmData) {
    return (
      <div className="rounded-xl flex-wrap dark:bg-npc-gray">
        <div className="group ml-6 text-gray-200 flex justify-between items-center ">
          <div className="font-bold text-base md:text-xl  mt-2">Friends</div>
          <div className="w-full h-[45px] flex flex-col items-end">
            <Link
              to="addpeople"
              className="flex items-center justify-center bg-npc-purple hover:bg-purple-hover text-white font-bold h-6 w-6 rounded-full m-3 mt-4"
            >
              +
            </Link>
          </div>
        </div>
        <div className="h-[85%] overflow-y-scroll my-[15px] ml-[10px]">
          {dmData.map((dmItem: any, index: number) => (
            <DMComp
              key={index}
              index={dmItem.id}
              dmData={dmItem}
              userId={props.userId}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DMsComponent;
