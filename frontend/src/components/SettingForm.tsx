import Modal from "./Modal"; // Import the Modal component
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BlockList from "./BlockList";

interface UserData {
  userID: string;
  username: string;
  picture: string;
  displayname: string;
  gamesPlayed: number;
  wins: number;
  loses: number;
  winrate: number;
  elo: number;
  status2fa: boolean;
}

export default function SettingForm() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          const response = await axios.get(`http://localhost:3000/profile/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const [userProfilePicture, setUserProfilePicture] = useState<File | null>(
    null,
  );

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setUserProfilePicture(selectedFile);
    }
  };

  // Update Profile Picture
  const uploadProfilePicture = async () => {
    if (!userProfilePicture) {
      return;
    }

    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie && user) {
        const token = tokenCookie.split("=")[1];
        const formData = new FormData();
        formData.append("updatePicture", userProfilePicture);

        await axios.post(
          `http://localhost:3000/profile/updatePicture`, // Update the URL to match your server endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Success" + "</h1>",
          text: "Profile picture has been updated.",
          icon: "success",
          background: "#252526",
          timer: 2000,
        });
      }
    } catch (error: any) {
      console.error("Error uploading user picture:", error);
      if (error.response && error.response.status == 400) {
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Error" + "</h1>",
          text: "Invalid file type or size.",
          icon: "error",
          background: "#252526",
          timer: 2000,
        });
      }
    }
  };

  const deleteProfilePicture = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie && user) {
        const token = tokenCookie.split("=")[1];

        await axios.delete(`http://localhost:3000/profile/deletePicture`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Success" + "</h1>",
          text: "Profile picture has been deleted.",
          icon: "success",
          background: "#252526",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting user picture:", error);
    }
  };

  const [newdisplayname, setUserdisplayname] = useState<string>("");

  const handledisplaynameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserdisplayname(event.target.value);
  };

  // Change the username
  const updatedisplayname = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie && user) {
        const token = tokenCookie.split("=")[1];

        await axios.put(
          `http://localhost:3000/profile/updateName`,
          { name: newdisplayname },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Success" + "</h1>",
          text: "Username has been updated.",
          icon: "success",
          background: "#252526",
          timer: 2000,
        });
        setUserdisplayname("");
      }
    } catch (error: any) {
      console.error("Error Changing Display Name:", error);
      if (error.response && error.response.status == 400) {
        Swal.fire({
          title:
            "<h1 style='color: rgb(229 231 235 / 1'>" + "Error" + "</h1>",
          text: "Username invalid or already taken.",
          icon: "error",
          background: "#252526",
          timer: 2000,
        });
      }

    }
  };

  return (
    <div className="flex flex-col lg:flex-row font-montserrat justify-center items-center min-h-screen space-y-6 lg:space-y-0">
      <div className="lg:w-1/5 background-gray rounded-lg p-6 mt-6 shadow-[0px_10px_30px_20px_#00000024]">
        <span className="font-semibold text-gray-200 pt-4 opacity-90">
          Profile Picture
        </span>
        <div className="w-full p-4 mx-2 flex justify-center">
          {user && (
            <img
              src={user.picture}
              alt="profile image"
              className="items-center border w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
            />
          )}
        </div>
        <div className="text-center mb-3">
          <span className="text-gray-400">
            JPG, JPEG or PNG no larger than 1 MB
          </span>
        </div>
        <div className="flex items-center justify-center">
          <input
            type="file"
            id="profilepic"
            hidden
            onChange={handleProfilePictureChange}
          />
          <label
            htmlFor="profilepic"
            className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition text-sm sm:text-base md:text-md"
          >
            Choose File
          </label>
          <button
            type="submit"
            onClick={uploadProfilePicture}
            id="submit"
            className="bg-blue-500 ml-3 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition text-sm sm:text-base md:text-md"
          >
            Upload
          </button>
          <button
            type="button"
            id="deletepic"
            onClick={deleteProfilePicture}
            className="bg-red-500 hover:bg-red-600 text-gray-200 cursor-pointer rounded-full px-4 py-2 ml-3 transition"
          >
            <img src="../../public/images/trash.svg" className="h-8 w-8" />
          </button>
        </div>
      </div>
      <div className="lg:w-2/5 p-8 rounded-lg background-gray lg:ml-4 shadow-md">
        <span className="font-semibold text-gray-200 pt-4 opacity-90">
          Personal Information
        </span>
        <div className="rounded shadow p-6">
          <div className="">
            <label
              htmlFor="username"
              className="font-semibold text-gray-200 pb-1"
            >
              Username
            </label>
            <div className="flex">
              <input
                id="username"
                className="border-1 rounded-r px-4 py-2 w-full"
                type="text"
                value={newdisplayname}
                onChange={handledisplaynameChange}
                placeholder={user ? user.displayname : "loading..."}
              />
            </div>
          </div>
          <div className="pb-4">
            <div className="flex items-center mt-10">
              <label
                htmlFor="2FA"
                className="font-semibold text-gray-200 pr-6 pb1 text-xs sm:text-sm md:text-base"
              >
                Two-factor Authentication
              </label>
              <label className="flex cursor-pointer select-none items-center">
                <Modal />
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            id="submit"
            onClick={updatedisplayname}
            className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition text-sm sm:text-base md:text-md "
          >
            Submit
          </button>
        </div>
      </div>
      <div className="pl-3 lg:w-1/5 rounded-lg background-gray lg:ml-4 shadow-md pt-8">
        <BlockList />
      </div>
    </div>
  );
}
