import { getAuth } from "firebase/auth";
import Constants from 'expo-constants'

const getInstitute = async () => 
{
    const idToken = await getAuth().currentUser.getIdToken(); // id token

    const response = await fetch(
        `${Constants.expoConfig.extra.apiUrl}/institute/`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json", token: idToken },
        }
    );
    const data = await response.json();

    return data.institute; 
}

export { getInstitute }; 