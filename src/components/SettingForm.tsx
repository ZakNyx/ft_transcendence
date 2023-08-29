import React from "react";

export default function SettingForm() {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen space-y-6 lg:space-y-0">
      <div className="lg:w-1/5 bg-gray-900 rounded-[30px] p-6 mt-6 shadow-[0px_10px_30px_20px_#00000024]">
        <span className="font-semibold text-gray-200 pt-4 opacity-90">
          Profile Picture
        </span>
        <div className="w-full p-4 mx-2 flex justify-center">
          <img
            src="../../public/images/zihirri.jpg"
            alt="profile image"
            className="items-center border w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
          />
        </div>
        <div className="text-center mb-3">
          <span className="text-gray-400">JPG or PNG no larger than 5 MB</span>
        </div>
        <div className="">
          <input type="file" id="profilepic" hidden />
          <label
            htmlFor="profilepic"
            className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
          >
            Choose File
          </label>
          <button
            type="button"
            id="deletepic"
            className="bg-red-500 hover:bg-red-600 text-gray-200 cursor-pointer rounded-md px-4 py-2 ml-2 transition"
          >
            Delete the picture
          </button>
        </div>
      </div>
      <div className="lg:w-2/5 p-8 rounded-[30px] bg-gray-900 lg:ml-4 shadow-md">
        <span className="font-semibold text-gray-200 pt-4 opacity-90">
          Personal Information
        </span>
        <div className="rounded shadow p-6">
          <div className="pb-6">
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
                placeholder="Jane Name"
              />
            </div>
          </div>
          <div className="pb-4">
            <label
              htmlFor="about"
              className="font-semibold text-gray-200 pb-1"
            >
              Bio
            </label>
            <input
              id="bio"
              className="border-1 rounded-r px-4 py-2 w-full"
              type="email"
              placeholder="It's better to cm in the sink than to sink in the cm"
            />
          </div>
        </div>
        <button
          type="submit"
          id="submit"
          className="bg-blue-500 text-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
