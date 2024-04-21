import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

export default db;
// mamba jaumba