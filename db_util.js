const mysql = require('mysql2');
// Enable access to .env variables
require('dotenv').config();

// Class to login to the database and all SQL statements
class db_util {
    constructor() {
        this.db = mysql.createConnection(
            {
                host: 'localhost',
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            }
        )
    }

    getDepartments() {
        const getDepartmentSQL = `SELECT id ID, name Dept FROM department`;
        return new Promise((resolve, reject) => {
            this.db.query(getDepartmentSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getDepartmentForNewRole() {
        const getDepartmentForNewRoleSQL = `SELECT name, id value FROM department`;
        return new Promise((resolve, reject) => {
            this.db.query(getDepartmentForNewRoleSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getRoles() {
        const selectRoleSQL = `SELECT title name, id value FROM role`;
        return new Promise((resolve, reject) => {
            this.db.query(selectRoleSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getRoleInfo() {
        const getRoleInfoSQL = `SELECT role.id ID, role.title Title, department.name Dept, role.salary Salary FROM role 
            JOIN department WHERE department.id = role.department_id`;
        return new Promise((resolve, reject) => {
            this.db.query(getRoleInfoSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getEmployees() {
        const showEmployeesSQL = `SELECT employee.id EmployeeID, employee.first_name FirstName, employee.last_name LastName,
        role.title Title, department.name Dept, role.salary Salary, concat(manager.first_name, ' ', manager.last_name) Manager
        FROM employee 
        LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id
        INNER JOIN role ON employee.role_id = role.id  
        INNER JOIN department ON department.id = role.department_id `;
        return new Promise((resolve, reject) => {
            this.db.query(showEmployeesSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getManager() {
        const getManagerSQL = `SELECT concat(employee.first_name, employee.last_name) name, role.title value
        FROM employee JOIN role WHERE role.id = employee.role_id and role.title = "Manager" `; 
        return new Promise((resolve, reject) => {
            this.db.query(getManagerSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getManagerName() {
        const getManagerNameSQL = `SELECT concat(employee.first_name, employee.last_name) name, employee.id value
        FROM employee JOIN role WHERE role.id = employee.role_id and role.title = "Manager" `; 
        return new Promise((resolve, reject) => {
            this.db.query(getManagerNameSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        }); 
    };

    updateEmployeeRole(roleID, employeeID) {
        const roleAndID = [roleID, employeeID];
        const updateEmployeeRoleSQL = `UPDATE employee SET role_id = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.query(updateEmployeeRoleSQL, roleAndID, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    addDepartment(departmentName) {
        const addDepartmentSQL = `INSERT INTO department (name) VALUES (?)`;
        return new Promise((resolve, reject) => {
            this.db.query(addDepartmentSQL, departmentName, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    addRole(roleName, roleSalary, deptID) {
        const addRoleNameSQL = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.query(addRoleNameSQL, [roleName, roleSalary, deptID], (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    addEmployee(first_name, last_name, role_id, manager_id) {
        const addNewEmployeeSQL = `INSERT INTO employee (first_name, last_name, role_id, manager_id ) VALUES (?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.query(addNewEmployeeSQL, [first_name, last_name, role_id, manager_id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    getBudgets() {
        const getBudgetSQL = `SELECT department.name, sum(salary) TotalSalary 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN DEPARTMENT ON role.department_id = department.id
        GROUP BY role.department_id`;
        return new Promise((resolve, reject) => {
            this.db.query(getBudgetSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    getEmployeeList() {
        const getEmmployeeListSQL = `SELECT concat(first_name, ' ', last_name) name, id value FROM employee`;
        return new Promise((resolve, reject) => {
            this.db.query(getEmmployeeListSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    showEmployeeManagers() {
        const showEmployeeManagersSQL = `SELECT concat(manager.first_name, ' ', manager.last_name) Manager, 
        employee.first_name FirstName, employee.last_name LastName, role.title Title
        FROM employee 
        LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id
        INNER JOIN role ON employee.role_id = role.id  
        INNER JOIN department ON department.id = role.department_id
        WHERE employee.manager_id != "NULL"
        ORDER BY manager.last_name, manager.first_name;`
        return new Promise((resolve, reject) => {
            this.db.query(showEmployeeManagersSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        }); 
    };

    showEmployeeDepartment() {
        const getEmployeeDepartmentSQL = `SELECT department.name Department, concat(employee.first_name, ' ', employee.last_name) Name
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON department.id = role.department_id
        GROUP BY department.name, employee.last_name, employee.first_name
        ORDER BY department.name`;
        return new Promise((resolve, reject) => {
            this.db.query(getEmployeeDepartmentSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

}

module.exports = db_util;