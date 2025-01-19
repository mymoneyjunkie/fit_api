const { Router } = require("express");

const { body, param, validationResult } = require("express-validator");

const { 
	categories_get, 
	categories_post, 
	categories_edit, 
	categories_update, 
	modules_post, 
	modules_edit,
	modules_update,
	modules_get_lessons,
	modules_post_lessons,
	modules_delete,
	get_all_modules 
} = require("../controllers/adminController");

const router = Router();

// get all category
router.get("/category", categories_get);

// post category
router.post("/category",
	[
		body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid category found")
	],
	categories_post
);

// get category by id
router.get("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	],
	categories_edit
);

// update category
router.post("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
        body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid category found")
	],
	categories_update
);

// get all modules
router.get("/modulesAll", get_all_modules);

// post module
router.post("/modules",
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Title..."),
	    body("image").trim().notEmpty().withMessage("Module Image is required").escape(),
	    body("video").trim().notEmpty().withMessage("Module Video is required").escape(),
	    body("duration").trim().notEmpty().withMessage("Module Video is required"),
	    body("category").trim().notEmpty().withMessage("Category is required").isInt().withMessage("Category is required"),
  	],
 	modules_post
);

// get module by id
router.get("/modules/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	modules_edit
);

// update module
router.post("/modules/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Title..."),
	    body("image").trim().notEmpty().withMessage("Module Image is required").escape(),
	    body("video").trim().notEmpty().withMessage("Module Video is required").escape(),
	    body("duration").trim().notEmpty().withMessage("Module Video is required"),
	    body("category").trim().notEmpty().withMessage("Category is required").isInt().withMessage("Category is required"),
  	],
 	modules_update
);

// get lessons by id
router.get("/moduleLessons/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	modules_get_lessons
);

// post/update module
router.post("/moduleLessons/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),

        body('title')
		    .custom(value => {
		        // Check if the value is either a string or an array
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Title must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(title => title.trim() === '')) {
		            throw new Error('Lesson Title must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Title must be a string or an array.');
		        }
		        return true;
		        
		      // .custom(value => {
		      //   if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		      //     throw new Error('Episode Title must not be empty.');
		      //   }
		      //   return true;
		    }),

	    body('description')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Description must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Description must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Description must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Description must not be empty.');
		        // }
		        // return true;
		    }),

	    body('image')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Image must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Image must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Image must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Image must not be empty.');
		        // }
		        // return true;
		    }),

	    body('fileCode')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Video must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Video must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Video must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Video must not be empty.');
		        // }
		        // return true;
		   	}),

		body('duration')
		    .custom(value => {
		        // console.log(typeof value, value);
		        if (typeof value === 'number') {
		            if (value <= 0) {
		                throw new Error('Lesson duration must be a positive number.');
		            }
		        } else if (Array.isArray(value)) {
		            if (value.length === 0 || value.some(dur => typeof dur !== 'number' || dur <= 0)) {
		                throw new Error('All elements in Lesson duration array must be positive numbers.');
		            }
		        } else {
		            throw new Error('Lesson duration must be a positive number or an array of positive numbers.');
		        }
		        return true;
		    }),
  	], 
	modules_post_lessons
);

// delete module
router.get("/moduleDelete/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
    ], 
    modules_delete
);

module.exports = router;