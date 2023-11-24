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

module.exports = { generateRandomString, getScoreByPreference };
