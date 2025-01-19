const dbConnectionPromise = require('../db');

const { body, param, validationResult } = require("express-validator");

module.exports.categories_get = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			// Now you can use dbConnection to execute queries
			const [response] = await dbConnection.query("SELECT * FROM category");
			// console.log(response);

			if (response == '') {
				return res.json({
				   	"isSuccess": false,
				    "data": []
				})
			}

			else {
				return res.json({
				   	"isSuccess": true,
				    "data": response
				})
			}
		}

		main().catch(err => {
			// console.log("Login error: ", err);
			return res.json({ "isSuccess": false, "message": err.code });
		});
	}

	catch (error) {
		console.log("get category error: ", error);
	}
}

module.exports.categories_post = async (req, res, next) => {
	try {
		// console.log(req.body);

		const { name } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		"name": name
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM category WHERE name = ?", [name]);
			    // console.log(response);

			    if (response != '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Category already found. Please insert a new one..."
					})
				}

				else {
					const insertQuery = "INSERT INTO category (name) VALUES (?)";

				    const response1 = await dbConnection.query(insertQuery, [name]);

				    if (!response1) {
				    	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
				    }

				    else {
				    	return res.json({
				            "isSuccess": true,
				            "message": "Inserted successfully!",
				            "catId": response1[0].insertId // Optionally return the new user's ID
				        });
				    }				
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("post category error: ", error);
	}
}

module.exports.categories_edit = async (req, res, next) => {
	try {
		const { id } = req.params;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// Now you can use dbConnection to execute queries
				const [response] = await dbConnection.query("SELECT * FROM category WHERE id = ?", [id]);
				// console.log(response);

				if (response == '') {
					return res.json({
					   	"isSuccess": false,
					    "message": "Category not found...",
					    "data": []
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"message": "",
						"data": response
					})
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("edit category error: ", error);
	}
}

module.exports.categories_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		"name": name
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM category WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Category not found..."
					})
				}

				else {
			    	const [response2] = await dbConnection.query("UPDATE category SET name = ? WHERE id = ?", [name, id]);
			    	// console.log(response2, !response2);

			    	if (!response2) {
				    	return res.json({
				    		"isSuccess": false,
				    		"message": "Update operation failed..."
				    	})
			    	}

			    	else {
			    		return res.json({
					        "isSuccess": true,
					        "message": "Updated successfully!"
					    });
			    	}
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("update category error: ", error);
	}
}

module.exports.get_all_modules = async (req, res, next) => {
	try {
  		const page = parseInt(req.query.page) || 1;
  		let offset = 0;
  		let itemsPerPage = 10;

  		if (page == 1) {
  			offset = 0;
  		}
  		else {
  			offset += itemsPerPage * (page - 1);
  		}

		async function main() {
			const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			const [response1] = await dbConnection.query("SELECT count(*) as c FROM modules");

			// Now you can use dbConnection to execute queries
			const [response2] = await dbConnection.query(
				"SELECT m.*, c.name as category FROM `modules` as m JOIN category as c ON m.category_id = c.id limit 10 offset ?", 
				[offset]
			);
			// console.log(response);

			if (response2 == '' || response1 == '') {
				return res.json({
				   	"isSuccess": false,
				   	"message": "No data found...",
				    "data": []
				})
			}

			else {
				return res.json({
				   	"isSuccess": true,
				   	"totalCount": response1[0]['c'],
				    "data": response2
				})
			}
		}

		main().catch(err => {
			// console.log("Login error: ", err);
			return res.json({ "isSuccess": false, "message": err.code });
		});
	}

	catch(error) {
		console.log("get modules error: ", error)
	}
}

module.exports.modules_filter = async (req, res, next) => {
	try {
		const searchTerm = req.query.searchTerm != '' ? req.query.searchTerm.trim() : null;

		console.log(searchTerm);

		// SELECT m.*, c.name as category FROM `modules` as m JOIN category as c ON m.category_id = c.id where m.category_id = 2;
	}

	catch(error) {
		console.log("get all modules error: ", error);
	}
}

