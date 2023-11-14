import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';


const UnbanButton = (props:any) => {
  
    //console.log("props:=-------------", props);
    // console.log("props userId d invitee:=-------------", props.dataState.dataState.userId);
    // console.log("props userId d sender:=-------------", props.dataState.userId);
    // console.log("props: roomId=-------------", props.dataState.roomId);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [display, setDisplay] = useState(true);
  
  
    const toggleDiv = () => {
      setDisplay(!display);
    };
  
    const handleSubmit = (e:any) => {
      e.preventDefault(); // Prevent the form from submitting traditionally
  
      setIsButtonDisabled(true);
        props.dataState.socketId.emit('unban', 
        {
            userId: props.dataState.userId,
            subjectId: props.dataState.dataState.userId, 
            roomId: props.dataState.roomId,
        })
        setIsButtonDisabled(false);
      
    };
  
    return (
      <div className="icon w-[95%] h-full flex-wrap m-auto">
        
        <div className="icon w-full h-[50px] flex items-center">
          <div className="w-full h-full flex items-center">
            <img
              className="logoImg rounded-[40px] w-[40px] h-[40px]"
              src={props.dataState.dataState.image}
              alt={""}
            />
  
            <div
              className="groupName text-black dark:text-white w-full ml-[20px]"
              style={{
                fontFamily: "poppins",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "0.75px",
              }}
            >
              {props.dataState.dataState.username}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}>
            <button 
              // here we need to send a notif to the user and desactivate the click button for him once he clicks waiting for the feedback
              type='submit'
              disabled={isButtonDisabled}
              onClick= { toggleDiv }
              className={`w-[50px] h-[30px] bg-[#6F37CF] rounded-[25%] mr-[10px] hover:dark:shadow-lg hover:shadow-lg ${isButtonDisabled} ? 'bg-[#9d88c0] hover:shadow-none' : 'enabled-button' `}
              >
                <div className="w-full h-full text-white text-center mt-[5px]"
                style={{
                  fontFamily: "poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  letterSpacing: "0.13px",
                  }}>
  
                  Unban
                </div>
            </button>
          </form>
        </div>
      </div>
    );
  };
  

function BannedUser(props:any) {
    return (
      <div key={props.index} className='w-[350px] max-h-[80px] m-auto my-[40px] p-auto border-3 rounded-[25px] border-solid bg-[#EEEEFF]
       dark:bg-[#1A1C26] shadow-xl dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]'>
        <UnbanButton dataState={props}/>
      </div>
    )
  
  }

function BannedList (props:any)
{
    const socket = props.socket;

    const navigate = useNavigate();
  
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get('id');

  const token = Cookies.get('accessToken');


  //console.log("oprps in banned list", props);
    const [banData, setBanData] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/chat/bannedUsers/${receivedData}`, {
              params: {
                userId: props.userId,
              },
                headers: {
                  Authorization: `Bearer ${token}`,
            },
          });
            if (response.status === 200) {
                setBanData(response.data)
            }
          } catch (error) {
            navigate('/chat' , {replace: true});
          }
        };
       

        fetchData();
        socket.on('unbanned', () => {
            fetchData();
        })

        socket.on('banned', (bannedId: string) => {
          if (props.userId === bannedId)
            {
                navigate('/chat', {replace: true});
            }
            else
            {
                fetchData();
            }
        })

        return (() => {
          socket.off('banned')
          socket.off('unbanned')
        })
    }, []);

    if (banData)
    {
        return (
            <div
            className="lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
            ml-[-10px] mr-[15px] my-[15px] w-[50%] h-[88%] rounded-[25px] flex-2 flex-shrink-0 border-solid border-[#FFFFFF] bg-[#FFFFFF]  shadow-none flex-wrap dark:border-[#272932] dark:bg-[#272932]"
            >
                <div className='w-full h-full flex-wrap justify-center'>
                <div className="w-full h-[10%] m-[1px] flex items-center justify-center text-black dark:text-white text-center" style={{
                        fontFamily: "poppins",
                        fontSize: "25px",
                        fontStyle: "normal",
                        fontWeight: 900,
                        letterSpacing: "1.5px",
                    }} >
                   Banned Users
                </div>
                <hr className=" w-[50%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]">
                </hr>
                <div className="h-[88%] convs  overflow-y-scroll">
                {
                    banData.map((users: any, index: number) => (
                        < BannedUser key={index} index={users.id} dataState={users} socketId={socket} roomId={Number(receivedData)} userId={props.userId}/>
                ))
                }
            
                </div>
                </div>
                
            </div>
        );
    }

}

export default BannedList;