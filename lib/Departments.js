const db = require('../db/connection');
const {printTable} = require('console-table-printer');
const promptUser = require('../server');

// view all departments
function viewAllDepartments() {
    const sql = `SELECT id, name AS Departments FROM departments`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
       printTable(rows);
    });
};

module.exports = viewAllDepartments;