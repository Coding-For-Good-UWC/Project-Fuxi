const instituteModel = require("../models/institute"); 

const login = async (req, res, next) => 
{
    let { username, password } = req.body;

    const institute = await instituteModel.findOne({ username }); 

    if (!institute)
        return res.status(404).json({ error_message: "No user with that username found" }); 
    
    if (institute.password !== password)
        return res.status(403).json({ error_message: "Password is incorrect" }); 

    req.session.loggedIn = true;
    req.session.institute = institute._id;

    // req.session.save(function (err) {
    //     if (err)
    //     {
    //         console.log (err); 
    //         return next(err); 
    //     } 
    //     // res.redirect('/')
    // })

    // res.setHeader(
    //     'Access-Control-Allow-Origin',
    //     'http://localhost:8080'
    // );
    // res.setHeader('Access-Control-Allow-Credentials', 'true'); 

    console.log ("LOGGED IN SUCCESSFULLY"); 
    console.log (req.session); 
    console.log ("----------------------"); 
    res.status(200).json({ status:"ok" });
}

const getInstitute = async(req, res) => 
{
    console.log ("CALLED GET INSTITUTE"); 
    console.log (req.session); 
    console.log ("----------------------"); 

    const { institute: instituteId } = req.session; // get institute id from session

    if (!instituteId)
        return res.sendStatus(403); 

    const institute = await instituteModel.findById(instituteId); 
    
    if (!institute)
        return res.sendStatus(404); 
    
    res.status(200).json(institute); 
}

module.exports = { login, getInstitute }; 