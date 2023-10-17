import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing data
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(error);
    }
};

// Retrieving data
export const getStoreData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log('Get AsyncStorage: ', value);
            return value;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Function to delete data
export const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Data AsyncStorage has been successfully deleted');
    } catch (error) {
        console.error(error);
    }
};
