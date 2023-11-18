import Cookies from "js-cookie";
import jwt from "jwt-decode";
import axios from "axios";
import { Token } from "../context/types";

export const profile_search = async (name:string) => {
    try {
      const token = Cookies.get("token");
      if (token) {
        
        const decode: Token= jwt(token);
        const userId: string = decode.sub;
        
        const response = await axios.get(
            "http://localhost:3000/profile",
            {
                params: {name: name, userId : userId},
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
        if (response.status === 200) {
            return response.data;
        }
        else {
          return
        }
      }
    } 
    catch (error) {
      alert(error)
    }
  };

  export default profile_search;