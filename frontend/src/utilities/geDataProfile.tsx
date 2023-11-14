import axios from "axios";
import Cookies from "js-cookie";

const getDataProfile = async (endpoint: any, userId: string) => {


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
                        id : userId,
                    }
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



export default getDataProfile;
