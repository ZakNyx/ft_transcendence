import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import axios from "axios";

interface UsersData {
  username: string;
  displayname: string;
}

export default function SearchBar() {
  const [searchQuery, setSearch] = useState<string>("");
  const [users, setUsers] = useState<UsersData[] | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const clearInput = () => {
    setSearch("");
    setUsers(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
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
            }
          );
          console.log(response.data);
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (searchQuery.length > 0) {
      fetchUserData();
    } else {
      // Clear the search results when the search query is empty
      setUsers(null);
    }
  }, [searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      clearInput();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
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
        className={`w-full py-3 pl-12 pr-4 text-gray-500 border rounded-full ${
          searchQuery ? 'focus:rounded-t-3xl focus:rounded-b-none' : ''
        } outline-none bg-gray-50`}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={searchInputRef}
      />
      {searchQuery && (
        <button
          onClick={clearInput}
          className="absolute top-0 right-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          X
        </button>
      )}
      { users && (
        <div className="w-full z-[1000]  rounded-t-md rounded-b-3xl bg-white absolute top-full shadow-lg border border-gray-300 p-2">
          {users.map((item) => (
            <div
              key={item.username}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg "
            >
              <a
                href={`/profile/${item.username}`}
                className="font-semibold font-montserrat text-npc-gray cursor-pointer"
              >
                {item.displayname}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
