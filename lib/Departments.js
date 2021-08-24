const db = require('../db/connection');
const {printTable} = require('console-table-printer');
const promptUser = require('../server');
const inquirer = require('inquirer');

// view all departments
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What department would you like to add?",
            validate: function(input) {
                if(input === '' ) {
                    return 'Please provide a valid department name';
                } 
                return true;
            }
    }])
    .then(function(res) {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        db.query(sql, res.name, (err, result) => {
            if(err) throw err;
            console.log({
                message: 'Success',
                changes: result.affectedRows
            });
        });
    })
};

module.exports = addDepartment;