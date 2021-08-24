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
    }])
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

//------- VIEW ALL DEPARTMENTS ------- //
function viewAllDepartments() {
    const sql = `SELECT id, name AS Departments FROM departments ORDER BY id`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        printTable(rows);
        promptUser();
    });
};

//--------- VIEW ALL ROLES --------- //
function viewAllRoles() {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department_name 
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        printTable(rows);
        promptUser();
    });
};
//------- VIEW ALL EMPLOYEES ------- //
function viewAllEmployees() {
    const sql = `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager 
                FROM employees 
                INNER JOIN roles ON roles.id = employees.role_id 
                INNER JOIN departments ON departments.id = roles.department_id 
                LEFT JOIN employees e ON employees.manager_id = e.id`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        printTable(rows);
        promptUser();
    });
};

//-------- SELECT ROLE -------- //
var rolesArr = [];
function selectRole() {
  db.query(`SELECT * FROM roles`, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }

  })
  return rolesArr;
};

//-------- SELECT MANAGER -------- //
var managersArr = [];
function selectManager() {
  db.query(`SELECT first_name, last_name FROM employees WHERE manager_id IS NULL`, function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
};

//-------- ADD DEPARTMENTS -------- //
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
            promptUser();
        });
    })
};

//-------- ADD ROLE -------- //
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
        }
    ])
    .then(function(res) {
        const sql = `INSERT INTO roles (title, salary) VALUES (?,?)`;
        const params = [res.name, res.salary];
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log({
                message: 'Success',
                changes: result.affectedRows
            });
            promptUser();
        });
    })
};

//-------- UPDATE EMPLOYEE -------- //
function updateEmployee() {
    db.query(`SELECT employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;`, function(err, res) {
        if (err) throw err

    inquirer.prompt([
        {
            name: "lastname",
            type: "list",
            message: "What is the employee's last name?",
            choices: function() {
                var lastName = [];
                for (var i = 0; i < res.length; i++) {
                    lastName.push(res[i].last_name);
                  }
                  return lastName;
                }
        },
        {
            name: "role",
            type: "rawlist",
            message: "What is the Employee's new title?",
            choices: selectRole()
        }
    ])
    .then(function (val) {
        const sql = `UPDATE employees SET role_id = ? WHERE last_name = ?`;
        const roleId = selectRole().indexOf(val.role) + 1;
        const params = [roleId, val.lastname];

        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log({
                message: 'Success',
                changes: result.affectedRows
            });
            promptUser();
        });
    });
});
}

//-------- ADD EMPLOYEE -------- //
function addEmployee() {
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name"
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name"
        },
        {
          name: "role",
          type: "list",
          message: "What is their role?",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
        const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES (?,?,?,?)`;
        const roleId = selectRole().indexOf(val.role) + 1;
        const managerId = selectManager().indexOf(val.choice) + 1;
        const params = [val.firstname, val.lastname, managerId, roleId];

        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log({
                message: 'Success',
                changes: result.affectedRows
            });
            promptUser();
        });
  })
};