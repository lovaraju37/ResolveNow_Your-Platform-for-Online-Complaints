# ResolveNow: Your Platform for Online Complaints

**Category**: Full Stack Development

**Skills Required**: HTML, CSS, Javascript, Bootstrap, React.js, Node.js, MongoDB

## PROJECT DESCRIPTION

An online complaint registration and management system is a software application or platform that allows individuals or organizations to submit and track complaints or issues they have encountered. It can help optimize the complaint handling process and empower organizations to develop a safety management system to efficiently resolve customer complaints, while staying in line with industry guidelines and regulatory compliance obligations. It provides a centralized platform for managing complaints, streamlining the complaint resolution process, and improving customer satisfaction.

It consists of some key features which include:

- **User registration**: Users can create accounts to submit complaints and track their progress.
- **Complaint submission**: Users can enter details of their complaints, including relevant information such name, description of the issue, address etc.
- **Tracking and notifications**: Users can track the progress of their complaints, view updates, and receive notifications via email or SMS when there are any changes or resolutions.
- **Agent Interaction**: User can interact with the agent who has assigned the complaint.
- **Assigning and routing complaints**: The system assigns complaints to the appropriate department or personnel responsible for handling them. It may use intelligent routing algorithms to ensure efficient allocation of resources.
- **Security and confidentiality**: The system ensures the security and confidentiality of user data and complaint information through measures such as user authentication, data encryption, access controls, and compliance with relevant data protection regulations.

## DESCRIPTION

The Online Complaint Registration and Management System is a user-friendly software solution designed to streamline the process of submitting, tracking, and resolving complaints or issues encountered by individuals or organizations. It provides a centralized platform for efficient complaint management, allowing users to securely register complaints, track their progress in real-time, and interact with assigned agents for issue resolution. With features such as automatic notifications, intelligent complaint routing, and robust security measures, this system ensures timely and effective handling of complaints while prioritizing user Details.

## SCENARIO

Scenario: John, a customer, recently encountered a problem with a product he purchased online. He notices a defect in the item and decides to file a complaint using the Online Complaint Registration and Management System.

### User Registration and Login:

1. John visits the complaint management system's website and clicks on the "Sign Up" button to create a new account.
2. He fills out the registration form, providing his full name, email address, and a secure password.
3. After submitting the form, John receives a verification email and confirms his account.
4. He then logs into the system using his email and password.

### Complaint Submission:

1. Upon logging in, John is redirected to the dashboard where he sees options to register a new complaint.
2. He clicks on the "Submit Complaint" button and fills out the complaint form.
3. John describes the issue in detail, attaches relevant documents or images showcasing the defect, and provides additional information such as his contact details and the product's purchase date.
4. After reviewing the information, John submits the complaint.

### Tracking and Notifications:

1. After submitting the complaint, John receives a confirmation message indicating that his complaint has been successfully registered.
2. He navigates to the "My Complaints" section of the dashboard, where he can track the status of his complaint in real-time.
3. John receives email notifications whenever there is an update on his complaint, such as it being assigned to an agent or its resolution status.

### Interaction with Agent:

1. A customer service agent, Sarah, is assigned to handle John's complaint.
2. Sarah reviews the details provided by John and contacts him through the system's built-in messaging feature.
3. John receives a notification about Sarah's message and accesses the chat window to communicate with her.
4. They discuss the issue further, and Sarah assures John that the company will investigate and resolve the problem promptly.

### Resolution and Feedback:

1. After investigating the complaint, the company identifies the defect in the product and offers John a replacement or refund.
2. John receives a notification informing him of the resolution, along with instructions on how to proceed.
3. He provides feedback on his experience with the complaint handling process, expressing his satisfaction with the prompt resolution and courteous service provided by Sarah.

### Admin Management:

1. Meanwhile, the system administrator monitors all complaints registered on the platform.
2. The admin assigns complaints to agents based on their workload and expertise.
3. They oversee the overall operation of the complaint management system, ensuring compliance with platform policies and regulations.

## TECHNICAL ARCHITECTURE

The technical architecture of our online complaint registration and management app follows a client-server model, where the frontend serves as the client and the backend acts as the server. The frontend encompasses not only the user interface and presentation but also incorporates the axios library to connect with backend easily by using RESTful Apis.

