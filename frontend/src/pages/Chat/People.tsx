import DMComp from './DM.tsx';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


function DMsComponent (props:any)
{
    const [dmData, setDmData] = useState<any>(null);

    const token = Cookies.get('accessToken');

  const navigate = useNavigate();
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chat/dms', {
        params: {
          userId: props.userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setDmData(response.data)
        
        
        
      }
    } catch (error) {
      navigate('/chat' , {replace: true});
    }
  };
  
  fetchData();

    props?.socket?.on("dmDeleted", () => {
    fetchData();
  })
    props?.socket?.on("createdDm", () => {
      fetchData();
    });
    props?.socket?.on("createdMessage", () => {
      fetchData();
    });
    props?.socket?.on("blocked", () => {
      fetchData();
    })
    props?.socket?.on("unblocked", () => {
      // console.log("hellloooooooooooooooooooooooo")
      fetchData();
    })

    return(() => {
      props.socket.off('unblocked')
      props.socket.off('blocked')
      props.socket.off('createdMessage')
      props.socket.off('createdDm')
      props.socket.off('dmDeleted')
    })

  }, []);

    if (dmData)
    {
        return (
                <div className="lg:mb-[5px] lg:mt-[10px] lg:w-[90%] lg:h-[55%] lg:rounded-[25px]  lg:border-solid lg:flex-wrap lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
            mb-[5px] mt-[10px] w-[90%] h-[55%] rounded-[25px]  border-solid flex-wrap border-[#FFFFFF] bg-[#FFFFFF]  shadow-none dark:border-[#272932] dark:bg-[#272932]"
            >
                <div className="dms ml-[25px] text-black dark:text-white flex justify-between items-center mb-[15px]">
                <div style={{
                    fontFamily: "poppins",
                    fontSize: "25px",
                    fontStyle: "normal",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                }} >
                People
                </div>
                <Link to="addpeople" className="flex items-center justify-center bg-[#6F37CF] hover:bg-[#4e1ba7] text-white font-bold h-[25px] w-[25px] rounded-full m-[10px] mr-[15px]" style={{
                fontFamily: "Roboto",
                fontSize: "25px",
                }}>+</Link>
                </div>
            <div className="convs h-[85%] overflow-y-scroll my-[15px] ml-[10px]">
            {
                    
              dmData.map((dmItem: any, index: number) => (
                <DMComp key={index} index={dmItem.id} dmData={dmItem} userId={props.userId}/>))
            }
            </div>
          </div>
        );
    }
}

export default DMsComponent;