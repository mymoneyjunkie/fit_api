const express = require('express');

const { body, validationResult } = require("express-validator");

const dbConnectionPromise = require('../db');

const bcrypt = require('bcryptjs');

const crypto = require("crypto");

const router = express.Router();

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
 	async (req, res, next) => {
		try {
			// console.log(req.body);

			const { email, password, cpassword, name, image } = req.body;

			const error = validationResult(req);
      
      		if (!error.isEmpty()) {
		        // console.log(error.array());
		        let msg1 = error.array()[0].msg;

		        return res.json({
		        	"isSuccess": false,
		        	"message": msg1
		        })
			}

			else {
				async function main() {
					const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				    // Now you can use dbConnection to execute queries
				    const [response] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);
				    // console.log(response);

				    if (response != '') {
					    return res.json({
					        "isSuccess": false,
					        "message": "Email already found. Please Login to continue..."
					    })
					}

				 	else {
					    const hashedPassword = await bcrypt.hash(password, 10);

					    // console.log(hashedPassword);

					    const createdAt = new Date(); // January is month 0 in JavaScript
    					const formattedDate = createdAt.toISOString().split('T')[0];

					    // Prepare the insert query
				        const insertQuery = "INSERT INTO users(email, password, name, image, created_at) VALUES (?, ?, ?, ?, ?)";
				        const newUserData = [email, hashedPassword, name, image, formattedDate]; // Make sure to hash the password

				        const response1 = await dbConnection.query(insertQuery, newUserData);

				        // console.log(response1, response1[0].insertId);

				        if (response1 != '') {
				        	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
				        }

				        else {
				        	return res.json({
				                "isSuccess": true,
				                "message": "Registration successful!",
				                "userId": response1[0].insertId, // Optionally return the new user's ID
				                "email": email
				            });
				        }
					}
				}


				main().catch(err => {
					// console.log("Login error: ", err);
					return res.json({ "isSuccess": false, "message": err.code });
				});
			}
		}

		catch(error) {
			console.log("login error: ", error);
		}
	}
)

module.exports = router;