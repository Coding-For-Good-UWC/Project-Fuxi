const institute = require("../models/institute");
const { prepareMongoose } = require("./__mocks__");
const request = require("supertest");
const { server, app } = require("../index");
const { v1 } = require("uuid");

describe("test patient", () => {
    prepareMongoose();

    afterEach(async () => {
        await server.close();
    });

    const uid = v1();

    it("API new", async () => {
        const requestData = {
            name: "Test Patient 2",
            age: "82",
            ethnicity: "Indian",
            birthdate: "1962-05-02",
            birthplace: "India",
            language: "English",
            genres: ["Malay", "English", "Hindi"],
            instituteId: "64ec5e0c542846c7042ec06f",
        };
        const response = await request(app)
            .post("/patient/new")
            .send(requestData);
        expect(response.statusCode).toEqual(200);
    });
});
