// db.js

const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: '193.203.169.108', // The public IP or domain of your MySQL server
//   user: 'abcd',
//   password: 'ta/96(d-7OJP-5cK', // Your database password
//   database: 'fitness_db',
//   port: 3306
// });

const connection = mysql.createConnection({
  host: '88.223.92.202', // The public IP or domain of your MySQL server
  user: 'abcd',
  password: 'vscHf4M9/B*On[k_', // Your database password
  database: 'fitness_db',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

// Export the connection object
module.exports = connection.promise();


// async function createConnection() {
//     try {
//         // Create a connection
//         const connection = await mysql.createConnection({
//           host: '88.223.92.202', // The public IP or domain of your MySQL server
//           user: 'abcd',
//           password: 'vscHf4M9/B*On[k_', // Your database password
//           database: 'fitness_db',
//           port: 3306
//         });

//         console.log('Connected to database successfully');

//         // Export the connection object for use in other modules
//         return connection;
//     } catch (error) {
//         console.error('Error connecting to database:', error);
//         throw error; // Rethrow the error for handling in the calling code
//     }
// }

// // Export the connection using an async function
// module.exports = createConnection;
