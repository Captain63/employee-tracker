DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

-- Departments table section
CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

-- Creates sample records for departments table
INSERT INTO departments (name) VALUES ("C-Suite");
INSERT INTO departments (name) VALUES ("Sales");
INSERT INTO departments (name) VALUES ("Marketing");
INSERT INTO departments (name) VALUES ("Facilities");

-- Roles table section
CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8, 2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES departments(id)
);

-- Creates sample records for roles table
INSERT INTO roles (title, salary, department_id) VALUES ("CEO", 100000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("Sales Manager", 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("Sales Person", 60000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Manager", 70000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Coordinator", 50000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ("Facilities Manager", 65000, 4);

-- Employees table declaration
CREATE TABLE employees(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_id INT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id),
    FOREIGN KEY(role_id) REFERENCES roles(id)
);

-- Creates sample records for employees table
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Steve", "Rogers", null, 1);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Sam", "Wilson", 1, 4);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Bucky", "Barnes", 1, 2);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Natasha", "Romanov", 1, 6);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Phil", "Coulson", 3, 3);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Nick", "Fury", 3, 3);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Grant", "Ward", 2, 5);
INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES ("Belinda", "Mae", 2, 5);