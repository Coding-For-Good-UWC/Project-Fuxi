import colours from '../config/colours';

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

export const colorEllipse = ['#137882', '#FFC857', '#679436', '#613F75', '#FF6B6B', '#28B5B9', '#C1D43E', '#9B3D12', '#D8A7CA'];
