// Install dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
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
        "View department",
        "Add employee",
        "Add roles",
        "Add department",
        "Update existing employee's role",
        "Exit"
    ],
    name: "menuResponse"
}

// viewData function
const viewData = () => {

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
                    viewData();
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