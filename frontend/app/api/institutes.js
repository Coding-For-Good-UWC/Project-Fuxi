import { getAuth } from 'firebase/auth';
import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getInstitute = async () => {
    const idToken = await getAuth().currentUser.getIdToken(); // id token

    const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/institute/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: idToken },
    });
    const data = await response.json();

    return data.institute;
};

export const signUpInstitute = async (name, email, password) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/signup`, {
            name: name,
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        console.error('Error in signUpInstitute:', error);
        throw error;
    }
};

export const signInInstitute = async (email, password) => {
    try {
        const response = await axios.post(`${apiUrl}/dev/institute/signin`, {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        console.error('Error in signInInstitute:', error);
        throw error;
    }
};
