const mysql = require('mysql2');

// Class to login to the database and all SQL statements
class db_util {
    constructor() {
        this.db = mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'employee_db'
            }
        )
    }

    getDepartments() {
        const getDepartmentSQL = `select id ID, name Dept from department`;
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
        const getDepartmentForNewRoleSQL = `select name, id value from department`;
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
        const selectRoleSQL = `select title name, id value from role`;
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
        const getRoleInfoSQL = `select role.id ID, role.title Title, department.name Dept, role.salary Salary from role 
            JOIN department where department.id = role.department_id`;
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
        const showEmployeesSQL = `select employee.id EmployeeID, employee.first_name FirstName, employee.last_name LastName,
        role.title Title, department.name Dept, role.salary Salary, concat(manager.first_name, ' ', manager.last_name) Manager
        FROM employee 
        LEFT OUTER JOIN employee manager on employee.manager_id = manager.id
        INNER JOIN role on employee.role_id = role.id  
        INNER JOIN department on department.id = role.department_id `;
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
        const getManagerSQL = `select concat(employee.first_name, employee.last_name) name, role.title value
        from employee JOIN role where role.id = employee.role_id and role.title = "Manager" `; 
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
        const getManagerNameSQL = `select concat(employee.first_name, employee.last_name) name, employee.id value
        from employee JOIN role where role.id = employee.role_id and role.title = "Manager" `; 
        return new Promise((resolve, reject) => {
            this.db.query(getManagerNameSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        }); 
    }
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
    }

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
    }

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
    }

    getBudgets() {
        const getBudgetSQL = `SELECT department.name Dept, sum(role.salary) TotalSalary
        FROM role JOIN department on department.id = role.department_id 
        GROUP BY department.name `;
        return new Promise((resolve, reject) => {
            this.db.query(getBudgetSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    getEmployeeList() {
        const getEmmployeeListSQL = `select concat(first_name, ' ', last_name) name, id value from employee`;
        return new Promise((resolve, reject) => {
            this.db.query(getEmmployeeListSQL, (error, results) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}

module.exports = db_util;