The frontend utilizes the bootstrap and material UI library to establish real-time and better UI experience for any user whether it is agent, admin or ordinary user working on it.

On the backend side, we employ Express.js frameworks to handle the server-side logic and communication.

For data storage and retrieval, our backend relies on MongoDB. MongoDB allows for efficient and scalable storage of user data, including user profiles, for complaints registration, etc. It ensures reliable and quick access to the necessary information during registration of user or any complaints.

Together, the frontend and backend components, along with Express.js and MongoDB, form a comprehensive technical architecture for our complaint management app. This architecture enables efficient data exchange and seamless integration, ensuring a smooth experience for all users.

## PRE-REQUISITES

Here are the key prerequisites for developing a full-stack application using Node.js, Express.js, MongoDB, and React.js:

### Node.js and npm
Node.js is a powerful JavaScript runtime environment that allows you to run JavaScript code on the server-side. It provides a scalable and efficient platform for building network applications.
- **Download**: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- **Installation instructions**: [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/)

### Express.js
Express.js is a fast and minimalist web application framework for Node.js. It simplifies the process of creating robust APIs and web applications, offering features like routing, middleware support, and modular architecture.
- **Installation**: Run the following command in your terminal:
  ```bash
  npm install express
  ```

### MongoDB
MongoDB is a flexible and scalable NoSQL database that stores data in a JSON-like format. It provides high performance, horizontal scalability, and seamless integration with Node.js.
- **Download**: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Installation instructions**: [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)

