import logoImg from "../../../public/images/panda.svg"
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";



const JoinRoomButton = (props: any) => {
  // console.log("here: ----", props)
  const [display, setDisplay] = useState(true);
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toggleDiv = () => {
    setDisplay(!display);
  };


  const handleSubmit = (e:any) => {
    e.preventDefault(); // Prevent the form from submitting traditionally

    setIsButtonDisabled(true);
    if (props.group.visibility === 'protected') {
      props.socket.emit('joinRoom', {visibility: "protected", password: password, roomId: props.group.id, userId: props.userId, joinDate: new Date()})
    } else {
      props.socket.emit('joinRoom', {visibility: "public", password: password, roomId: props.group.id, userId: props.userId, joinDate: new Date()})
    }
    setIsButtonDisabled(false);
    
  };

  return (
    <div className="icon w-full h-full">
      <div className="icon w-full h-[55px] flex justify-around items-center">
        <div className="w-full h-full flex justify-around items-center">
          <img
            className="logoImg rounded-[50px] w-[40px] h-[40px]"
            src={ props.group.image ? `data:image/jpeg;base64,${props.group.image}`  : logoImg}
            alt={""}
          />

          <div
            className="groupName text-black dark:text-white w-[50%] ml-[20px]"
            style={{
              fontFamily: "poppins",
              fontSize: "15px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              letterSpacing: "0.75px",
            }}
          >
            { props.group.RoomName }
          </div>
        </div>
        <div className="w-[20%] h-full">
          <form onSubmit={handleSubmit}
            className="w-full h-full mt-[12px] ml-[50px] flex-wrap">
            <button 
              type='submit'
              disabled={isButtonDisabled}
              onClick= { toggleDiv }
              className={`date w-[50px] h-[30px] bg-[#6F37CF]  text-white rounded-[25%] ml-[-65px] hover:shadow-lg ${isButtonDisabled ? 'bg-[#9d88c0] hover:shadow-none' : 'enabled-button'}`}
              style={{
                fontFamily: "poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "0.13px",
              }}
            >
            Join
            </button>
            {
              props.group.visibility === "protected" && !display &&
              (
                <div className={`${display} w-[100px] h-[30px] ml-[-80px] mt-[15px] rounded-[25px] p-[15px] dark:bg-[#1A1C26] bg-[#EEEEFF] flex items-center`}>
                  <input 
                    // required
                    id="i" 
                    type="password" 
                    placeholder="password"
                    onChange={(e:any) => setPassword(e.target.value)}
                    className={` ${display} w-full h-[20px] dark:bg-[#1A1C26] bg-[#EEEEFF] dark:text-white text-black text-center`}
                    style={{
                      fontFamily: "poppins",
                      fontSize: "11px",
                      fontStyle: "normal",
                      letterSpacing: "1.5px",
                      }}/>

                </div>
              )
            }
          </form>
        </div>
      </div>
    </div>
  );
};

function ExistinRoom(props: any) {
  return (
    <div key={props.index} className='w-[350px] max-h-[100px] m-auto my-[40px] p-auto border-3 rounded-[25px] border-solid bg-[#EEEEFF]
     dark:bg-[#1A1C26] shadow-xl dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]'>
      <JoinRoomButton group={props.groupsList} socket={props.socket} userId={props.userId}/>
    </div>
  )

}


export default function JoinRoom(props: any) {
  const userId = props.userId;
  const [rooms, setRooms] = useState<any>(null); 

  const token = Cookies.get('accessToken');

  const navigate = useNavigate();


  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chat/groupsList', {
        params: {
          userId: props.userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setRooms(response.data);
    }
    } catch (error) {
      navigate('/chat' , {replace: true});
    }
  };
      fetchData();
      props.socket.on("createdRoom", () =>{
        fetchData();
  
      })
      props.socket.on("joinedChatRoom", () =>{
        fetchData();
      })
      props.socket.on("unbanned", () =>{
        fetchData();
      })
      props.socket.on("kicked", () =>{
        fetchData();
      })

      return(() => {
        // props.socket.off('joinedChatRoom')
      })
    }, []);

    if (rooms)
    {
      return (
        <div className="lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:dark:border-[#272932] lg:dark:bg-[#272932]
            ml-[-10px] mr-[15px] my-[15px] w-[55%] h-[88%] rounded-[25px] flex-2 flex-shrink-0 border-solid border-[#FFFFFF] bg-[#FFFFFF] flex flex-wrap dark:border-[#272932] dark:bg-[#272932]"
        > 
          <div className='w-full h-full flex-wrap justify-center'>
            <div className="w-full h-[10%] m-[1px] flex items-center justify-center text-black dark:text-white text-center" style={{
                    fontFamily: "poppins",
                    fontSize: "25px",
                    fontStyle: "normal",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                }} >
                  Join Rooms
            </div>
            <hr className=" w-[50%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]">
            </hr>
            <div className="h-[86%] convs my-[20px] overflow-y-scroll">
              {
                  rooms.map((room:any, index: number) => {
                    return (
                      < ExistinRoom key={index} index={room.id} groupsList={room} socket={props.socket} userId={userId}/>
                    )
                })
              }
            </div>
          </div>
          
        </div>
      )
    }
}
