export const preference = {
    SDK: {
        status: 'strongly dislike',
        color: '#C31E1E',
    },
    DK: {
        status: 'dislike',
        color: '#222C2D',
    },
    LK: {
        status: 'like',
        color: '#137882',
    },
    SLK: {
        status: 'strongly like',
        color: '#FFC857',
    },
};

export const listArrayObjectYear = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        years.push({ key: year.toString(), label: year.toString(), value: year.toString(), color: '#3C4647' });
    }
    return years;
};
