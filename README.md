# Maria's Italian restaurant training site

![Site logo](/images/image.png)

Training new employees can be **time-consuming and costly**, requiring hands-on guidance for various responsibilities.  
This site is a client/server app for managers employees of a restaurant. A platform specifically to train new employees or new practices of the restaurant. New employees can go through overall of the practices and responsibilities of the restaurant which would save the time and effort for the managers to train them individually in each and every task.

The program is designed to be used with any restaurant with a minimal adjustment and this will actually be used at Maria's Italian restaurant.

## Features

- **Interactive training module** – Courses covering menu, customer service, and kitchen procedures ,etc.
- **Quiz & Assessment** - Employees complete quizzes to test their knowledge after the training modules
- **Progress Tracking** – Admins track employee progress.
- **Authentication & Authorization** – JWT authentication. Employees, Admins, and Managers have different privileges.
- **Dashboard** – Manager Dashboard, Employee dashboard
- **Account Management** - Profile editing, logout process
- **Messaging system** - Employees/managers can send messages
- **Notifications** – Alerts for incomplete training or upcoming assessments.
- **Updates** - Editing a training module, add a new module, delete a module and the same for quiz feature

## **Installation & Setup**

git clone https://github.com/italian-trianer/training-site.git  
cd training-site

## Execution of Project

The project contains a backend and frontend, which must be run in separate.  
Ensure your current directory is in the project folder.  
#To execute the backend:

cd backend  
npm install  
npm run dev

#To execute the frontend:

cd frontend  
npm install  
npm start

## Default Login Credentials

After starting the frontend, navigate to the **login page** and use the following manager credentials:

**Username:** `root@root.com`  
**Password:** `Root12345`

## **Tech Stack**

### **Frontend**

The frontend of the application is built using **React.js**, providing a dynamic and responsive user interface, with **CSS** handling the styling to ensure a visually appealing design.

### **Backend**

The backend is powered by **Node.js** and **Express.js**, allowing for efficient handling of API requests and business logic. **JWT (JSON Web Tokens)** is used for secure authentication, ensuring that users have appropriate access levels based on their roles.

### **Database**

The application relies on **MongoDB**, for storing user data, training modules, and progress tracking, with **Mongoose** serving as the Object Data Modeling (ODM) library to facilitate seamless interaction with the database.

## Creator

Yonatan Ahituv  
Divya Sikka  
Paramee songsang  
Cristian Yanez
