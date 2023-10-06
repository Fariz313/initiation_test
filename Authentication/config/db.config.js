const mysql = require('mysql2/promise');
// MySQL database connection details
let dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
};
if(process.env.DB_PASSWORD !=''){
    dbConfig.password=process.env.DB_PASSWORD
}
// Create a MySQL pool
const pool = mysql.createPool(dbConfig);
module.exports = {
    pool
  };