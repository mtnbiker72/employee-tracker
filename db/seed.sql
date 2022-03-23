INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior IT", 100000, 2),
       ("Manager", 150000, 3),
       ("Lawyer", 200000, 4),
       ("Accountant 1", 80000, 3),
       ("Sales Engineer", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Heather", "Graham", 1, 7),
       ("Joy", "Bob", 4, 8),
       ("Larry", "Wilmore", 3, 8),
       ("Jermey", "Irons", 1, 8),
       ("Michelle", "Newton", 5, 7),
       ("Jon", "Stewart", 3, 7),
       ("Boss", "Man", 2, NULL),
       ("Boss", "Woman", 2, NULL);
       
