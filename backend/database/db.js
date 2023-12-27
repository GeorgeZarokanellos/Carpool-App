const {Pool} = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});


const test_connection = async () => {
    try {
        await pool.connect();
        console.log('Connected to database');
        const result = await pool.query('SELECT * FROM App_user;');
        console.log('Query successful');
        pool.end();
        return result.rows;
    } catch (error) {
        console.log('Error connecting to database');
    }
    // return pool.query('SELECT NOW()');
}

const add_user = (user) => {
    // university_id, first_name, last_name, username, password, email, role, phone, rating, overall_points
    const query = `INSERT INTO App_user
    (university_id, first_name, last_name, username, password, email, role, phone) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    const values = [user.university_id, user.first_name, user.last_name, user.username, user.password, user.email, user.role, user.phone];
    return pool.query(query, values);
}


module.exports = { test_connection, add_user};