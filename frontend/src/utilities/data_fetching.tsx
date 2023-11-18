import Cookies from "js-cookie";
import * as jwt from "jwt-decode";
import axios from "axios";
import { Token } from "../context/types";

export const user_data = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const decode: Token= jwt(token);
        const userId: string = decode.sub;

        const response = await axios.post(
          "http://localhost:3000/auth/data", // Replace with your API endpoint
          {
            id: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          alert("Failed to get Data")
          window.location.replace("http://localhost:5173/")
        }
      }
    } catch (error) {
      alert(error)
    }
  };


  export default user_data;