const {
    Types: { ObjectId },
} = require("mongoose");

const seedTracks = [
    {
        _id: ObjectId("64f6fd56a0deb54d6dfc6fc3"),
        Title: "song1",
        YtId: "",
        Artist: "",
        Language: "",
        Genre: "",
        ImageURL: "",
        Era: "",
        URI: ""
    },
    {
        _id: ObjectId("64f6fe3289ab6e65bd5b29e9"),
        Title: "song2",
        YtId: "",
        Artist: "",
        Language: "",
        Genre: "",
        ImageURL: "",
        Era: "",
        URI: ""
    },
];

module.exports = {
    seedTracks,
};
