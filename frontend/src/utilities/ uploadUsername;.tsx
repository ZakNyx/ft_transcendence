import axios from "axios";
import Cookies from "js-cookie";


const uploadUsername = async (endpoint:any, newUsername :string) => {
   

    try {
      const token = Cookies.get('accessToken');
      if (token) {
        // const decode: Token = jwt(token);
        // const userId: string = decode.sub;
        
        const response = await axios.post(endpoint, 
          {
            username: newUsername,
          }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          return;
        } else {
          alert("Failed to get Data")
          window.location.replace("http://localhost:5173/")
        }
      }
    } catch (error) {
      alert(error)
    }
  };

    

  export default uploadUsername;

  