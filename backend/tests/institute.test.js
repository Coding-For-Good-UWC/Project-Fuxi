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

    const uid = v1()

    it("API signup", async () => {
        const requestData = {
            uid,
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

    it("API get institude", async () => {
        const requestData = {};
        const response = await request(app).get("/institude").set('TOKEN', uid).send();

        expect(response.statusCode).toEqual(200);
    });

    it("API get pations", async () => {
        const requestData = {}
        const reponse = await request(app).get("/institude/patients").set('TOKEN', uid).send()

        expect(response.statusCode).toEqual(200);
    })

    it("API check name repeat", async () => {
        const requestData = {}
        const reponse = await request(app).get("/institude/namerepeat").send()

        expect(response.statusCode).toEqual(200);
    })
});
