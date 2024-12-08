const userService = require("../services/userService");

module.exports.createUser = async (req, res) => {
    let response = {};

    try {
        const responseFromService = await userService.createUser(req.body);
        response.status = 201;
        response.message = "User successfully created";
        response.body = responseFromService;
    } catch (error) {
        console.error("Error in createUser (userController.js)", error);
        response.status = 400;
        response.message = error.message;
    }

    return res.status(response.status).send(response);
};

module.exports.loginUser = async (req, res) => {
    let response = {};

    try {
        const responseFromService = await userService.loginUser(req.body);
        response.status = 200;
        response.message = "User successfully logged in";
        response.body = responseFromService;
    } catch (error) {
        console.error("Error in loginUser (userController.js)", error);
        response.status = 401;
        response.message = error.message;
    }

    return res.status(response.status).send(response);
};

module.exports.getUserProfile = async (req, res) => {
    let response = {};

    try {
        const responseFromService = await userService.getUserProfile(req);
        response.status = 200;
        response.message = "Successfully retrieved user profile";
        response.body = responseFromService;
    } catch (error) {
        console.error("Error fetching user profile (userController.js)", error);
        response.status = 400;
        response.message = error.message;
    }

    return res.status(response.status).send(response);
};

module.exports.updateUserProfile = async (req, res) => {
    let response = {};

    try {
        const responseFromService = await userService.updateUserProfile(req);
        response.status = 200;
        response.message = "User profile successfully updated";
        response.body = responseFromService;
    } catch (error) {
        console.error("Error in updateUserProfile (userController.js)", error);
        response.status = 400;
        response.message = error.message;
    }

    return res.status(response.status).send(response);
};
