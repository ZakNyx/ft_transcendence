import Cookies from "js-cookie";
import axios from "axios";


export const notif_fetching = async () => {
    try {
        const token = Cookies.get("token");
        if (token) {

            const response = await axios.get(
                "http://localhost:3000/profile/notif", // Replace with your API endpoint
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                return response.data;
            } else {
                return
            }
        }
    } catch (error) {
        alert(error)
    }
};


export default notif_fetching;