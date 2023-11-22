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
        console.log(`Data AsyncStorage has been successfully deleted key: ${key}`);
    } catch (error) {
        console.error(error);
    }
};

// Add elements to the array and save to AsyncStorage
export const addItemToAsyncStorageArray = async (key, item) => {
    try {
        const getArrayString = await getStoreData(key);

        if (getArrayString) {
            const parseToArray = JSON.parse(getArrayString);
            const newArray = [...parseToArray, item];
            await storeData(key, JSON.stringify([...new Set(newArray)]));
        } else {
            await storeData(key, JSON.stringify([item]));
        }
        console.log('The element has been added to the array and saved to AsyncStorage');
    } catch (error) {
        console.error('Error when adding elements to array and saving to AsyncStorage:', error);
    }
};

// Remove element from array and update AsyncStorage
export const removeItemFromAsyncStorageArray = async (key, item) => {
    try {
        const getArrayString = await getStoreData(key);
        const parseToArray = await JSON.parse(getArrayString);
        const newArray = parseToArray.filter((value) => value !== item);
        await storeData(key, JSON.stringify(newArray));
        console.log('The element has been removed from the array and updated into AsyncStorage');
    } catch (error) {
        console.error('Error removing element from array and updating to AsyncStorage:', error);
    }
};

// Check if an element is in the array in AsyncStorage
export const isItemInAsyncStorageArray = async (key, item) => {
    try {
        const getArrayString = await getStoreData(key);
        if (getArrayString == null) {
            console.log(`Array not found in AsyncStorage (${key})`);
            return false;
        }

        const storedArray = JSON.parse(getArrayString);
        if (!Array.isArray(storedArray)) {
            console.log(`Data stored in AsyncStorage (${key}) is not an array`);
            return false;
        }

        const isItemInArray = storedArray.includes(item);
        if (isItemInArray) {
            console.log(`Element ${item} is in array in AsyncStorage (${key})`);
        } else {
            console.log(`Element ${item} is not in the array in AsyncStorage (${key})`);
        }

        return isItemInArray;
    } catch (error) {
        console.error('Error checking array element in AsyncStorage:', error);
        return false;
    }
};
