const inquirer = require('inquirer');
const {printTable} = require('console-table-printer');
const db = require('./db/connection');



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

                case "View All Roles":
                    viewAllRoles();
                break;

                case "View All Employees":
                    viewAllEmployees();
                break;

                case "Add a Department":
                    addDepartment();
                break;

                case "Add a Role":
                    addRole();
                break;

                case "Add an Employee":
                    addEmployee();
                break;

                case "Update an Employee":
                    updateEmployee();
                break;
            }
        })
    };

   function viewAllDepartments() {
        const sql = `SELECT id, name AS Departments FROM departments`;
        db.query(sql, (err, rows) => {
            if(err) throw err;
            printTable(rows);
            directory();
        });
    };

    function viewAllRoles() {
        const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department_name 
                    FROM roles
                    LEFT JOIN departments ON roles.department_id = departments.id`;
        db.query(sql, (err, rows) => {
            if(err) throw err;
            printTable(rows);
            directory();
        });
    };

    function viewAllEmployees() {
        const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN employees e ON employees.manager_id = e.id`;
        db.query(sql, (err, rows) => {
            if(err) throw err;
            printTable(rows);
            directory();
        });
    };

    directory();
}