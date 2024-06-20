const db = require('../db/connection');
const bcrypt = require('bcrypt');

exports.findByUsername = async(username) => {
    const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if(userExists.rows.length ===0) {
        return Promise.reject({ status: 404, message: "User does not exist" });
    }

    return userExists.rows[0];
}

    exports.findById = async(id) => {
        const userExists = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if(userExists.rows.length ===0) {
            return Promise.reject({ status: 404, message: "User does not exist" });
        }
        return userExists.rows[0];
    }

    exports.createUser = async(username, password, email, role) => {

         // Check if the username already exists
        const usernameExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (usernameExists.rows.length !== 0) {
            return Promise.reject({ status: 404, message: "Username already exists." });
        }

        // Check if the email already exists
        const emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length !== 0) {
            return Promise.reject({ status: 404, message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (username, hashed_password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, email, role]
        );
        return result.rows[0];
    }

    exports.fetchAllUsers = () => {
        return db.query("SELECT id, username, email, role FROM users;")
        .then(({rows})=> {
            return rows;
        })
    }
 
 