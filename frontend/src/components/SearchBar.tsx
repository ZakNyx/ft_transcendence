import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";

export default function SearchBar() {
  const [searchQuery, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Define an async function for fetching user data
    const fetchUserData = async () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        try {
          const response = await axios.get(
            `http://localhost:3000/profile/searchName/${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          console.log(response.data);
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Trigger the fetchUserData function when searchQuery changes and it meets a length criteria
    if (searchQuery.length >= 3) {
      fetchUserData();
    }
  }, [searchQuery]); // Declare searchQuery as a dependency

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
  };

  return (
    <form className="md:mr-12 w-[20vw]">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-full outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
}
