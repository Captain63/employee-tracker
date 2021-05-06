// Install dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const dotenv = require("dotenv");

// Reads .env file
dotenv.config();

// Destructure values from db.env file for SQL server connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Establish SQL server
const connection = mysql.createConnection({
    
    host: DB_HOST,
  
    // Port
    port: DB_PORT,
  
    // Username
    user: DB_USER,
  
    // Be sure to update with your own MySQL password!
    password: DB_PASSWORD,

    // Database name
    database: DB_NAME,
});

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
        "Add roles",
        "Add department",
        "Update existing employee's role",
        "Exit"
    ],
    name: "menuResponse"
}

// viewData function
const viewData = (operation) => {
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
                            "manager id": manager_id,
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

// addData function
const addData = () => {

    // Serves menu for user to specify next action
    showMenu();
}

// updateData function
const updateData = () => {

    // Serves menu for user to specify next action
    showMenu();
}

// Central function to control user workflow
const showMenu = () => {
    // Calls inquirer to serve menu to user
    inquirer
        .prompt(menu)
        .then(response => {
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