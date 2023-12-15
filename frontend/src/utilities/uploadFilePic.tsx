import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { Token } from "../context/types";

const uploadFilePic = async (endpoint:any,file :any) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const token = Cookies.get('token');
      if (token) {
        const decode: Token = jwt(token);
        const userId: string = decode.sub;
  
  
        const response = await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', 
          },
          params: {
            id: userId, 
          },
        });
  
        if (response.status === 200) {
          return;
        } else {
          return;
        }
      }
    } catch (error) {
      alert(error)
    }
  };



  export default uploadFilePic;