import Modal from "./Modal"; // Import the Modal component
import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  userID: string;
  username: string;
  profilePicture: string;
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
  const [userPicture, setUserPicture] = useState<string | null>(null);

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
  }, [user]);

  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      try {
        if (tokenCookie && user) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get(
            `http://localhost:3000/profile/ProfilePicture/${user.username}`,
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });
          const imageUrl = URL.createObjectURL(blob);

          setUserPicture(imageUrl);
        } else {
          // Handle the case when there is no token (e.g., display a placeholder image)
          setUserPicture("../../public/images/default.png");
        }
      } catch (error) {
        // Handle errors gracefully (e.g., display an error message to the user)
        console.error("Error fetching user picture:", error);
      }
    };

    fetchUserPicture();
  }, [user]);

  const [userProfilePicture, setUserProfilePicture] = useState<File | null>(
    null,
  );

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      // You can add code to validate the file type and size here if needed.
      // Store the selected file in state.
      setUserProfilePicture(selectedFile);
    }
  };

  const uploadProfilePicture = async () => {
    if (!userProfilePicture) {
      // Handle the case when no file is selected (optional).
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

        // Optionally, you can update the user's profile picture in the state
        // and display it immediately on successful upload.
      }
    } catch (error) {
      // Handle errors gracefully (e.g., display an error message to the user).
      console.error("Error uploading user picture:", error);
    }
  };

  const deleteProfilePicture = async () => {

    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie && user) {
        const token = tokenCookie.split("=")[1];

        await axios.delete(
          `http://localhost:3000/profile/deletePicture`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (error) {
      console.error("Error deleting user picture:", error);
    }
  };

  const [newDisplayName, setUserDisplayName] = useState<String | null>(
    null,
  );

  const handleDisplaynameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
      setUserDisplayName(event.target.value);
      console.log(newDisplayName);
  };

  const updateDisplayName = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    try {
      if (tokenCookie && user) {
        const token = tokenCookie.split("=")[1];

        await axios.put(
          `http://localhost:3000/profile/updateName`,
          {name: newDisplayName},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (error) {
      console.error("Error deleting user picture:", error);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row font-montserrat justify-center items-center min-h-screen space-y-6 lg:space-y-0">
      <div className="lg:w-1/5 background-gray rounded-lg p-6 mt-6 shadow-[0px_10px_30px_20px_#00000024]">
        <span className="font-semibold text-gray-200 pt-4 opacity-90">
          Profile Picture
        </span>
        <div className="w-full p-4 mx-2 flex justify-center">
          {userPicture && (
            <img
              src={userPicture}
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
            className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
          >
            Choose File
          </label>
          <button
            type="submit"
            onClick={uploadProfilePicture}
            id="submit"
            className="bg-blue-500 ml-3 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
          >
            Upload
          </button>
          <button
            type="button"
            id="deletepic"
            onClick={deleteProfilePicture}
            className="bg-red-500 hover:bg-red-600 text-gray-200 cursor-pointer rounded-full px-4 py-2 ml-3 transition"
          >
            <img src="../../public/images/trash.svg" className="h-6 w-6" />
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
                onChange={handleDisplaynameChange}
                placeholder={user ? user.displayname : "loading..."}
              />
            </div>
          </div>
          <div className="pb-4">
            <div className="flex items-center mt-10">
              <label
                htmlFor="2FA"
                className="font-semibold text-gray-200 pr-6 pb1"
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
            onClick={updateDisplayName}
            className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

//localhost:3000/profile/updateName
//POst body name:string

//localhost:3000/profile/updatePicture
// body : any
