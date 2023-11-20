import { useEffect, useRef, useState } from 'react';
import logoImg from "../../../public/images/panda.svg"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';


const ContactBar = (barData:any) => {
  const encodedData = encodeURIComponent(barData.barData.roomId);
  if (encodedData)
  {
    return (
        <div className='w-full h-full flex-wrap justify-center'>
          <div className="w-full h-full flex p-[auto] items-center justify-between">
              <img
                className="logoImg rounded-[50px] ml-[30px] w-[40px] h-[40px]"
                src={ barData.barData.roomImage ? `data:image/jpeg;base64,${barData.barData.roomImage}` : logoImg }
                alt={""}
              />
              <div className="w-[70%] h-full ml-[20px] flex items-center dark:text-white" style={{
                    fontFamily: "poppins",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    letterSpacing: "1.5px",
                  }}>
                  {barData.barData.roomName ? barData.barData.roomName : ""}
              </div>
            <div className='w-[20%] h-full flex mr-[10px]'>
                <div className='w-full h-full flex flex-row justify-end items-center'>
                    <Link to={`/chat/invToRoom/?id=${encodedData}`} 
                    className="flex items-center justify-center bg-[#6F37CF] hover:bg-[#4e1ba7] text-white font-bold h-[25px] w-[25px] rounded-full m-[10px] mr-[15px]" style={{
                    fontFamily: "Roboto",
                    fontSize: "25px",
                    }}>+</Link>
                </div>
                <div className='w-[25px] h-full flex flex-row justify-end items-center'>
                    <Link to={`/chat/roomSettings/?id=${encodedData}`} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                        className="w-8 h-8 dark:text-white text-center">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
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
  
  const Mssg = (msgData:any) => {

    if (msgData.msgData[0].senderId !== msgData.userId) {
      return (
        <div key={msgData.index} className=" w-[70%] max-h-[60%] m-[15px] ">
          <div className="w-full h-full flex">
            <img
              className="logoImg rounded-[50px] w-[40px] h-[40px]"
              src={msgData.msgData[1] ? msgData.msgData[1] : logoImg}
              alt={""}
            />
            <div
              className="p-[10px] ml-[15px] max-w-[60%] w-fit h-fit bg-[#EEEEFF] rounded-[25px] dark:bg-[#1A1C26] text-left text-black dark:text-white text-clip "
              style={{
                fontFamily: "poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                letterSpacing: "1px",
                overflowWrap: "break-word",
              }}
            >
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
            <div
              className="p-[10px] ml-[15px] max-w-[60%] w-fit h-fit bg-[#6F37CF] rounded-[25px] dark:bg-[#6F37CF] text-left text-white dark:text-white text-clip overflow-hidden"
              style={{
                fontFamily: "poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "1px",
                overflowWrap: "break-word",
              }}
            >
              {msgData.msgData[0].messageContent}
            </div>
          </div>
        </div>
      );
    }
  };


  
  const GroupConveComponent = (props:any) => {
    
  //console.log("userId f conv: ", props);
  // const socket = props.socket;props.

  const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement>(null);

  const [dataState, setDataState] = useState<any>(null);
  
  
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const receivedData = params.get('id');
  
  const [message, setMessage] = useState('');

  const token = Cookies.get('token');

  const [componentKey, setComponentKey] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chat/groups/${receivedData}`, {
          params: {
            userId: props.userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setDataState(response.data);
        }
      } catch (error) {
        console.error('Error fetching data  in groupConv:', error);
        if (!hasNavigated) {
          setHasNavigated(true);
          navigate('/chat', { replace: true });
        }
        setComponentKey((prevKey) => prevKey + 1);

      }
    };
    fetchData();

    props.socket.on("blocked", () => {
      fetchData();
    })

    props.socket.on("unblocked", () => {
      fetchData();
    })
  
    props.socket.on("kicked", (kickedId: string) =>
    {
      if (props.userId === kickedId)
      {
          const path : string = "http://localhost:5173/chat/groupConv/?id=" + receivedData;
          if( (window.location.href === path ) && (props.userId === kickedId) )
          {
            navigate('/chat' , {replace: true});
          }
        }
      })
    
    props.socket.on("banned", (banned: string) => {
      if (props.userId === banned)
      {
        const path : string = "http://localhost:5173/chat/groupConv/?id=" + receivedData;
        if((props.userId === banned) && window.location.href === path)
        {
          navigate('/chat' , {replace: true});
        }
      }
    })

    props.socket.on("muted", () => {
      fetchData();
    })
    
    props.socket.on("unmuted", () => {
      fetchData();
    })

    function messageListener() {
      fetchData();
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 200);
    }
    props.socket.on("createdMessage", messageListener)

    return (() => {
      props.socket.removeListener('createdMessage', messageListener);
      props.socket.off('unmuted')
      props.socket.off('muted')
      // socket.off('banned')
      // if (window.location.pathname === "")
      //   socket.off('leftRoom')
  
      // socket.off('kicked')
      // socket.off('createdRoom')
      // socket.off('unblocked')
      // socket.off('blocked')
    })

  }, [componentKey, receivedData]);

    const handleSubmit = (e:any) => {
      e.preventDefault();
      //check this below
      if (props.socket && message.trim() !== '' && dataState) {
        props.socket.emit('sendMessage', { messageContent: message, dmId: null, userId: props.userId, roomId: dataState.roomId, sentAt: new Date() });
        setMessage('');
      }
    };

  if (dataState)
  {
    return (
        <div
        // key={componentKey}
        className="lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
        ml-[-10px] mr-[15px] my-[15px] w-[50%] h-[88%] rounded-[25px] flex-2 flex-shrink-0 border-solid border-[#FFFFFF] bg-[#FFFFFF]  shadow-none flex flex-wrap dark:border-[#272932] dark:bg-[#272932]"
      >
          <div className="w-full h-[10%] border-solid mb-[25px]">
            <ContactBar barData={dataState}/>
          </div>
          <div className="w-full h-[77%] mt-[25px] flex-wrap overflow-hidden overflow-y-scroll"
                ref={containerRef}>
          {
              dataState.msgs.map((msg: any, index: number) => (
              <Mssg key={index} index={msg.id} msgData={msg} userId={props.userId} />
            ))
          }
          </div>
          <div className="w-[90%] h-[50px] border-solid flex  m-auto items-center">
              <img
                className="logoImg rounded-[50px] w-[40px] h-[40px]"
                src={ dataState.userImage ? dataState.userImage : logoImg}
                alt={""}
              />
              <form 
                onSubmit={handleSubmit}
                className="w-full h-[40px] ml-[15px] flex justify-around">
                  <div className="w-full h-full bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white rounded-[10px]">
          
                      
                      <input 
                        disabled={dataState.muted}
                        type="text"
                        placeholder={dataState.muted ? "You're muted :c" : "Type your text.."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-[95%] h-full bg-transparent flex items-center justify-center ml-[10px]" style={{
                          fontFamily: "poppins",
                          fontSize: "15px",
                          fontStyle: "normal",
                          fontWeight: 600,
                          letterSpacing: "1.5px",
                          outline: "none",
                      }}>
                      </input>
                    </div>
                    <button
                      type='submit'
                      disabled={dataState.muted}
                      className="w-[10%] h-full m-auto flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" fill="#6F37CF"  stroke="currentColor" strokeWidth="2"    strokeLinecap="round" strokeLinejoin="round" 
                         className="w-6 h-6 text-[#6F37CF]">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                </form>
          </div>
      </div>
    );
  }
}
export default GroupConveComponent;