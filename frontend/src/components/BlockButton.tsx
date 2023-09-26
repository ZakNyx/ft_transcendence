import React, { useState } from "react";
import axios from "axios";

export default function BlockButton(props: { username: string }) {
  const blockUser = async () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        await axios.put(
          `http://localhost:3000/user/block`,
          { username: props.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        window.location.reload();
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <div>
      <button
        onClick={blockUser}
        className={` bg-red-500 hover:bg-red-600 transition-all rounded-3xl text-gray-200 font-montserrat p-1.5`}
      >
        Block
      </button>
    </div>
  );
}