### React.js
React.js is a popular JavaScript library for building user interfaces. It enables developers to create interactive and reusable UI components.
- **Guide**: [https://reactjs.org/docs/create-a-new-react-app.html](https://reactjs.org/docs/create-a-new-react-app.html)

### Additional Requirements
- **HTML, CSS, and JavaScript**: Basic knowledge for structure, styling, and client-side interactivity.
- **Database Connectivity**: Use [Mongoose](https://mongoosejs.com/) to connect Node.js with MongoDB. [Tutorial link](https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/).
- **Front-end Framework**: We use React.js along with **Material UI** and **Bootstrap** for a better UI experience.
- **Version Control**: Use Git for tracking changes. [Download Git](https://git-scm.com/downloads).
- **Development Environment**: We recommend [Visual Studio Code](https://code.visualstudio.com/download).

## GETTING STARTED

Follow these steps to run the **ResolveNow** project on your local machine:

### 1. Clone the Repository
Open your terminal and execute:
```bash
git clone https://github.com/awdhesh-student/complaint-registery.git
```

### 2. Install Dependencies
Navigate into the project directory and install dependencies for both frontend and backend:
```bash
# Navigate to the project root
cd complaint-registery

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Start the Development Server
From the `backend` directory, run:
```bash
npm start
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

You have successfully installed and set up the ResolveNow app on your local machine. You can now proceed with further customization, development, and testing.

## APPLICATION FLOW

### Customer / Ordinary User
**Role**: Create and manage complaints, interact with agents, and manage profile information.

1. **Registration and Login**: Create an account and log in using registered credentials.
2. **Complaint Submission**: Fill out the complaint form with details, description, contact information, and relevant attachments.
3. **Status Tracking**: View real-time updates on the progress of submitted complaints in the dashboard.
4. **Interaction with Agents**: Connect with assigned agents using the built-in messaging feature for further clarification.
5. **Profile Management**: Manage personal details and addresses.

### Agent
**Role**: Manage complaints assigned by the admin, communicate with customers, and update complaint statuses.

1. **Registration and Login**: Create an account and log in to the agent dashboard.
2. **Complaint Management**: View and manage assigned complaints; communicate with customers through the chat window.
3. **Status Update**: Change complaint status based on progress or resolution and provide updates to the customer.
4. **Customer Interaction**: Respond to inquiries and resolve issues promptly.

### Admin
**Role**: Oversee platform operations, manage users/agents, assign complaints, and enforce policies.

1. **Management and Monitoring**: Monitor all submitted complaints and moderate platform activity.
2. **Complaint Assignment**: Assign complaints to appropriate agents based on workload and expertise.
3. **User and Agent Management**: Oversee account registrations, profiles, and enforce platform terms and privacy regulations.
4. **Continuous Improvement**: Implement measures to improve functionality, security, and user experience.

## PROJECT FLOW - BACKEND DEVELOPMENT
**Duration**: 1 Hr

### 1. Set Up Project Structure
- Create a new directory and initialize the project using `npm init`.
- Install necessary dependencies: `Express.js`, `Mongoose`, `dotenv`, `cors`, etc.

### 2. Create Express.js Server
- Set up an Express server to handle HTTP requests and serve API endpoints.
- Configure middleware like `body-parser` for parsing request bodies and `cors` for cross-origin requests.

### 3. Define API Routes
- Create separate route files for functionalities such as authentication, complaints, and user management.
- Implement route handlers to interact with the database and return responses.

### 4. Implement Data Models
- Define Mongoose schemas for entities: `User`, `Complaint`, `Agent`, etc.
- Create Mongoose models to interact with the MongoDB database.
- Implement CRUD (Create, Read, Update, Delete) operations for each model.

### 5. User Authentication
- Implement authentication using **JSON Web Tokens (JWT)**.
- Create routes and middleware for registration, login, and logout.
- Protect sensitive routes with authentication middleware.

### 6. Admin Functionality
- Implement routes and controllers for admin-specific tasks like assigning complaints and managing users/agents.

### 7. Error Handling
- Implement centralized error-handling middleware to catch and process errors during API requests.
- Return appropriate HTTP status codes and clear error messages.

## DATABASE DEVELOPMENT
**Duration**: 1 Hr

### 1. User Schema
Defines the structure of user data stored in the `user_Schema` collection.
- **Fields**: `name`, `email`, `password`, `phone`, `userType` (customer, agent, admin).
- **Requirement**: All fields are mandatory for registration.

### 2. Complaint Schema
Specifies the format of complaint data stored in the `complaint_schema` collection.
- **Fields**: `userId`, `name`, `address`, `city`, `state`, `pincode`, `comment`, `status`.
- **Relational Link**: Associated with a specific user via the `userId` field.

### 3. Assigned Complaint Schema
Defines how complaints are assigned to agents in the `assigned_complaint` collection.
- **Fields**: `agentId`, `complaintId`, `status`, `agentName`.
- **Relational Link**: Links a specific agent (`agentId`) to a specific complaint (`complaintId`).

### 4. Chat Window Schema
Governs the structure of messages exchanged in the `message` collection.
- **Fields**: `name`, `message`, `complaintId`.
- **Relational Link**: Messages are associated with a specific complaint via `complaintId` for chat history tracking.

## FRONTEND DEVELOPMENT
**Duration**: 1 Hr

### 1. Setup React Application
The frontend foundation is built using **React.js**.
- Initialize the application structure and organize project files.
- Install essential libraries like `axios`, `react-router-dom`, `Bootstrap`, and `Material UI`.

### 2. Design UI Components
Create reusable components for a consistent and intuitive user experience:
- **Navigation**: Integrated system for exploring sections like complaint submission and management.
- **Interactive Elements**: Buttons, forms, and profiles.
- **Layout & Styling**: Implementing a modern, visually appealing look using CSS and UI libraries.

### 3. Implement Frontend Logic
Bridge the gap between the UI and backend data:
- **API Integration**: Connect to backend endpoints using `axios`.
- **Data Binding**: Ensure real-time updates and dynamic content rendering across the application.

## PROJECT IMPLEMENTATION
**Duration**: 1 Hr

**Skill Tags**: Testing, Verification, Bug Fixing, UI/UX Review

On completing the development part, we then run the application one last time to verify all the functionalities and look for any bugs in it. The user interface of the application looks a bit like the one’s provided below.

### 1. Landing Page
![Landing Page](Project%20Files/backend/uploads/landing-page.png)

### 2. Login Page
![Login Page](Project%20Files/backend/uploads/login-page.png)

### 3. Registration Page
![Registration Page](Project%20Files/backend/uploads/registration-page.png)

### 4. Common Dashboard For Complaint
![Common Dashboard](Project%20Files/backend/uploads/common-dashboard.png)

### 5. Admin Dashboard
![Admin Dashboard](Project%20Files/backend/uploads/admin-dashboard.png)

### 6. Agent Dashboard
![Agent Dashboard](Project%20Files/backend/uploads/agent-dashboard.png)
