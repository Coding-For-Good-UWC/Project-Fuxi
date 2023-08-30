const institute = require("../models/institute");
const { prepareMongoose } = require("./__mocks__");
const request = require("supertest");
const { server, app } = require("../index");
const { v1 } = require("uuid");

describe("test institude", () => {
    prepareMongoose();

    afterEach(async () => {
        await server.close();
    });

    it("API signup", async () => {
        const requestData = {
            uid: v1(),
            email: "demo@gmail.com",
            name: "demo",
        };
        const response = await request(app)
            .post("/institute/signup")
            .send(requestData);
        expect(response.statusCode).toEqual(200);

        const userInDb = await institute.findOne({ uid: requestData.uid });

        expect(userInDb.email).toEqual(requestData.email);
        expect(userInDb.name).toEqual(requestData.name);
    });
});
