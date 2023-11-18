import Cookies from "js-cookie";
import axios from "axios";


const opponent_data = async (id:any) => {
    const token = Cookies.get("token");
    if (token) {
      const response = await axios.post(
        "http://localhost:3000/auth/data", // Replace with your API endpoint
        {
          id: id,
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
      }
    }
  };



  export default opponent_data;