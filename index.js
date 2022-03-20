// Required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connection string to DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
);

// Default questions to access employee DB
const showOptions = () => {
    inquirer.prompt([
        {
            name: "question",
            type: "list",
            message: 'What would you like to do?',
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "Update Employee Role",
            ],
        },
    ])
        .then((answer) => {
            const choices = answer.question;
            console.log(choices);
            switch (choices) {
                case "View All Departments":
                    listDepartments();
                    break;
                case "View All Roles":
                    listRoles();
                    break;
                case "View All Employees":
                    listEmployees();
                    break;
                case "Add A Department":
                    addDepartment();
                    break;
                case "Add A Role":
                    addRole();
                    break;
                case "Add An Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployee();
                    break;
                default:
                    break;
            }

        })
};

// Code to add a new Department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: "What is the name of the department?",
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter a department name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, answer.addDepartment, (err, result) => {
                if (err) throw err;
                console.log("Added " + answer.addDepartment + " to the database");

                showOptions();
            });
        });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: "What is the name of the role?",
            validate: roleName => {
                if (roleName) {
                    return true;
                } else {
                    console.log('Please enter a role name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "What is the salary for the role?",
            validate: roleSalary => {
                if (roleSalary) {
                    return true;
                } else {
                    console.log('Please enter a role salary');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const roleParams = [answer.roleName, answer.roleSalary];

            const getDepartmentsSQL = `select name, id value from department`;
            db.query(getDepartmentsSQL, (err, results) => {

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'deptName',
                        message: "What is the name of the department this role is in?",
                        choices: results
                    },
                ])
                    .then(answer => {
                        const deptID = answer.deptName;
                        console.log(answer);
                        roleParams.push(deptID);

                        const addRoleSQL = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                        db.query(addRoleSQL, roleParams, (err, results) => {
                            console.log("You added a role!");
                            showOptions();
                        })
                    })
            })
        });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('Please enter the first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('Please enter the last name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'role',
            message: "What is the employee's role?",
            validate: role => {
                if (role) {
                    return true;
                } else {
                    console.log('Please enter the employee role');
                    return false;
                }
            }
        },

    ])
        .then(answer => {
            const fullName = [answer.firstName, answer.lastName];
            // Determine what department
            const listDepartmentsSQL = `select name from department`;
            db.query(listDepartmentsSQL, (err, results) => {

            }

            )

            const sql = `INSERT INTO emmployee (first_name, last_name, role, manager) VALUES (?)`;
            db.query(sql, answer.addEmployee, (err, result) => {
                if (err) throw err;
                console.log("Added " + answer.addEmployee + " to the database");

                listEmployees();
            });
        });
};

updateEmployee = () => {
    const emmployeeList = `select concat(first_name, ' ', last_name) name, id value from employee`;
    db.query(emmployeeList, (err, results) => {

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeID',
                message: "Which employee's role do you want to update?",
                choices: results
            }
        ])
            .then(employeeAnswer => {
                const selectRoleSQL = `select title name, id value from role`;
                db.query(selectRoleSQL, (err, results) => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'roleID',
                            message: 'What is the employees new role?',
                            choices: results
                        }
                    ])
                        .then(roleAnswer => {
                            roleAndID = [roleAnswer.roleID, employeeAnswer.employeeID];
                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                            db.query(sql, roleAndID, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");
                                showOptions();
                            })

                        });
                });
            });
    });
}

    // Join all 3 tables together, including manager to itself to link manager_id and id
    listEmployees = () => {
        const sql = `select employee.id EmployeeID, employee.first_name FirstName, employee.last_name LastName,
        role.title Role, department.name Dept, role.salary Salary, concat(manager.first_name, ' ', manager.last_name) Manager
        from employee 
        LEFT OUTER JOIN employee manager on employee.manager_id = manager.id
        INNER JOIN role on employee.role_id = role.id  
        INNER JOIN department on department.id = role.department_id
        `;
        db.query(sql, function (err, results) {
            console.table(results);
            console.log("-----------------")
            showOptions();
        });
    };

    listRoles = () => {
        const sql = `select role.title Role, role.id ID, department.name Dept, role.salary Salary 
    from role JOIN department where department.id = role.department_id`;
        db.query(sql, function (err, results) {
            console.table(results);
            console.log("-----------------")
            showOptions();
        });
    };

    listDepartments = () => {
        const sql = `select name Dept, id ID from department`;
        db.query(sql, function (err, results) {
            console.table(results);
            console.log("-----------------")
            showOptions();
        });
    };

    showOptions();
