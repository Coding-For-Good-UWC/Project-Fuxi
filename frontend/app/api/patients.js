import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const getPatients = async () => 
{
    const idToken = await getAuth().currentUser.getIdToken(); // id token

    const response = await fetch(
        `http://localhost:8080/institute/patients/`,
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