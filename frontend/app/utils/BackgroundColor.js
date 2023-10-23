import colours from "../config/colours";

export const getColour = (genre) => {
    switch (genre) {
        case 'Cantonese':
            return colours.genreCantonese;
        case 'Chinese':
            return colours.genreChinese;
        case 'Christian':
            return colours.genreChristian;
        case 'English':
            return colours.genreEnglish;
        case 'Hainanese':
            return colours.genreHainanese;
        case 'Hindi':
            return colours.genreHindi;
        case 'Hokkien':
            return colours.genreHokkien;
        case 'Malay':
            return colours.genreMalay;
        case 'Mandarin':
            return colours.genreMandarin;
        case 'TV':
            return colours.genreTV;
        case 'Tamil':
            return colours.genreTamil;
        default:
            return '#137882';
    }
};
