const express = require('express');

const { body, validationResult } = require("express-validator");

const dbConnectionPromise = require('../db');
// const dbConnection = require('./db');

const bcrypt = require('bcryptjs');

const router = express.Router();

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
 	async (req, res, next) => {
		try {
			// res.setHeader("Content-Type", "application/json");

			// console.log(req.body);

			const { email, password } = req.body;

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

				    if (response == '') {
					    return res.json({
					       	"isSuccess": false,
					        "message": "User not found. Please Register..."
					    })
					}

				    else {
				    	bcrypt.compare(password, response[0]?.password)
						    .then(isMatch => {
						        if (isMatch) {
						            res.json({ 
						                "isSuccess": true,
						                "message": "Login successful!"
						            });
						        } 
						        else {
						            res.json({ 
						               	"isSuccess": false, 
						                "message": 'Invalid credentials'
						            });
						        }
						    })
						    .catch(err => res.json({
						       	"isSuccess": false, 
						        "message": err
						    }));
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