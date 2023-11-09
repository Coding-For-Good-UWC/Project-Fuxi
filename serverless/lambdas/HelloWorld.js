const mongoose = require('mongoose');
const path = require('path');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
const { connectDb, closeDb } = require('../lib/mongodb');

const filePath = path.join(__dirname, 'global-bundle.pem');

const options = {
    retryWrites: false,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsCAFile: filePath,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    directConnection: true,
};

const helloWorld = async (event) => {
    console.log('hello world');
    await connectDb();
    console.log('number 1');
    const Schema = mongoose.Schema;
    console.log('number 1');
    const personSchema = new Schema({
        name: String,
        age: Number,
    });
    console.log('number 1');

    const Person = mongoose.model('Person', personSchema);
    console.log('number 2');

    console.log('number 3');

    const person = await Person.find({ name: 'John Doe' });
    console.log('number 4');
    mongoose.connection.close();
    console.log('number 5');

    return {
        statusCode: 200,
        body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Data has been saved', person)),
    };
};

module.exports = { helloWorld };
