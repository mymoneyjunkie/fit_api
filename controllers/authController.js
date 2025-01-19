const dbConnectionPromise = require('../db');

const { body, validationResult } = require("express-validator");

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");

module.exports.login_post = async (req, res, next) => {
	try {
		// console.log(req.body);

		const { email, password } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		   	let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		"email": email
		       	}
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

module.exports.register_post = async (req, res, next) => {
	try {
		// console.log(req.body);

		const { email, password, cpassword, name, image } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		"email": email,
		       		"name": name,
		       		"image": image
		       	}
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

				    if (response1 == '') {
				    	return res.json({ "isSuccess": false, "message": "Failed to register. Try Again..." });
				    }

				    else {
				    	return res.json({
				            "isSuccess": true,
				            "message": "Registration successful!",
				            "userId": response1[0].insertId // Optionally return the new user's ID
				        });
				    }
				}
			}


			main().catch(err => {
				console.log("Login error: ", err);
				return res.json({ "isSuccess": false, "message": err.code });
			});
		}
	}

	catch(error) {
		console.log("login error: ", error);
	}
}