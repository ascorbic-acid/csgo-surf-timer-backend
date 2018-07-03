const mysql = require('mysql');


function queryDb(sql) {

    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
        var connection = mysql.createPool({
            connectionLimit: 100,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DBNAME,
            multipleStatements: true
          })
        connection.query(sql, function (err, results, fields) {

            if (err) {
                return reject(err);
            }
            connection.end();
            resolve(results);
            
        });
    });
}
module.exports = queryDb;