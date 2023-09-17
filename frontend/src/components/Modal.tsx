import Popup from "reactjs-popup";
import { useState, useEffect } from "react";
import React from "react";

interface ModalProps {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function Modal({ isChecked, setIsChecked }: ModalProps) {
  return (
    <div>
      <Popup
        trigger={
          <button className="button relative p-2 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white w-auto rounded-lg flex items-center">
            Open Modal
          </button>
        }
        modal
        nested
      >
        {(close: () => void) => (
          <div className="modal background-gray font-semibold text-gray-200 font-montserrat rounded-lg shadow-[0px_10px_30px_20px_#00000024] pl-4 pr-4">
            <button className="close rounded-full text-xl ml-2" onClick={close}>
              &times;
            </button>
            <div className="header font-bold">
              Two-Factor Authentication (2FA)
            </div>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div className="content">
              <div>
                <h1 className="text-blue-300 font-bold">
                  Configuring Google Authentication
                </h1>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <ol>
                  <li>Install the Google Authentication app (Android / IOS)</li>
                  <li>In the app select the "+" Icon</li>
                  <li>
                    Select scan barcode and use your phone camera to scan this
                    QR code
                  </li>
                </ol>
              </div>
              <div className="">
                <h1 className="text-blue-300 font-bold">Scan QR Code</h1>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <img
                  src="../../public/images/QR_Code.png"
                  alt="QR Code"
                  className="w-32 h-auto"
                />
              </div>
              <div>
                <h1 className="text-blue-300 font-bold">Verify Code</h1>
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
                  className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
                  onClick={close}
                >
                  Submit
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
