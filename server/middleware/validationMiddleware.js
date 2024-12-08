const Joi = require("joi");

// Définir les schémas pour l'inscription et la connexion
const validateLogin = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    // const validateUserSchema = userSchema.validate(req.body);
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    next();
};
const validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        firstName: Joi.string().alphanum().min(2).max(30).required(),
        lastName: Joi.string().alphanum().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        userName: Joi.string().alphanum().min(3).max(30).required(),
    });

    // const validateUserSchema = userSchema.validate(req.body);
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    next();
};
const validateUserName = (req, res, next) => {
    const userSchema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(30),
    });

    // const validateUserSchema = userSchema.validate(req.body);
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error });
    }

    next();
};

module.exports = {
    validateLogin,
    validateUser,
    validateUserName,
};
