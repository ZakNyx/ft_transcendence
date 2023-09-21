import Popup from "reactjs-popup";
import { useState, useEffect } from "react";
import axios from "axios";

import React from "react";

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
  secret2fa: boolean;
  secretAuthUrl: boolean;
}

interface Data2fa{
  uri: string;
  secret: string;
}

function Modal() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleActive = () => {
    setIsActive(!isActive);
  };
  const [user, setUser] = useState<UserData | null>(null);
  const [data2fa, setdata2fa] = useState<Data2fa | null>(null);

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

  const handlePopupOpen = async () => {
    console.log("ishere1");
    if (!user.status2fa) {
      console.log("ishere2");
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));
  
      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
  
        try {
          const response = await axios.get(`http://localhost:3000/2fa`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          setdata2fa(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
  };
  
  return (
    <div>
      <Popup
        trigger={
          user && (<div
            className={`button relative p-2 ${
              user.status2fa
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }  hover:cursor-pointer text-gray-200 w-auto rounded-lg flex items-center transition`}
          >
            {user.status2fa ? "Disable 2FA" : "Enable 2FA"}
          </div>)
        }
        modal
        nested
        onOpen={handlePopupOpen} // Use the onOpen callback
      >
        {(close: () => void) => (
          <div className="modal background-gray  text-gray-200 font-montserrat rounded-lg shadow-[0px_10px_30px_20px_#00000024] pl-4 pr-4">
            <button className="close rounded-full text-xl ml-2" onClick={close}>
              X
              </button>
            <div className="header font-bold">
              Two-Factor Authentication (2FA)
            </div>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div className="content">
              {user?.status2fa ? (
                // Render Disable 2FA content and button
                <div>
                  <h1 className="text-blue-300 font-bold pt-4">Disable 2FA</h1>
                  <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <p className="">
                    To disable the two-factor authentication you have to enter
                    the password
                  </p>
                  <p>
                    that appears in the Google Authentication app on your phone
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-blue-300 font-bold pt-4">
                    Configuring Google Authentication
                  </h1>
                  <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <ol>
                    <li>
                      Install the Google Authentication app (Android / IOS)
                    </li>
                    <li>In the app select the "+" Icon</li>
                    <li>
                      Select scan barcode and use your phone camera to scan this
                      QR code
                    </li>
                  </ol>

                  <div className="">
                    <h1 className="text-blue-300 font-bold pt-4">
                      Scan QR Code
                    </h1>
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <img
                      src="../../public/images/QR_Code.png"
                      alt="QR Code"
                      className="w-32 h-auto"
                    />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-blue-300 font-bold pt-4">Verify Code</h1>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                <input
                  className="bg-gray-600 rounded-md p-0.5"
                  placeholder="Authentication Code"
                ></input>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  id="submit"
                  className={`button relative p-2 ${
                    user?.status2fa
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }  hover:cursor-pointer text-gray-200 w-auto rounded-lg flex items-center transition mb-4`}
                  onClick={() => {
                    handleActive();
                    close();
                  }}
                >
                  {user?.status2fa? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}

export default Modal;
