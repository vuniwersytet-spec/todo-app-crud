# **HOW-TO-RUN GUIDE (README)**

This is a simple to-do list application with a Node.js backend and an HTML/JS frontend.

## **PREREQUISITES:**

* Node.js and npm  
* PostgreSQL  
* Git

## **HOW TO RUN:**

## **STEP 1: GET THE PROJECT**

Open your terminal (Command Prompt, PowerShell, or Git Bash on Windows) and run the following commands:

1. git clone https://github.com/vuniwersytet-spec/todo-app-crud.git  
2. cd todo-app-crud

## **STEP 2: CONFIGURE THE BACKEND**

1. Navigate to the backend folder:  
   cd backend  
2. Create a file named ".env" in the "backend" folder. Copy the text below into it.  
   IMPORTANT: Make sure that DB\_USER and DB\_PASSWORD match your PostgreSQL settings.  
   DB\_USER=root  
   DB\_PASSWORD=root  
   DB\_HOST=localhost  
   DB\_PORT=5432  
   DB\_DATABASE=todolist\_db  
   PORT=5000  
3. Install all dependencies (libraries):  
   npm install

## **STEP 3: PREPARE THE DATABASE**

Make sure your PostgreSQL server is running. Then, run this command to automatically create the database and table:

npm run db:init

## **STEP 4: RUN THE APPLICATION**

1. Start the server (backend):  
   While in the "backend" folder, run the command:  
   npm start  
   You will see the message "Server is running on port 5000" in the terminal.  
   LEAVE THIS TERMINAL WINDOW OPEN.  
2. Open the user interface (frontend):  
   Using your file explorer, find the "frontend" folder within the project.  
   Double-click the "index.html" file to open it in your browser.

The application is now ready to use.