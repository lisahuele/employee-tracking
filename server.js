const inquirer = require('inquirer');
const {printTable} = require('console-table-printer');
const db = require('./db/connection');

const viewAllDepartments = require('./lib/Departments')

// Start server after DB connection
db.connect(err => {
    if (err) throw err;

    console.log(`
================================

        EMPLOYEE TRACKER

================================
    `);
    promptUser();
});

function promptUser() {

    function directory() {
        inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee"
                ]
            }
        ])
        .then(function(input) {
            switch(input.choice) {
                case "View All Departments":
                    viewAllDepartments();
                break;
            }
        })
    }
}