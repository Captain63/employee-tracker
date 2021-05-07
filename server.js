// Install dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");

// Import connection.js module for SQL server connection
const connection = require("./config/connection");

// Object for showMenu to run inquirer
const menu = {
    type: "list",
    message: "What would you like to do?",
    // Paths for application
    choices: [
        "View employees",
        "View roles",
        "View departments",
        "View employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Exit"
    ],
    name: "menuResponse"
}

// viewData function
const viewData = operation => {
    switch (operation) {

        // Show all employees
        case "employees":
            // Defines query before passing into connection.query
            let query1 =
                'SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.name ';
            query1 +=
                'FROM employees INNER JOIN roles ON employees.role_id = roles.id ';
            query1 +=
                'INNER JOIN departments ON roles.department_id = departments.id ORDER BY employees.id';
            
            // Retrieves data from SQL serverew
            connection.query(query1, (err, res) => {
                if (err) throw new Error(err);

                // Assigns resulting data to employeeData variable
                const employeeData = res;

                // Initializes empty array to host reformatted employee data
                const updatedEmployeeArray = [];

                // Destructures each record for reformatting
                employeeData.forEach(({ id, first_name, last_name, manager_id, title, salary, name }) => {
                    // Checks that manager_id property is not null
                    if (manager_id) {
                        // Pulls index number of employee record whose id matches the manager id
                        const managerIndex = employeeData.findIndex(item => item.id === manager_id);

                        // Rewrites manager_id property to show first and last name of manager instead of manager_id
                        manager_id = `${employeeData[managerIndex].first_name} ${employeeData[managerIndex].last_name}` 
                    } else {
                        manager_id = "No manager";
                    }

                    // Assigns new names for each table column
                    updatedEmployeeArray.push(
                        {
                            id: id,
                            "first name": first_name,
                            "last name": last_name,
                            "manager name": manager_id,
                            title: title,
                            salary: salary,
                            department: name
                        }
                    );
                })

                // Displays reformatted employee records to console in table format
                console.table(updatedEmployeeArray);
            })
            break;

        // Show all roles
        case "roles":
            connection.query("SELECT id, title, salary FROM roles", (err, res) => {
                if (err) throw new Error(err);

                // Displays results to console in table format
                console.table(res);
            })

            break;

        // Show all departments
        case "departments":
            connection.query("SELECT id, name FROM departments", (err, res) => {
                if (err) throw new Error(err);

                // Assigns resulting data to deptData variable
                const deptData = res;

                // Initializes empty array to host reformatted department data
                const updatedDeptArray = [];

                deptData.forEach(({ id, name }) => {
                    updatedDeptArray.push(
                        // Assigns new column names for data
                        {
                            id: id,
                            department: name
                        }
                    );
                })

                // Displays results to console in table format
                console.table(updatedDeptArray);
            })

            break;

        // Show employees by manager
        case "employees by manager":
            let query2 =
                'SELECT employees.manager_id, employees.id, employees.first_name, employees.last_name, roles.title, departments.name ';
            query2 +=
                'FROM employees INNER JOIN roles ON employees.role_id = roles.id ';
            query2 +=
                'INNER JOIN departments ON roles.department_id = departments.id ORDER BY employees.manager_id';
            
            connection.query(query2, (err, res) => {
                if (err) throw new Error(err);

                // Assigns resulting data to managerData variable
                const managerData = res;

                // Initializes empty array to host reformatted manager + employee data
                const updatedManagerArray = [];

                // Destructures each record for reformatting
                managerData.forEach(({ manager_id, id, first_name, last_name, title, name }) => {
                    // Checks that manager_id is not null
                    if (manager_id) {
                        // Pulls index number of employee record whose id matches the manager id
                        const managerIndex = managerData.findIndex(item => item.id === manager_id);

                        // Rewrites manager_id property to show first and last name of manager instead of manager_id
                        manager_id = `${managerData[managerIndex].first_name} ${managerData[managerIndex].last_name}`

                        // Assigns manager_title to title property of employee record at manager's index
                        const manager_title = managerData[managerIndex].title;

                        // Assigns new names for columns with reformatted data
                        updatedManagerArray.push(
                            {
                                manager: manager_id,
                                manager_title: manager_title,
                                // Combines name of destructured employee record
                                employee: `${first_name} ${last_name}`,
                                employee_title: title,
                                department: name
                            }
                        )
                    } else {
                        // Prevents records with "null" values for manager_id from being pushed into updatedManagerArray
                        return;
                    }
                })

                // Displays reformatted manager + employee records to console in table format
                console.table(updatedManagerArray);
            })

            break;     
    }

    // Serves menu for user to specify next action
    showMenu();
}

