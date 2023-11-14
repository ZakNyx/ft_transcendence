import axios from "axios";
import Cookies from "js-cookie";

const getData = async (endpoint:any) => {

    try {
      const token = Cookies.get('accessToken');
      if (token) {
        
        const response = await axios.get(endpoint, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
            return response.data;
        } else {
          return;
        }
      }
    } catch (error) {
      alert(error)
    }
  };

    

  export default getData;
