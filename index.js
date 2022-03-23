// Required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


// Require the db_util that has all sql and functions
const db_util = require('./db_util');

// Create an instance of db_util class
const db = new db_util();

// Show banner when started
showBanner = () => {

    console.log("-----------------------------------------------");
    console.log(" _____                 _                       ");
    console.log("| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ ");
    console.log("|  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\");
    console.log("| |___| | | | | | |_) | | (_) | |_| |  __/  __/");
    console.log("|_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|");
    console.log("                |_|            |___/           ");
    console.log( "__  __                                   ");
    console.log("|  \\/  | __ _ _ __   __ _  __ _  ___ _ __ ");
    console.log("| |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|");
    console.log("| |  | | (_| | | | | (_| | (_| |  __/ |   ");
    console.log("|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   ");
    console.log("                          |___/           ");
    console.log("-----------------------------------------------");
}

// Default questions to access employee DB
const showOptions = () => {
    inquirer.prompt([
        {
            name: "question",
            type: "list",
            pageSize: 10,
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
                "Show Employees by Manager",
                "Show Employees by Department",
            ],
        },
    ])
        .then((answer) => {
            const choices = answer.question;
            console.log(choices);
            switch (choices) {
                case "View All Departments":
                    showDepartments();
                    break;
                case "View All Roles":
                    showRoles();
                    break;
                case "View All Employees":
                    showEmployees();
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
                case "Show Employees by Manager":
                    showEmployeeManagers();
                    break;
                case "Show Employees by Department":
                    showEmployeeDepartment();
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
            db.addDepartment(answer.addDepartment)
                .then(results => {
                    console.log("Added " + answer.addDepartment + " to the database");
                    showOptions();
                })
        });
};

// Code to add a new Role
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
        .then(salaryRoleAnswer => {
            db.getDepartmentForNewRole()
                .then(results => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'deptName',
                            message: "What is the name of the department this role is in?",
                            choices: results
                        },
                    ])

                        .then(answer => {
                            db.addRole(salaryRoleAnswer.roleName, salaryRoleAnswer.roleSalary, answer.deptName)
                                .then(results => {
                                    console.log("Added " + salaryRoleAnswer.roleName + " making " + salaryRoleAnswer.roleSalary + " salary to the database");
                                    showOptions();

                                })
                        })
                })
        })
};

// Code to add a new Employee
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
            db.getRoles()
                .then(results => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'roleName',
                            message: "What is the employee's role?",
                            choices: results
                        },
                    ])
                        .then(employeeRole => {
                            db.getManagerName()
                                .then(results => {
                                    inquirer.prompt([
                                        {
                                            type: 'list',
                                            name: 'managerName',
                                            message: "Who is the employee's manager?",
                                            choices: results
                                        },
                                    ])
                                        .then(mangerAnswer => {
                                            db.addEmployee(names.first_name, names.last_name, employeeRole.roleName, mangerAnswer.managerName)
                                            console.log("Added " + names.first_name, names.last_name + " to the database");
                                            showOptions();
                                        })
                                })

                        })
                })
        });
};

// Code to update an Employee Role
updateEmployee = () => {
    db.getEmployeeList()
        .then(results => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeID',
                    message: "Which employee's role do you want to update?",
                    choices: results
                }
            ])
                .then(employeeAnswer => {
                    db.getRoles()
                        .then(results => {
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'roleID',
                                    message: 'What is the employees new role?',
                                    choices: results
                                }
                            ])
                                .then(roleAnswer => {
                                    db.updateEmployeeRole(roleAnswer.roleID, employeeAnswer.employeeID)
                                        .then(results => {
                                            console.log(employeeAnswer.employeeID + " has been updated!");
                                            showOptions();
                                        })

                                });
                        });
                });
        });
};

// Code to show a list of Employees
showEmployees = () => {
    db.getEmployees()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        });
};

// Code to show a list of Roles
showRoles = () => {
    db.getRoleInfo()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
};

// Code to show a list of Departments
showDepartments = () => {
    db.getDepartments()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
};

// Code to show the budgets for each department
showBudgets = () => {
    db.getBudgets()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
};


// Code to show the managers for every employee
showEmployeeManagers = () => {
    db.showEmployeeManagers()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
};

// Code to show the managers for every employee
showEmployeeDepartment = () => {
    db.showEmployeeDepartment()
        .then(results => {
            console.table(results);
            console.log("-----------------")
            showOptions();
        })
};

// Call this to start adding/showing new employees to the database
showBanner();
showOptions();
