import mysql from 'mysql2'

export const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Shimla@05",
    database: "social"
})

