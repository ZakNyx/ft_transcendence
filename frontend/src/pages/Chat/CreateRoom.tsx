import { useState } from "react";

function CreateRoom(props: any) {
  const [display, setDisplay] = useState("hidden");
  const [clicked, setClicked] = useState("");

  const [roomName, setRoomName] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [password, setPassword] = useState<any>("");

  const handleImageChange = (e: any) => {
    const maxSize: number = 500000;
    const selectedImage = e.target.files[0];
    if (selectedImage.size < maxSize) setImage(selectedImage);
  };

  const buttonOptions = [
    {
      label: "Public",
      id: "public",
      dispalyInput: () => {
        setDisplay("hidden");
        setClicked("public");
      },
    },
    {
      label: "Protected",
      id: "protected",
      dispalyInput: () => {
        setDisplay("");
        setClicked("protected");
      },
    },
    {
      label: "Private",
      id: "private",
      dispalyInput: () => {
        setDisplay("hidden");
        setClicked("private");
      },
    },
  ];

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const convertImageToBase64 = async (image: any) => {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(null);
      } else {
        const reader: any = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.split(",")[1]); // Extract the Base64 part
          }
        };
        reader.onerror = (error: any) => {
          reject(error);
        };
      }
      setIsButtonDisabled(true);
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const imageBase64 = await convertImageToBase64(image);
    props.socket.emit("createRoom", {
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
  };

  const maxLength = 15;

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:w-2/3 h-h-[86vh] rounded-xl ml-6 md:ml-3 mr-4 my-3.5 overflow-hidden shadow-lg bg-npc-gray pt-12 pb-12"
    >
      <div className="w-full h-full flex items-center justify-center flex-wrap">
        <div
          className="w-full m-auto flex items-center justify-center text-gray-200  text-center p-3
      font-bold text-base md:text-3xl"
        >
          Create a Room
        </div>
        <hr className=" w-[80%] h-[2px] m-auto bg-white opacity-[15%] rounded-full"></hr>
        <div className="w-[90%] h-full mt-10 mb-10 bg-[#23242a] rounded-xl flex flex-col justify-center items-center  shadow-2xl">
          <div className="w-[90%] h-20 flex flex-row justify-center items-center mt-5 bg-npc-gray rounded-md shadow-xl">
            <label className="w-[40%] text-gray-200 font-semibold text-sm md:text-xl">
              Group Name
            </label>
            <input
              required
              onChange={(e) => setRoomName(e.target.value)}
              id="i"
              type="text"
              maxLength={maxLength}
              placeholder="Your group's name"
              className="w-[55%] h-12 rounded-xl p-3 bg-[#403F43] text-sm md:text-base text-gray-300 text-center"
            />
          </div>
          <div className="w-[90%] h-20 flex flex-row justify-center items-center mt-5 bg-npc-gray rounded-md shadow-xl ">
            <label className="w-[40%] text-gray-200 font-semibold text-sm md:text-xl">
              Group Picture
            </label>
            <input
              required
              className="form-input w-[55%] file:w-[100%] file:h-[40px] file:border-none file:text-gray-300 text-sm md:text-base file:rounded-xl file:bg-[#403F43]"
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              name=""
              id=""
            />
          </div>
          <div className="w-[50%] h-44 my-[30px] flex-wrap justify-center items-center bg-npc-gray rounded-xl shadow-xl">
            <div className="w-full h-[70px] flex justify-center items-end mb-[40px]">
              <label className="text-gray-200 font-semibold text-base md:text-2xl">
                Visibility
              </label>
            </div>
            <div className={`space-x-5 h-[15%] flex justify-center items-end`}>
              {buttonOptions.map((option, index) => (
                <button
                  type="button"
                  key={index}
                  className={`${
                    option.label === clicked ? "bg-[#1A1C26]" : "bg-[#403F43]"
                  } hover:bg-[#3c3f4f]  text-gray-200 py-2 px-4 rounded-md hover:shadow-xl text-sm md:text-base focus:bg-gray-700 active:bg-gray-600`}
                  onClick={option.dispalyInput}
                  id={option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex mt-1 items-stretch justify-center">
            <input
              required={display === "" ? true : false}
              type="password"
              placeholder="Password"
              maxLength={maxLength}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={` ${display} w-[60%] md:w-[25%] h-10 rounded-xl mb-5 bg-[#403F43]  text-white text-sm md:text-base text-center`}
            />
          </div>{" "}
          <div className="h-[10%] w-full flex justify-center mt-">
            <button
              type="submit"
              onSubmit={handleSubmit}
              disabled={isButtonDisabled}
              className={`h-10 md:h-12 md:w-28 w-20 bg-npc-purple hover:bg-purple-hover text-sm base:text-md text-gray-200 mb-4 font-semibold rounded-md text-center hover:shadow-xl transition-all ${
                isButtonDisabled
                  ? "bg-[#9d88c0] hover:shadow-none"
                  : "enabled-button"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateRoom;
