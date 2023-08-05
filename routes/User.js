const express = require("express");
const { signup, sendotp , login } = require("../controllers/Auth");
const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user send otp
router.post('/send-otp' , sendotp)

// Route for user login
router.post("/login", login)

module.exports = router;
