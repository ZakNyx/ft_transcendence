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
      console.log('first', props.dataState.dataState.userId)
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
              className="groupName text-gray-200 w-full ml-[20px] text-sm md:text-base"
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
              className={`w-[50px] h-[30px] bg-[#6F37CF] rounded-[25%] mr-[10px] hover:shadow-lg ${isButtonDisabled} ? 'bg-[#9d88c0] hover:shadow-none' : 'enabled-button' `}
              >
                <div className="w-full h-full text-gray-300 text-center mt-[5px] text-sm font-thin">
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
      <div key={props.index} className='w-[350px] max-h-[80px] m-auto my-[40px] p-auto border-3 rounded-xl border-solid 
       bg-[#1A1C26] shadow-xl'>
        <UnbanButton dataState={props}/>
      </div>
    )
  
  }

function BannedList (props:any)
{
    // const socket = props.socket;

    const navigate = useNavigate();
  
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get('id');

  const token = Cookies.get('token');


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
        props.socket.on('unbanned', () => {
            fetchData();
        })

        props.socket.on('banned', (bannedId: string) => {
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
          props.socket.off('banned')
          props.socket.off('unbanned')
        })
    }, []);

    if (banData)
    {
        return (
            <div className="w-2/3 ml-6 md:ml-3 mr-4 my-3.5 rounded-xl overflow-y-scroll bg-npc-gray h-[86vh] flex flex-col justify-between shadow-xl">
                <div className='w-full h-full flex-wrap justify-center'>
                <div className="w-full h-[10%] m-[1px] flex items-center justify-center text-gray-200 text-center text-xl md:text-2xl tracking-wider">
                   Banned Users
                </div>
                <hr className=" w-[50%] h-[1px] m-auto border-0 rounded-xl opacity-[10%]">
                </hr>
                <div className="h-[88%] convs  overflow-y-scroll">
                {
                    banData.map((users: any, index: number) => (
                        < BannedUser key={index} index={users.id} dataState={users} socketId={props.socket} roomId={Number(receivedData)} userId={props.userId}/>
                ))
                }
            
                </div>
                </div>
                
            </div>
        );
    }

}

export default BannedList;