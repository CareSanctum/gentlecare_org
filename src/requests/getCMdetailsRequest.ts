import axios from "axios";

export const getCMdetailsRequest = async (username: string) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patient/${username}`);
        return response.data;
    }
    catch(error){
        console.log(error);
    }
}