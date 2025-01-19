const { Router } = require("express");

const { body, validationResult } = require("express-validator");

const { login_post, register_post } = require("../controllers/authController");

const router = Router();

router.post("/login",
	[
	    body("email")
	      .trim()
	      .notEmpty()
	      .withMessage("Email Address required")
	      .normalizeEmail()
	      .isEmail()
	      .withMessage("Invalid email"),
	    body("password")
	      .trim()
	      .notEmpty()
	      .withMessage("Password required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid password"),
  	],
 	login_post
);

router.post("/register", 
	[
	    body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Name required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid user name"),
	    body("email")
	      .trim()
	      .notEmpty()
	      .withMessage("Email Address required")
	      .normalizeEmail()
	      .isEmail()
	      .withMessage("Invalid email"),
	    body("password")
	      .trim()
	      .notEmpty()
	      .withMessage("Password required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid password"),
	    body("cpassword")
	      .notEmpty()
	      .withMessage("Confirm password is required")
	      .custom((value, { req }) => {
	        if (value !== req.body.password) {
	          throw new Error("Passwords do not match");
	        }
	        return true;
	      }),
  	], 
  	register_post
);

module.exports = router;