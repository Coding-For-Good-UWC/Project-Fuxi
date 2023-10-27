import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

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
