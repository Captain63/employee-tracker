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
        case "employees":
            // Defines query before passing into connection.query
            let query =
                'SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.name ';
            query +=
                'FROM employees INNER JOIN roles ON employees.role_id = roles.id ';
            query +=
                'INNER JOIN departments ON roles.department_id = departments.id ORDER BY employees.id';
            
            // Retrieves data from SQL serverew
            connection.query(query, (err, res) => {
                if (err) throw new Error(err);

                // Assigning resulting data to employeeData variable
                const employeeData = res;

                // Initializing empty array to host reformatted employee data
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

        case "roles":
            connection.query("SELECT title, salary FROM roles", (err, res) => {
                if (err) throw new Error(err);

                // Displays results to console in table format
                console.table(res);
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