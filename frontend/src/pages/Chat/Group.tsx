import { Link } from "react-router-dom";
import logoImg from "../../../public/images/panda.svg"


  const GroupComp = (groupData:any) => {
    let date : Date | null;
    date = ((groupData.groupData.msgs.length) ? new Date(groupData.groupData.msgs[groupData.groupData.msgs.length - 1].sentAt) : null);

    let formattedDate = null;

    if (date)
    {
      const hour =  date.getHours();
      const minutes = date.getMinutes();
      const dayOfMonth = date.getDate();
      const monthIndex = date.getMonth();

      formattedDate = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${dayOfMonth.toString().padStart(2, '0')}-${monthIndex + 1}`;
    }



    
    const encodedData = encodeURIComponent(groupData.groupData.id);
    if (encodedData)
    {
      return (
        <Link 
        to= {`/chat/groupConv/?id=${encodedData}`}
          >
          <div key={groupData.index} className="icon w-full h-[40px] mb-[15px] flex-wrap">
          <div className="icon w-full h-[40px] mb-[15px] flex justify-between">
            <div className="w-[70%] h-full ">
              <img
                className="logoImg rounded-[50px] w-[40px] h-[40px]"
                src={(groupData.groupData.image) ? `data:image/jpeg;base64,${groupData.groupData.image}` : logoImg}
                alt={""}
              />
    
              <div
                className="groupName mb-[40px] text-gray-200 w-full mt-[-40px] ml-[45px] overflow-hidden "
              >
                {groupData.groupData.RoomName}
              </div>
              <div
                className="groupMsg text-gray-400 text-xs  w-[105px] mt-[-40px] ml-12 overflow-hidden whitespace-nowrap"
              >
                {(groupData.groupData.msgs.length) ? groupData.groupData.msgs[groupData.groupData.msgs.length - 1].messageContent : ""}
              </div>
            </div>
            <div
              className="date w-[30%] mt-[22px] overflow-hidden whitespace-nowrap text-center text-xs text-gray-500"
            >
              {
               formattedDate
              
              }
            </div>
          </div>
          <hr className=" w-[90%] h-[1px] my-[-9px] bg-[#2C2C2CBD] opacity-[15%] border-0  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
        </div>
        </Link>
      );
    }
  };

export default GroupComp