// Pulls array of employee names from employees table
const pullEmployees = () => {       
    const choicesArray = [];

    connection.query("SELECT first_name, last_name FROM employees", (err, res) => {
        if (err) throw new Error(err);
                            
        res.forEach(({ first_name, last_name }) => choicesArray.push(`${first_name} ${last_name}`));
    })

    return choicesArray;
}

// Pulls array of titles from roles table
const pullRoles = () => {
    const choicesArray = [];

    connection.query("SELECT title FROM roles", (err, res) => {
        if (err) throw new Error(err);
                
        res.forEach(({ title }) => choicesArray.push(title));
    })

    return choicesArray;
}

// Pulls array of names from departments table
const pullDepartments = () => {
    const choicesArray = [];

    connection.query("SELECT name FROM departments", (err, res) => {
        if (err) throw new Error(err);
                
        res.forEach(({ name }) => choicesArray.push(name));
    })

    return choicesArray;
}

// addData function
const addData = operation => {
    switch (operation) {

        // Add a new employee
        case "employee":
            inquirer
                // Collect user inputs
                .prompt([
                        {
                            type: "input",
                            message: "Enter Employee's first name:",
                            name: "firstName"
                        },
                        {
                            type: "input",
                            message: "Enter Employee's last name:",
                            name: "lastName"
                        },
                        {
                            type: "list",
                            message: "Select Role:",
                            choices: pullRoles(),
                            name: "roleName"
                        },
                        {
                            type: "list",
                            message: "Select Manager:",
                            choices: pullEmployees(),
                            name: "manager"
                        },
                    ])
                .then(response => {
                    
                    // Object to hold responses and matching ids from below evaluations
                    const tableSubmission = {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        manager_id: 0,
                        role_id: 0
                    }

                    // Pulls names and ids from employees table
                    connection.query("SELECT id, first_name, last_name FROM employees", (err, res) => {
                        if (err) throw new Error(err);

                        res.forEach(result => {
                            // Matches first and last name from table to split selection from user input
                            if (result.first_name === response.manager.split(" ")[0] && result.last_name === response.manager.split(" ")[1]) {
                                // Assigns table id to object
                                tableSubmission.manager_id = result.id;
                            }
                        })

                        // Pulls titles and ids from roles table
                        connection.query("SELECT id, title FROM roles", (err, res) => {
                            if (err) throw new Error(err);
    
                            // Matches name of title from user selection to table title
                            res.forEach(result => {
                                if (result.title === response.roleName) {
                                    // Assigns table id to object
                                    tableSubmission.role_id = result.id;
                                }
                            })
    
                            // Adds new record with specified columns and values
                            connection.query("INSERT INTO employee_db.employees SET ?", tableSubmission, (err) => {
                                if (err) throw new Error(err);
        
                                console.log("Employee added!");

                                // Serves menu for next user input
                                showMenu();
                            })
                        })
                    })
                })
            break;

        // Add a new role
        case "role":
            inquirer
                // Collect user inputs
                .prompt([
                        {
                            type: "input",
                            message: "Enter title for Role:",
                            name: "role"
                        },
                        {
                            type: "input",
                            message: "Enter salary:",
                            name: "salary",
                            // Validates that user has input number
                            validate(value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }

                                // Log error so user can update value
                                console.log(" --Please input number-- ");
                                return false;
                            }
                        },
                        {
                            type: "list",
                            message: "Select Department:",
                            choices: pullDepartments(),
                            name: "department"
                        }
                    ])
                .then(response => {

                    // Object to hold responses and matching id from below evaluation
                    const tableSubmission = {
                        title: response.role,
                        salary: response.salary,
                        department_id: 0
                    }

                    // Pulls current list of department names
                    connection.query("SELECT id, name FROM departments", (err, res) => {
                        if (err) throw new Error(err);

                        // Matches department name of user selection to department name of table and assigns department id
                        res.forEach(result => {
                            if (result.name === response.department) {
                                tableSubmission.department_id = result.id;
                            }
                        })

                        // Adds new record with specified columns and values
                        connection.query("INSERT INTO employee_db.roles SET ?", tableSubmission, (err) => {
                            if (err) throw new Error(err);
        
                            console.log("Role added!");

                            // Serves menu for next user input
                            showMenu();
                        })
                    })
                })
            break;

        // Add a new department
        case "department":
            inquirer
                // Prompts user to enter new department name
                .prompt({
                    type: "input",
                    message: "Enter new Department name:",
                    name: "department"
                })
                .then(response => {
                    // Inserts new name into departments table
                    connection.query("INSERT INTO employee_db.departments (name) VALUES (?)", response.department, (err) => {
                        if (err) throw new Error(err);

                        // Confirms successful update for user
                        console.log("Department added!");

                        // Serves menu for next user input
                        showMenu();
                    })
                })
            break;
    } 
}

