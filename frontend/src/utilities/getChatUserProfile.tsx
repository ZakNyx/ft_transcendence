import axios from "axios";
import Cookies from "js-cookie";

const getChatUserProfile = async (endpoint: any, userId: string) => {


    try {
        const token = Cookies.get('accessToken');
        if (token) {

            const response = await axios.get(endpoint,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        id: userId,
                    }
                });

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



export default getChatUserProfile;
