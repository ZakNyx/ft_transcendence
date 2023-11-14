
import { Link } from "react-router-dom";



const DMComp = (props: any) => {
    let date : Date | null;
    date = props.dmData[1].length ? new Date(props.dmData[1][props.dmData[1].length - 1].sentAt) : null;

    let formattedDate = null;

    if (date)
    {
      const hour =  date.getHours();
      const minutes = date.getMinutes();
      const dayOfMonth = date.getDate();
      const monthIndex = date.getMonth();

      formattedDate = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${dayOfMonth.toString().padStart(2, '0')}-${monthIndex + 1}`;
    }


    const encodedData = encodeURIComponent(props.dmData[0]);
    if (encodedData)
    {

      return (
        <div key={props.index} className="icon w-full h-[40px] mb-[15px] flex-wrap">
          <Link 
          to={`/chat/dmConv/?id=${encodedData}`}>
          <div className="icon w-full h-[40px] mb-[15px] flex justify-between">
            <div className="w-[70%] h-full ">
              <img
                className="logoImg rounded-[50px] w-[40px] h-[40px]"
                src={props.dmData[2][0].image}
                alt={""}
              />
    
              <div
                className="groupName mb-[40px] text-black dark:text-white w-full mt-[-40px] ml-[45px] overflow-hidden"
                style={{
                  fontFamily: "poppins",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  letterSpacing: "0.75px",
                }}
              >
                {props.dmData[2][0].username}
              </div>
              <div
                className="groupMsg text-black dark:text-white w-[70%] mt-[-40px] ml-[45px] overflow-hidden  whitespace-nowrap"
                style={{
                  fontFamily: "poppins",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 300,
                  lineHeight: "normal",
                  letterSpacing: "0.65px",
                }}
              >
                {props.dmData[1].length ? props.dmData[1][props.dmData[1].length - 1].messageContent  : ""}
              </div>
            </div>
            <div
              className="date w-[30%] mt-[22px] overflow-hidden whitespace-nowrap text-center"
              style={{
                color: "#7C7C7C",
                fontFamily: "poppins",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "normal",
                letterSpacing: "0.13px",
              }}
            >
              {formattedDate}
            </div>
          </div>
          <hr className=" w-[90%] h-[1px] my-[-9px] bg-[#2C2C2CBD] opacity-[15%] border-0  dark:bg-[#8a8abd] dark:opacity-[10%]"></hr>
        </Link>
        </div>
      );
    }
  };

export default DMComp