const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

const EnumRatingTrack = {
    'strongly dislike': 1,
    dislike: 2,
    like: 4,
    'strongly like': 5,
};

function getScoreByPreference(preference) {
    return EnumRatingTrack[preference] || 3;
}

function arraysHaveSameElementsAndLength(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]) && sortedArr2.every((value, index) => value === sortedArr1[index]);
}

module.exports = { generateRandomString, getScoreByPreference, arraysHaveSameElementsAndLength };
