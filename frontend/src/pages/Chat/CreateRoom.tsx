import { useState } from "react";



function CreateRoom(props: any) {

  const [display, setDisplay] = useState("hidden")
  const [clicked, setClicked] = useState("")

  const [roomName, setRoomName] = useState<any>(null)
  const [image, setImage] = useState<any>(null)
  const [password, setPassword] = useState<any>("")


  const handleImageChange = (e:any) => {
    const maxSize: number = 500000;
    const selectedImage = e.target.files[0];
    if (selectedImage.size < maxSize)
      setImage(selectedImage);
  }

  
  const buttonOptions = [
    { label: 'public' , id:'public', dispalyInput: () => {
      setDisplay("hidden")
      setClicked("public")
    }},
    { label: 'protected', id:'protected', dispalyInput: () => {
      setDisplay("")
      setClicked("protected")
    }},
    { label: 'private', id:'private', dispalyInput: () => {
      setDisplay("hidden")
      setClicked("private")
    }},
  ];


  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const  convertImageToBase64 = async (image:any) => {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(null);
      } else {
        const reader:any = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
          if (reader.result)
          {
            resolve(reader.result.split(',')[1]); // Extract the Base64 part
          }
        };
        reader.onerror = (error:any) => {
          reject(error);
        };
      }
      setIsButtonDisabled(true);
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const imageBase64 = await convertImageToBase64(image);
    props.socket.emit('createRoom', {
      ownerId: props.userId, 
      roomName: roomName, 
      joinTime: new Date(),
      visibility: clicked, 
      image: imageBase64, 
      password: password,
    });
    setIsButtonDisabled(false);
    setClicked("");
    e.target.reset();
  }

  const maxLength = 15;

  return (
    <form 
      onSubmit={handleSubmit}
      className="lg:ml-[-10px] lg:mr-[15px] lg:my-[15px] lg:w-[70%] lg:h-[88%] lg:rounded-[25px] lg:flex-2 lg:flex-shrink-0 lg:border-solid lg:border-[#FFFFFF] lg:bg-[#FFFFFF]  lg:shadow-none lg:dark:border-[#272932] lg:dark:bg-[#272932]
      ml-[-10px] mr-[15px] my-[15px] w-[55%] h-[88%] rounded-[25px] flex-2 flex-shrink-0 border-solid border-[#FFFFFF] bg-[#FFFFFF]  shadow-none  dark:border-[#272932] dark:bg-[#272932]">
        <div className='w-full h-full flex-wrap justify-center'>
            <div className="w-full h-[10%] m-auto flex items-center justify-center text-black dark:text-white text-center rounded-[25px]"
                style={{
                    fontFamily: "poppins",
                    fontSize: "35px",
                    fontStyle: "normal",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                }} >
                  CREATE ROOM

            </div>
          <hr className=" w-[50%] h-[1px] m-auto bg-[#474444bd] opacity-[15%] border-0 rounded  dark:bg-[#8a8abd] dark:opacity-[10%]">
          </hr>
          <div className="w-full h-[60%] mt-[80px] flex flex-col justify-center items-center ">
            <div className="w-[90%] h-full mt-[80px] dark:bg-[#272932] bg-[#EEEEFF] rounded-[50px] flex flex-col justify-center items-center shadow-2xl dark:shadow-[10px_10px_25px_15px_rgba(20,0,50,0.3)]">
            <div className="w-[90%] h-[75px] flex flex-row justify-center items-center my-[30px] bg-[#6F37CF] rounded-[20px] shadow-2xl" >
              <label className="w-[40%] text-white" style={{
                fontFamily: "poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 900,
                letterSpacing: "1.5px",
                }}>Group Name </label>
              <input required
                onChange={(e) => setRoomName(e.target.value)}
                id="i" type="text" 
                maxLength={maxLength}
                placeholder="Your group's name.." className="w-[55%] h-[40px] rounded-[25px] p-[15px] dark:bg-[#403F43] bg-[#EEEEFF] dark:text-white text-black text-center" 
                style={{
                  fontFamily: "poppins",
                  fontSize: "15px",
                  fontStyle: "normal",
                  letterSpacing: "1.5px",
                  }}/>
            </div>
            <div className="w-[90%] h-[75px] flex flex-row justify-center items-center my-[30px] bg-[#6F37CF] rounded-[20px] shadow-2xl " >
              <label className="w-[40%] text-white" style={{
                fontFamily: "poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 900,
                letterSpacing: "1.5px",
                }}>Group Picture
              </label>
            
              <input 
                required
                className="form-input w-[55%] file:w-[100%] file:h-[40px] file:border-none file:text-[#8F8F8F] file:dark:text-white file:rounded-[25px] file:dark:bg-[#403F43] file:bg-[#EEEEFF] file:p-[5px] "
                style={{
                  fontFamily: "poppins",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight:400,
                  letterSpacing: "1.5px",
                  }} 
                  onChange={handleImageChange}
                type="file" 
                accept="image/*"
                name="" 
                id=""/>
            </div>
            <div className="w-[90%] h-[200px] my-[30px] flex-wrap justify-center items-center bg-[#6F37CF] rounded-[20px] shadow-xl">
              <div className="w-full h-[70px] flex justify-center items-end mb-[40px]" >
                <label className="text-white" style={{
                  fontFamily: "poppins",
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  letterSpacing: "1.5px",
                  }}>Visibility
                  </label>
                
              </div>
              <div className={`space-x-5 h-[15%] flex justify-center items-end`}>
                {buttonOptions.map((option, index) =>
                (
                  <button
                    type="button"
                    key={index}
                    className={`${option.label === clicked ? "dark:bg-[#1A1C26] bg-[#FFFFFF] " : "bg-[#EEEEFF] dark:bg-[#403F43]"} dark:hover:bg-[#1A1C26] hover:bg-[#FFFFFF] dark:text-white dark:text-[#8F8F8F] font-semibold py-2 px-4 rounded-md hover:shadow-xl` }
                    onClick={option.dispalyInput}
                    
                    id={option.id}
                    style={{
                      fontFamily: "poppins",
                      fontSize: "15px",
                      fontStyle: "normal",
                      fontWeight: 300,
                      letterSpacing: "1.5px",
                      }}
                  >
                  {option.label}
                  </button>
                )
                )}
              </div>
            </div>
            <div className="w-full flex mt-[20px] items-stretch justify-center">
              <input 
                required={display === "" ? true : false} 
              
                type="password" 
                placeholder="Your group's password" 
                maxLength={maxLength}
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className={` ${display}  w-[55%] h-[40px] rounded-[25px] p-[15px] dark:bg-[#403F43] bg-[#FFFFFF] dark:text-white text-black text-center`} 
                style={{
                  fontFamily: "poppins",
                  fontSize: "13px",
                  fontStyle: "normal",
                  letterSpacing: "1.5px",
                  }}/>
            </div>
            </div>
          </div>
          <div className="h-[10%] w-full flex justify-center mt-[150px]">
            <button
              type='submit'
              onSubmit={handleSubmit}
              disabled={isButtonDisabled}
              className={`h-[50px] w-[100px] bg-[#6F37CF] hover:bg-[#6F37CF] dark:hover:bg-[#451e88] text-white font-semibold rounded-[40px] text-center hover:shadow-xl ${isButtonDisabled ? 'bg-[#9d88c0] hover:shadow-none' : 'enabled-button'}`}
              style={{
                fontFamily: "poppins",
                fontSize: "18px",
                fontStyle: "normal",
                letterSpacing: "1.5px",
                fontWeight: 900,
                }}>
                Submit
            </button>

          </div>
        </div>
    </form>
    );
}

export default CreateRoom;
