import React, { useState } from "react";
import { Popup } from "reactjs-popup";
import swal from "sweetalert";

const Validate: React.FC = () => {
  const [password, setPassword] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Popup open={true} modal closeOnDocumentClick={false} closeOnEscape={false}>
      {(close: () => void) => (
        <div className="fixed inset-0 bg-npc-gray bg-opacity-50 backdrop-blur-md flex justify-center items-center">
          <div className="modal background-gray  text-npc-gray font-montserrat rounded-lg shadow-[0px_10px_30px_20px_#00000024] pl-4 pr-4">
            <h2 className="text-blue-300 font-bold pt-4 pb-4">
              Enter The 2FA Validation Code
            </h2>
            <input
              type="text"
              onChange={handlePasswordChange}
              className=" px-3 py-2 border rounded-md mb-4"
              placeholder="Password"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log(password);
                  {
                    password === "" ? alert("Attention Wrong password") : close();
                  }
                }}
                className="p-2 mb-2 bg-npc-purple hover:bg-purple-hover  py-2 rounded-md transition-all cursor-pointer text-black"
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
