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

The technical architecture of **ResolveNow** follows a client-server model. The frontend acts as the client, built with **React.js** and **Vite**, while the backend serves as the API server using **Node.js** and **Express.js**.

### Frontend
- **React.js**: For building a dynamic and responsive user interface.
- **Vite**: Modern build tool for faster development.
- **Axios**: For handling RESTful API requests to the backend.
- **Socket.io-Client**: Enables real-time communication for the built-in messaging system.
- **Material UI & Bootstrap**: Used for creating a consistent, modern, and accessible UI.

### Backend
- **Node.js & Express.js**: Handles server-side logic, routing, and middleware.
- **Socket.io**: Powers real-time updates and customer-agent chat.
- **JWT (JSON Web Tokens)**: Secure user authentication and authorization.
- **Multer**: Middleware for handling multi-part form data and file uploads (attachments).
- **Mongoose**: Provides a schema-based solution to model application data.

### Database
- **MongoDB**: NoSQL database for flexible and scalable data storage. Stores user profiles, complaint details, chat history, and feedback.

## PROJECT STRUCTURE

The project is organized into two main directories: `backend` and `frontend`, located within the `Project Files` folder.

### Backend (`Project Files/backend`)
- **config.js**: Configuration for database connection and environment variables.
- **models/**: Mongoose schemas and models (User, Complaint, Assigned, Message, Feedback).
- **routes/**: API route definitions for authentication, complaints, and real-time messaging.
- **middleware/**: Custom middleware for authentication and centralized error handling.
- **uploads/**: Storage for complaint attachments and chat images.
- **index.js**: The entry point for the Express server.

### Frontend (`Project Files/frontend`)
- **src/**:
  - **components/**: Reusable UI components for dashboards, forms, and chat.
  - **App.jsx**: The main component managing application routing.
  - **main.jsx**: The entry point for the React application.
  - **index.css**: Global styles and shared layout definitions.
- **public/**: Static assets like logos and icons.
- **vite.config.js**: Configuration for the Vite build tool.

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
git clone https://github.com/lovaraju37/ResolveNow_Your-Platform-for-Online-Complaints.git
```

### 2. Install Dependencies
Navigate into the project directory and install dependencies for both frontend and backend:
```bash
# Navigate to the project root
cd ResolveNow_Your-Platform-for-Online-Complaints

# Install backend dependencies
cd "Project Files/backend"
npm install

# Install frontend dependencies
cd "../frontend"
npm install
```

### 3. Start the Application
You will need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd "Project Files/backend"
npm start
```

**Terminal 2 (Frontend):**
```bash
cd "Project Files/frontend"
npm start
```
The application will be accessible at [http://localhost:5173](http://localhost:5173) (default Vite port).

## ENVIRONMENT VARIABLES

To run the backend, you may need to configure the following variables in a `.env` file within the `Project Files/backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resolvenow
```

## API DOCUMENTATION

The backend provides a set of RESTful endpoints to manage the application:

### Authentication
- `POST /api/auth/register`: Register a new user (Customer/Agent/Admin).
- `POST /api/auth/login`: Authenticate a user and receive a JWT.

### Complaints
- `POST /api/complaints`: Submit a new complaint (with file attachments).
- `GET /api/complaints/user/:userId`: Fetch all complaints submitted by a specific user.
- `GET /api/complaints/:id`: Get detailed information about a single complaint.
- `PATCH /api/complaints/:id/status`: Update the status of a complaint.

### Admin & Assignments
- `GET /api/users/agents`: List all available agents.
- `POST /api/assigned`: Assign a complaint to a specific agent.
- `GET /api/assigned/agent/:agentId`: Fetch complaints assigned to an agent.

### Messaging & Feedback
- `GET /api/messages/:complaintId`: Retrieve chat history for a complaint.
- `POST /api/feedback`: Submit user feedback and ratings for a resolved complaint.

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

### 1. Set Up Project Structure
- Initialize the project using `npm init`.
- Install core dependencies: `express`, `mongoose`, `jsonwebtoken`, `socket.io`, `multer`, `cors`, `dotenv`.

### 2. Create Express.js & Socket.io Server
- Set up an Express server to handle HTTP requests.
- Integrate **Socket.io** for real-time bidirectional communication.
- Configure middleware: `body-parser` for JSON/URL-encoded data, `cors` for cross-origin requests, and `express.static` for serving uploaded files.

### 3. Define API Routes
- Implement RESTful routes for:
  - **Auth**: User registration, login, and profile management.
  - **Complaints**: Submission, tracking, and status updates.
  - **Assigned**: Admin functionality for assigning complaints to agents.
  - **Messages**: Fetching chat history and handling real-time messaging.
  - **Feedback**: Submitting user ratings and comments.

### 4. Implement Data Models & File Uploads
- Define Mongoose schemas for all entities (User, Complaint, Assigned, Message, Feedback).
- Configure **Multer** for handling file uploads (images/documents) attached to complaints and messages.

### 5. Real-time Communication
- Implement Socket.io events for real-time chat between customers and agents.
- Ensure messages are persisted in MongoDB while being broadcast to connected users.

## DATABASE DEVELOPMENT

### 1. User Schema
Defines the structure of user data stored in the `User` collection.
- **Fields**: `name`, `email`, `password`, `phone`, `userType` (Customer, Agent, Admin).
- **Default**: `userType` defaults to `Customer`.

### 2. Complaint Schema
Specifies the format of complaint data stored in the `Complaint` collection.
- **Fields**: `userId` (ref User), `name`, `address`, `city`, `state`, `pincode`, `comment`, `attachments` (array of objects with path and names), `status`, `createdAt`.
- **Status Options**: `Pending` (default), `Assigned`, `Resolved`.

### 3. Assigned Complaint Schema
Defines how complaints are assigned to agents in the `Assigned` collection.
- **Fields**: `agentId` (ref User), `complaintId` (ref Complaint), `agentName`, `status`, `assignedAt`.
- **Constraint**: `complaintId` is unique to ensure a complaint is assigned to only one agent.

### 4. Message Schema
Governs the structure of real-time messages in the `Message` collection.
- **Fields**: `complaintId` (ref Complaint), `name` (sender name), `message`, `attachments` (array of objects), `read` (boolean), `sentAt`.

### 5. Feedback Schema
Stores user feedback on resolved complaints in the `Feedback` collection.
- **Fields**: `userId` (ref User), `complaintId` (ref Complaint), `agentId` (ref User), `rating` (1-5), `comment`, `createdAt`.

## FRONTEND DEVELOPMENT

### 1. Setup React Application
The frontend foundation is built using **React.js** and **Vite**.
- Initialize the application using Vite for a high-performance build process.
- Install essential libraries: `axios`, `react-router-dom`, `socket.io-client`, `bootstrap`, and `@mui/material`.

### 2. Design UI Components
Create reusable and responsive components:
- **Navigation**: Persistent navbar with dynamic links based on user roles.
- **Dashboards**: Specific views for Customers, Agents, and Admins.
- **Chat Window**: Real-time interface for messaging between customers and agents.
- **Forms**: User-friendly forms for registration, login, and complaint submission (with file upload support).

### 3. Implement Frontend Logic
- **State Management**: Using React hooks (`useState`, `useEffect`) to manage user sessions and data.
- **API Integration**: Centralized axios calls for backend communication.
- **Real-time Updates**: Using `socket.io-client` to listen for new messages and status changes.
- **Authentication**: Implementing private routes and role-based access control (RBAC).

## PROJECT IMPLEMENTATION

**Skill Tags**: Testing, Verification, Bug Fixing, UI/UX Review

On completing the development part, we then run the application one last time to verify all the functionalities and look for any bugs in it. The user interface of the application looks a bit like the one’s provided below.

### 1. Landing Page
<img width="1906" height="869" alt="image" src="https://github.com/user-attachments/assets/7939aa36-4f5c-4138-9728-d04b3b7f714d" />


### 2. Login Page
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/ad5dbbb6-926f-4f9a-a8fc-f699ec3c34d9" />

### 3. Registration Page
<img width="1905" height="869" alt="image" src="https://github.com/user-attachments/assets/b240a6b1-e909-4cfb-8b6a-ab2cf0291d20" />

### 4. Customer Dashboard For Complaint
<img width="1900" height="876" alt="image" src="https://github.com/user-attachments/assets/f061f6c6-a795-4e34-b831-bf0e60d9bdfe" />

### 5. Admin Dashboard
<img width="1898" height="869" alt="image" src="https://github.com/user-attachments/assets/b5edb65e-5f30-4089-8905-b76fa8f883f3" />

### 6. Agent Dashboard
<img width="1898" height="873" alt="image" src="https://github.com/user-attachments/assets/b9d45c5c-64f3-4931-af1e-3e28008ad5e7" />
