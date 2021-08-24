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
        const sql = `SELECT id, name AS Departments FROM departments ORDER BY id`;
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
        const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager 
                    FROM employees 
                    INNER JOIN roles ON roles.id = employees.role_id 
                    INNER JOIN departments ON departments.id = roles.department_id 
                    LEFT JOIN employees e ON employees.manager_id = e.id`;
        db.query(sql, (err, rows) => {
            if(err) throw err;
            printTable(rows);
            directory();
        });
    };

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
                directory();
            });
        })
    };

    function addRole() {
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What role would you like to add?",
                validate: function(input) {
                    if(input === '' ) {
                        return 'Please provide a valid role';
                    } 
                    return true;
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary?",
                validate: function(input) {
                    if(input === '' ) {
                        return 'Please provide a valid salary';
                    } 
                    return true;
                }
            },
            {
                type: "rawlist",
                name: "department",
                message: "Which department does this role belong to?",
                validate: function(input) {
                    if(input === '' ) {
                        return 'Please provide a valid department';
                    } 
                    return true;
                },
                choices: role()
            }
        ])
        .then(function(res) {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
            const params = [res.name, res.salary, res.department.val];
            db.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log({
                    message: 'Success',
                    changes: result.affectedRows
                });
                directory();
            });
        })
    };

    directory();
}

var rolesArr = [];
function role() {
  db.query(`SELECT * FROM departments`, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].id, name);
    }

  })
  return rolesArr;
}

var managersArr = [];
function manager() {
  db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}