module.exports.modules_post = async (req, res, next) => {
	try {
		// console.log(req.body);

		const { title, image, video, duration, category } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		title,
		       		image,
		       		video,
		       		duration,
		       		category
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query(
			    	"INSERT INTO `modules`(`title`, `category_id`, `image`, `video`, `duration`) VALUES(?,?,?,?,?)",
			    	[title, category, image, video, duration]
			    );
			    // console.log(response, !response, response.insertId);

			    if (!response) {
					return res.json({
					    "isSuccess": false,
					    "message": "Failed to insert. Try Again..."
					})
				}

				else {
					const createdAt = new Date(); // January is month 0 in JavaScript
    				const formattedDate = createdAt.toISOString().split('T')[0];

					const [response1] = await dbConnection.query(
				    	"INSERT INTO `lessons`(`module_id`, `created_at`) VALUES(?, ?)",
				    	[response.insertId, formattedDate]
				    );

				    // console.log("response1", response1);

				    if (!response1) {
				    	return res.json({
						    "isSuccess": false,
						    "message": "Failed to insert. Try Again..."
						})
				    }

				    else {
				    	return res.json({
				            "isSuccess": true,
				            "message": "Inserted successfully!",
				            "moduleId": response.insertId // Optionally return the new user's ID
				        });
				    }
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("modules post error: ", error);
	}
}

module.exports.modules_edit = async (req, res, next) => {
	try {
		const { id } = req.params;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// Now you can use dbConnection to execute queries
				const [response] = await dbConnection.query("SELECT * FROM modules WHERE id = ?", [id]);
				// console.log(response);

				if (response == "") {
					return res.json({
						"isSuccess": false,
						"message": "Module not found..."
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"message": "",
						"data": response
					})
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("modules edit error: ", error);
	}
}

module.exports.modules_update = async (req, res, next) => {
	try {
		const { id } = req.params;

		const { title, image, video, duration, category } = req.body;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		title,
		       		image,
		       		video,
		       		duration,
		       		category
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM modules WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Module not found..."
					})
				}

				else {
					const [response1] = await dbConnection.query(
						"UPDATE `modules` SET `title`=?,`category_id`=?,`image`=?,`video`=?,`duration`=? WHERE id=?", 
						[title, category, image, video, duration, id]
					);
			    	// console.log(!response1);

			    	if (!response1) {
			    		return res.json({
						    "isSuccess": false,
						    "message": "Failed to update. Try Again..."
						})
			    	}

			    	else {
			    		return res.json({
						    "isSuccess": true,
						    "message": "Success"
						})
			    	}
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("modules update error: ", error);
	}
}

module.exports.modules_get_lessons = async (req, res, next) => {
	try {
		const { id } = req.params;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// Now you can use dbConnection to execute queries
				const [response] = await dbConnection.query("SELECT * FROM modules WHERE id = ?", [id]);
				// console.log(response);

				if (response == "") {
					return res.json({
						"isSuccess": false,
						"message": "Module not found..."
					})
				}

				else {
					const [response1] = await dbConnection.query("SELECT * FROM lessons WHERE module_id = ?", [id]);
					// console.log(response1);

					if (response1 == "") {
						return res.json({
							"isSuccess": false,
							"message": "Lessons not found..."
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"message": "",
							"data": response1
						})
					}
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("get modules lessons error: ", error);
	}
}

module.exports.modules_post_lessons = async (req, res, next) => {
	try {
		// console.log(req.body, req.params);

		const { id } = req.params;

		const { title, description, image, fileCode, duration } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		title,
		       		description,
		       		image,
		       		fileCode,
		       		duration		       	
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM modules WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Module not found..."
					})
				}

				else {
					const [response1] = await dbConnection.query(
						"DELETE FROM `lessons` WHERE module_id = ?", 
						[id]
					);
			    	// console.log(response1);

			    	if (!response1) {
			    		return res.json({
						    "isSuccess": false,
						    "message": "Failed to update. Try Again..."
						})
			    	}

			    	else {
						const cleanedTitle = (typeof title == 'object') ? title.map(i => i.trim()) : [title.trim()];
						const cleanedDescription = (typeof description == 'object') ? description.map(i => i.trim()) : [description.trim()];
						
						const pi = (typeof image == 'object') ? image : [image];
						const fc = (typeof fileCode == 'object') ? fileCode : [fileCode];
						const vl = (typeof duration == 'object') ? duration : [duration];

						const createdAt = new Date(); // January is month 0 in JavaScript
	    				const formattedDate = createdAt.toISOString().split('T')[0];

						const results = await Promise.all(cleanedTitle.map((i, index) => {
						    return dbConnection.query(
						        "INSERT INTO `lessons`(`module_id`, `title`, `description`, `image`, `video`, `video_length`, `created_at`) VALUES(?,?,?,?,?,?,?)",
						        [id, i, cleanedDescription[index], pi[index] || null, fc[index] || null, vl[index] || null, formattedDate]
						    );
						}));

						// console.log(results);

				    	if (results == '') {
				    		return res.json({
							    "isSuccess": false,
							    "message": "Failed to update lessons. Try Again..."
							})
				    	}

				    	else {							
				    		return res.json({
							    "isSuccess": true,
							    "message": "Success"
							})
				    	}
				    }
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("post modules lessons error: ", error);
	}
}

module.exports.modules_delete = async (req, res, next) => {
	try {
		const { id } = req.params;

		// console.log(req.params);

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// Now you can use dbConnection to execute queries
				const [response] = await dbConnection.query("SELECT * FROM `modules` WHERE id = ?", [id]);
				// console.log(response);

				if (response == "") {
					return res.json({
						"isSuccess": false,
						"message": "Module not found..."
					})
				}

				else {
					const [response1] = await dbConnection.query("DELETE FROM `modules` WHERE id = ?", [id]);
					// console.log(response1);

					if (!response1) {
						return res.json({
							"isSuccess": false,
							"message": "Failed to delete. Try Again..."
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"message": ""
						})
					}
				}
			}

			main().catch(error => {
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete modules error: ", error);
	}
}