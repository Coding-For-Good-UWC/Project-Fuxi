import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Constants from 'expo-constants'

const getPatients = async () => 
{
    const idToken = await getAuth().currentUser.getIdToken(); // id token

    const response = await fetch(
        `${Constants.expoConfig.extra.apiUrl}/institute/patients/`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json", token: idToken },
        }
    );
    const data = await response.json();
    const patients = data.patients;

    return patients; 
}

export { getPatients };