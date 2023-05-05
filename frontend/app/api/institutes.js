import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const getInstitute = async () => 
{
    const idToken = await getAuth().currentUser.getIdToken(); // id token

    const response = await fetch(
        `http://localhost:8080/institute/`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json", token: idToken },
        }
    );
    const data = await response.json();

    return data.institute; 
}

export { getInstitute };