// updateData function
const updateData = (operation) => {
    switch (operation) {

        // Update existing employee's role
        case "role":
            // Pulls current employee names from employees table
            connection.query("SELECT first_name, last_name FROM employees", (err, res1) => {
                if (err) throw new Error(err);

                const employeesArray = res1.map(({ first_name, last_name }) => `${first_name} ${last_name}`);

                // Pulls current titles from roles table
                connection.query("SELECT title FROM roles", (err, res2) => {
                    if (err) throw new Error(err);

                    const rolesArray = res2.map(({ title }) => title);

                    // Prompts user to choose employee from list of existing employees and then choose role to switch to from list of exisitng roles
                    inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "Select Employee:",
                            choices: employeesArray,
                            name: "employee"
                        },
                        {
                            type: "list",
                            message: "Select new Role:",
                            choices: rolesArray,
                            name: "newRole"
                        }
                    ])
                    .then(response => {

                        // Object to hold matches from below queries
                        const tableSubmission = {
                            id: 0,
                            role_id: 0
                        }
    
                        connection.query("SELECT id, first_name, last_name FROM employees", (err, res) => {
                            if (err) throw new Error(err);
    
                            // Stores ID of employee from table that matches the first and last name from user selection
                            res.forEach(result => {
                                if (result.first_name === response.employee.split(" ")[0] && result.last_name === response.employee.split(" ")[1]) {
                                    tableSubmission.id = result.id;
                                }
                            })
    
                            connection.query("SELECT id, title FROM roles", (err, res) => {
                                if (err) throw new Error(err);
        
                                // Stores ID of title from table that matches title from user selection
                                res.forEach(result => {
                                    if (result.title === response.newRole) {
                                        tableSubmission.role_id = result.id;
                                    }
                                })
        
                                // Updates role_id for correpsonding employee ID
                                connection.query("UPDATE employee_db.employees SET role_id = ? WHERE id = ?", [tableSubmission.role_id, tableSubmission.id], (err) => {
                                    if (err) throw new Error(err);
            
                                    // Confirms successful update for user
                                    console.log("Role updated!");
    
                                    // Serves menu for next user input
                                    showMenu();
                                })
                            })
                        })
                    })
                })
            })

            
            break;
    }
}

// Central function to control user workflow
const showMenu = () => {
    // Calls inquirer to serve menu to user
    inquirer
        .prompt(menu)
        .then(response => {
            // Serves paths based on user response
            switch (response.menuResponse) {
                case "View employees":
                    viewData("employees");
                    break;

                case "View roles":
                    viewData("roles");
                    break;

                case "View departments":
                    viewData("departments");
                    break;

                case "View employees by manager":
                    viewData("employees by manager");
                    break;

                case "Add employee":
                    addData("employee");
                    break;

                case "Add role":
                    addData("role");
                    break;
                
                case "Add department":
                    addData("department");
                    break;
                
                case "Update employee role":
                    updateData("role");
                    break;
                
                case "Exit":
                    // Release connection to SQL server
                    connection.end();

                    // Confirm application has finished for user
                    console.log("Session finished");
                    break;
            }
        })
}

// Establish SQL server connection before initiating menu prompts
connection.connect((err) => {
    if (err) throw new Error(err);
    console.log(`Connected as id ${connection.threadId}`);
    showMenu();
});