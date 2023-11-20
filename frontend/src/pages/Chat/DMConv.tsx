import { useState, useEffect, useRef, } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import Popup from "reactjs-popup";
import ChatUserProfile from "./ChatUserProfile";



const ContactBar = (barData:any) => {
  

  return (
      <div className="w-full h-full p-[20px] flex-wrap items-center justify-center">
        <div className="w-full h-full flex items-center justify-start">
          <Popup trigger={
            <img
              className="logoImg rounded-[50px] w-[50px] h-[50px] flex items-center"
              src={barData.barData.participants[0].image}
              alt={""}
            />} modal>
            {// @ts-ignore
            close => (<ChatUserProfile close={close} userId={barData.barData.participants[0].userId}/>)}
          </Popup>


          <div className="w-full h-full ml-[55px] flex justify-around items-center">
            <div className=" text-black dark:text-white w-full flex items-center"
              style={{
                fontFamily: "poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "1.5px",
              }}
            >
              {barData.barData.participants[0].displayname}
            </div>
            {/* <div> */}
          <Link
            to="/pvf"
            onClick={() => {
              barData.socket.emit('gameInvite', { id: barData.barData.participants[0].userId, type: "gameInvite" })
            }}
            // to="/chat/dmConv"
            className={`w-[60px] h-[30px] bg-[#6F37CF] rounded-[25%] mr-[10px] hover:dark:shadow-lg hover:shadow-lg`}>
            <div className="w-full h-full text-white text-center mt-[5px]"
              style={{
                fontFamily: "poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "0.13px",
              }}>

              Play
            </div>
          </Link>
            {/* </div> */}
            {/* <button  
              onClick={handleBlock}
              className={`flex items-center justify-center bg-[#6F37CF] hover:bg-[#4e1ba7] text-white font-bold h-[25px] w-[25px] rounded-full m-[10px] mr-[15px]`} style={{
                  fontFamily: "Roboto",
                  fontSize: "25px",
                 textAlign : "center",
                }}>  + 
                </button> */}
          
          
          </div>
          
        </div>
            <hr className=" w-[90%] h-[1px] my-[15px] bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%] flex justify-center"></hr>
        
      </div>
    );
  };

  const Mssg = (msgData : any) => {
    if (msgData.msgData.senderId !== msgData.userId) {
      return (
        <div key={msgData.index} className="max-w-[60%] max-h-[60%] m-[15px]">
          <div className="w-full h-full">
            <div className=" w-[15px] h-[15px] mt-[15px] bg-[#EEEEFF] rounded-full dark:bg-[#1A1C26]"></div>
            <div
              className="p-[10px] ml-[15px] mt-[10px] max-w-[60%]  w-fit h-fit bg-[#EEEEFF] rounded-[25px] dark:bg-[#1A1C26] text-left text-[#353535] dark:text-white text-clip overflow-hidden"
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
              {msgData.msgData.messageContent}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-[100%] max-h-[90%] m-[15px] ml-[-30px] 
        ">
          <div className="w-full h-full flex flex-row-reverse justify-start ml-[20px]">
            <div className=" w-[15px] h-[15px] mt-[15px%] bg-[#6F37CF] rounded-full"></div>
            <div
              className="p-[10px] mt-[10px] max-w-[60%] h-fit bg-[#6F37CF] rounded-[25px] dark:bg-[#6F37CF] text-left text-white dark:text-white text-clip"
              style={{
                fontFamily: "poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                letterSpacing: "1px",
                overflowWrap: "break-word",
                maxWidth: "90%",
              }}
            >
              {msgData.msgData.messageContent}
            </div>
          </div>
        </div>
      );
    }
  };
  
  const DMConveComponent = (props: any) => {
    
    // const socket = props.socket;
    const maxLength = 500;
    
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [dataState, setDataState] = useState<any>(null);

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const receivedData = params.get('id');


    const [message, setMessage] = useState('');

    const token = Cookies.get('token');

    useEffect(() => {
      if (receivedData)
      {
      const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chat/dms/${receivedData}`, {
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
        // console.error('Error fetching data:', error);
        navigate('/chat' , {replace: true});
      }
    };

        fetchData();
        props.socket.on("dmDeleted", () => {
          const path : string = "http://localhost:5173/chat/dmConv/?id=" + receivedData;
          if(window.location.href === path)
          {
            navigate('/chat' , {replace: true});

          }
        })
        props.socket.on("blocked", () => {
          const path : string = "http://localhost:5173/chat/dmConv/?id=" + receivedData;
          if(window.location.href === path)
          {
            navigate('/chat' , {replace: true});
          }
        })
        props.socket.on("unblocked", () =>{
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
        })
        
      }
    }, [receivedData]);

  const handleSubmit = (e:any) => {
    e.preventDefault(); 
    
    if (props.socket && message.trim() !== '') {
      props.socket.emit('sendMessage', { messageContent: message, dmId: Number(receivedData), userId: props.userId, roomId: null, sentAt: new Date() });
      setMessage('');
    }
  };

  if (dataState)
  {
      return (
          <div key={receivedData}
          className="lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
        ml-[-10px] mr-[15px] my-[15px] w-[50%] h-[88%] rounded-[25px] flex-2 flex-shrink-0 border-solid border-[#FFFFFF] bg-[#FFFFFF]  shadow-none flex flex-wrap dark:border-[#272932] dark:bg-[#272932]"
        >
            <div className="w-full h-[10%] border-solid mb-[5px]">
              <ContactBar barData={dataState.dm} userId={props.userId} socket={props.socket}/>
            </div>
            <div 
              className="w-full h-[80%] flex-wrap overflow-hidden overflow-y-scroll "
                ref={containerRef}>
            {
              
                dataState.dm.msg.map((element : any , index : any) => (
                <Mssg key={index} index={element.id} msgData={element} userId={props.userId} />
                ))
              }

            </div>
            <div className="w-[90%] h-[50px] border-none flex  m-auto items-center">
                <img
                  className="logoImg rounded-[50px] w-[40px] h-[40px]"
                  src={dataState.image.image}
                  alt={""}
                />
                <form 
                  onSubmit={handleSubmit}
                  className="w-full h-[40px] ml-[15px] flex justify-around">
                    <div className="w-full h-full bg-[#EEEEFF] dark:bg-[#1A1C26] dark:text-white rounded-[10px]">
                      <input 
                        type="text"
                        maxLength={maxLength}
                        placeholder="Type your text.."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-[95%] h-full border-none bg-transparent flex items-center justify-center ml-[10px]" style={{
                          fontFamily: "poppins",
                          fontSize: "15px",
                          fontStyle: "normal",
                          fontWeight: 600,
                          letterSpacing: "1.5px",
                          outline: 'none',
                      }}>
                      </input>
                      </div>
                      <button 
                        type='submit'
                        className="w-[10%] h-full m-auto flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" fill="#6F37CF" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
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

export default DMConveComponent;



// lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF] lg:dark:border-[#272932] lg:dark:bg-[#272932]