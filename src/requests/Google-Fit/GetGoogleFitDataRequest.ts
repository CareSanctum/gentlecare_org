import axios from "axios";

const getGoogleFitdata = async (username: string, format: string) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/google-fit/data/`, {
            params: { username, format }
        })
        if (response.status == 200){
            return response.data;
        }else if(response.status == 404){
            console.log("bad response received")
            throw Error("Bad Response Received From Google");
        }
    }catch(error){
        throw error;
        console.log(error);
    }
}
export default getGoogleFitdata;