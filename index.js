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
                "Show Department Budgets",
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
                case "Show Department Budgets":
                    showBudgets();
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
            name: 'first_name',
            message: "What is the first name of the employee?",
            validate: first_name => {
                if (first_name) {
                    return true;
                } else {
                    console.log('Please enter the first name of the employee');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the last name of the employee?",
            validate: last_name => {
                if (last_name) {
                    return true;
                } else {
                    console.log('Please the last name for the employee');
                    return false;
                }
            }
        }
    ])
        .then(names => {
            const newEmployeeData = [names.first_name, names.last_name];

            const getRoleSQL = `select title name, id value from role`;
            db.query(getRoleSQL, (err, results) => {
                if (err) throw error;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleName',
                        message: "What is the employee's role?",
                        choices: results
                    },
                ])
                    .then(employeeRole => {
                        const roleID = employeeRole.roleName;
                        newEmployeeData.push(roleID);
                        console.log(newEmployeeData);


                const getManager = `select concat(employee.first_name, employee.last_name) name, role.title value
                        from employee JOIN role where role.id = employee.role_id and role.title = "Manager" `;
                db.query(getManager, (err, results) => {

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'managerName',
                            message: "Who is the employee's manager?",
                            choices: results
                        },
                    ])
                        .then(mangerAnswer => {
                            const managerID = mangerAnswer.managerName;
                            newEmployeeData.push(managerID);
                            
                            console.log(newEmployeeData);
                            showOptions();
                        })
                    })

                })
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
            role.title Title, department.name Dept, role.salary Salary, concat(manager.first_name, ' ', manager.last_name) Manager
            FROM employee 
            LEFT OUTER JOIN employee manager on employee.manager_id = manager.id
            INNER JOIN role on employee.role_id = role.id  
            INNER JOIN department on department.id = role.department_id `;
        db.query(sql, function (err, results) {
            console.table(results);
            console.log("-----------------")
            showOptions();
        });
    };

    // listRoles = () => {
    //     const sql = `select role.id ID, role.title Role, department.name Dept, role.salary Salary 
    // from role JOIN department where department.id = role.department_id`;
    //     db.promise().query(sql)
    //     .then(results => {
    //         return results})
    //     }

    //     function (err, results) {
    //         console.table(results);
    //         console.log("-----------------")
    //         showOptions();
    //     });
    // };

    // listRoles = () =>{
    //     return new Promise((resolve, reject) => {

    //         db.query('query1',  (error, results)=>{
    //             if(error){
    //                 return reject(error);
    //             }
    //             return resolve(results);
    //         });
    //     });
    // };

    listRoles = () => {
            return new Promise((resolve, reject)=>{
                db.query(`SELECT * FROM role`, (error, results) => {
                    if(error) {
                        return reject(error);
                    }
                    console.table(results);
                    return resolve(results);
                });
            });
        };

    listDepartments = () => {
        const sql = `select id ID, name Dept from department`;
        db.query(sql, (err, results) => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
    };

    showBudgets = () => {
        const budgetSQL = `SELECT department.name Dept, sum(role.salary) TotalSalary
            FROM role JOIN department on department.id = role.department_id 
            GROUP BY department.name `;
            db.query(budgetSQL, (err, results) => {
                console.table(results);
                console.log("-----------------")
                showOptions();
            })
        };

    showOptions();
