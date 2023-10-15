import React, { useState, useEffect } from "react";
import { Popup } from "reactjs-popup";
import axios from "axios";
import Swal from "sweetalert2";

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

const Validate: React.FC = () => {
  const [password, setPassword] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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

  const is2faValidated = () => {
    const Cookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("2faValidated="));
    if (Cookie) {
      const status2fa = Cookie.split("=")[1];
      if (status2fa === "true") {
        return true;
      }
    }
    return false;
  };

  if (is2faValidated() || !user?.status2fa) {
    return null;
  }

  const handleSubmit = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];

      try {
        console.log(password);
        const response = await axios.put(
          `http://localhost:3000/2fa/validate`,
          { token: password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // If validation is successful, set the 2faValidated cookie to true with a 24-hour expiration
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() +24 * 60 * 60 * 1000); // 24 hours in milliseconds
        const expires = `expires=${expirationDate.toUTCString()}`;
        document.cookie = `2faValidated=true; ${expires}; path=/;`;
        console.log("2FA validated:", response.data);
        close();
      } catch (error: any) {
        if (error.response && error.response.status == 400) {
          Swal.fire({
            title:
              "<h1 style='color: rgb(229 231 235 / 1'>" + "Error" + "</h1>",
            text: "Wrong Passcode",
            icon: "error",
            background: "#252526",
          });
        }
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <Popup open={true} modal closeOnDocumentClick={false} closeOnEscape={false}>
      {/* @ts-ignore */}
      {(close: () => void) => (
        <div className="fixed inset-0 bg-npc-gray bg-opacity-50 backdrop-blur-md flex justify-center items-center">
          <div className="modal background-gray text-npc-gray font-montserrat rounded-lg shadow-[0px_10px_30px_20px_#00000024] pl-4 pr-4">
            <h2 className="text-blue-300 font-bold pt-4 pb-4">
              Enter The 2FA Validation Code
            </h2>
            <input
              type="text"
              onChange={handlePasswordChange}
              className="px-3 py-2 border rounded-md mb-4"
              placeholder="Password"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleSubmit();
                }}
                className="p-2 mb-2 bg-npc-purple hover:bg-purple-hover py-2 rounded-md transition-all cursor-pointer text-black"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default Validate;
