const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const tokenValidation = require("../middleware/tokenValidation");
const validationMiddleware = require("../middleware/validationMiddleware");
router.post("/signup", userController.createUser);

router.post(
    "/login",
    validationMiddleware.validateLogin,
    userController.loginUser
);

// router.post(
//     "/profile",
//     tokenValidation.validateToken,
//     userController.getUserProfile
// );
router.get(
    "/profile",
    tokenValidation.validateToken,
    validationMiddleware.validateUser,
    userController.getUserProfile
);
router.put(
    "/profile",
    tokenValidation.validateToken,
    validationMiddleware.validateUserName,
    userController.updateUserProfile
);

module.exports = router;
