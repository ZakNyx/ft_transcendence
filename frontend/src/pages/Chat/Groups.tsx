import  { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Group from './Group.tsx';
import axios from 'axios';
import Cookies from 'js-cookie';

function GroupsComponent(props:any) {

  const userId = props.userId;
  const [convData, setConvData] = useState<any>(null);

  const token = Cookies.get('accessToken');

  const navigate = useNavigate();


  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chat/groups', {
        params: {
          userId: props.userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setConvData(response.data)
    }
    } catch (error) {
      navigate('/chat' , {replace: true});
    }
  };

    fetchData();

    props?.socket?.on("blocked", () => {
      fetchData();
    })
    props?.socket?.on("leftRoom", () => {
      fetchData();
    })
    props?.socket?.on("unblocked", () => {
      fetchData();
    })
    props?.socket?.on("createdRoom", () => {
      fetchData();
    })
    props?.socket?.on("kicked", () => {
      fetchData();
    })
    props?.socket?.on("joinedChatRoom", () => {
      fetchData();
    })
    props?.socket?.on("banned", () => {
      fetchData();
    })
    props?.socket?.on("createdMessage", () => {
      fetchData();
    })
    return ( () => {
      props.socket.off('createdMessage')
      props.socket.off('banned')
      props.socket.off('joinedChatRoom')
      // props.socket.off('createdMessage')
      props.socket.off('kicked')
      props.socket.off('createdRoom')
      props.socket.off('unblocked')
      // props.socket.off('leftRoom')
      props.socket.off('blocked')
    })
  
  }, []);

  const [display, setDisplay] = useState(true);
  if (convData)
  {
      return (
          <div className="lg:w-[90%] lg:h-[32%] lg:rounded-[25px] lg:border-solid lg:flex-wrap lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
          w-[90%] h-[32%] rounded-[25px] border-solid flex-wrap border-[#FFFFFF] bg-[#FFFFFF]  shadow-none dark:border-[#272932] dark:bg-[#272932]"
          >
            <div className="group ml-[25px] text-black dark:text-white flex justify-between items-center mb-[15px]">
              <div style={{
                fontFamily: "poppins",
                fontSize: "25px",
                fontStyle: "normal",
                fontWeight: 900,
                letterSpacing: "1.5px",
              }}
            >
              Groups
              </div>
              <div className='w-full h-[45px] flex flex-col items-end'>
                <button onClick={() => {setDisplay(!display)}} className={`flex items-center justify-center bg-[#6F37CF] hover:bg-[#4e1ba7] text-white font-bold h-[25px] w-[25px] rounded-full m-[10px] mr-[15px]`} style={{
                  fontFamily: "Roboto",
                  fontSize: "25px",
                 textAlign : "center",
                }}>  + 
                </button>
                  <div className={`${display ? "hidden" : ""} w-[150px] z-10 flex items-center bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white rounded-[15px] text-black shadow-xl  dark:shadow-[0_25px_5px_-15px_rgba(20,0,50,0.3)]`}>
                    <ul 
                    className='w-full flex flex-col items-center text-center'
                    style={{
                    fontFamily: "poppins",
                    fontSize: "15px",
                    fontWeight: 300,
                    }}>
                      <li className='w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]'>
                        <Link to="createRoom" onClick={() => setDisplay(true)}>Create Room</Link>
                      </li>
                      <li className='w-full rounded-[15px] hover:text-white hover:bg-[#6F37CF]'>
                        <Link to="joinRoom" onClick={() => setDisplay(true) }>Join Room
                        </Link>
                      </li>
                    </ul>    
                  </div>
              </div>
            </div>
            <div className="h-[79%] convs my-[10px] ml-[10px] overflow-y-scroll">
                {
                 
                  convData.map( (Group1: any, index: number) => (
                  <Group key={index} index={Group1.id} groupData={Group1} userId={userId}/>))
                }
            </div>
            </div>
      )  
  }
}

export default GroupsComponent