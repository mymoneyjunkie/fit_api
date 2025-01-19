const express = require("express");

const cors = require('cors');

// const dbConnectionPromise = require('./db');

const cookieParser = require("cookie-parser");

const loginRoute = require("./routes/login");

const registerRoute = require("./routes/register");

const authRoute = require("./routes/authRoute");

const adminRoute = require("./routes/adminRoute");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    // req.headers("", "*");
    res.setHeader("Content-Type", "application/json");
    next();
})

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/admin", adminRoute);

app.use((req, res, next) => {
    const error = new Error("Page Not Found!");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        "isSuccess": false,
        "message": error.message
    })
})

// app.post("/", async (req, res, next) => {
// 	// res.setHeader('Content-Type', 'text/plain');
// 	// res.setHeader('Content-Type', 'application/form-data');
  
//   	// console.log('Headers:', req.headers);
//   	console.log(req.body);

// 	return res.send("post method");
// })

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});