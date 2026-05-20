# TaskFlow — Premium MERN Workspace Task Manager

TaskFlow is a state-of-the-art, secure productivity web application designed to help users manage, organize, filter, and track their personal tasks in a private, responsive environment. Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), it couples deep security with a modern frosted-glass dark theme, priority neon indicators, and micro-interactive transitions.

---

## Key Features

1. **Secure JWT Authentication**:
   - High-grade signup, login, and profile tracking.
   - Credentials validated in real-time, passwords salted and hashed with `bcryptjs`.
   - Automatic session expiry checks and secure cookies/tokens.
2. **Comprehensive Task Workspace (CRUD)**:
   - Create, edit, toggle, and delete individual tasks.
   - Support for detailed Descriptions, Due Dates, and Priority Badges (Low, Medium, High).
   - "Clear Completed" quick action to purge finished tasks.
3. **Smart Filters, Sorting & Queries**:
   - Filter by status (**All**, **Pending**, **Completed**) or specific priority weights (**Low**, **Medium**, **High**).
   - Dynamic regex search matching both title and description text.
   - Sort configurations: **Newest**, **Oldest**, **Priority** (High → Low), and **Due Date** (soonest first).
4. **Interactive Statistics Panel**:
   - real-time calculation of **Total Tasks**, **Completed Tasks**, **Pending Tasks**, and active **Overdue Tasks**.
   - Sleek neon glowing indicators signaling immediate deadlines.
5. **Modern Fluid UI**:
   - Dark-mode layout utilizing Google Font *Outfit* & *Plus Jakarta Sans*.
   - Responsive layouts styled using flexbox/grid in Vanilla CSS.
   - Frosted glass cards (`backdrop-filter`) and smooth transition timings.

---

## Technology Stack

- **Frontend**: React.js (Vite framework), Vanilla CSS, React Router DOM, Lucide Icons
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), BcryptJS for cryptography
- **Database**: MongoDB (Mongoose ODM layer)

---

## Project Structure

```text
major project/
├── backend/
│   ├── config/db.js              # Mongoose DB connector
│   ├── middleware/               # Auth, input validators, global error catches
│   ├── models/                   # Mongoose schemas (User, Task)
│   ├── routes/                   # Auth routes and Task CRUD routers
│   ├── .env                      # Environment configurations (Port, Secret, MonogDB URI)
│   ├── package.json
│   └── server.js                 # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, TaskCard, TaskModal, SearchBar, Stats, Toasts
│   │   ├── context/              # AuthContext, global Fetch interceptor
│   │   ├── pages/                # Login, Register, Dashboard
│   │   ├── App.jsx               # Router & protect route paths
│   │   ├── index.css             # Fluid Design Tokens & keyframes
│   │   └── main.jsx
│   ├── index.html                # Metadata & Pre-fetches
│   └── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Install **Node.js** (v18+ recommended)
- A running **MongoDB** local instance (`mongodb://127.0.0.1:27017/taskmanager`) or a **MongoDB Atlas** cloud URI.

### 1. Set Up Backend
1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Configure environment parameters. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=supersecretkeytaskmanager123
   ```
4. Start the backend:
   ```bash
   npm start
   ```
   *The console will log `Server running on port 5000` and `MongoDB Connected`.*

### 2. Set Up Frontend
1. Open a separate terminal and navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local hosted URL: `http://localhost:5173`.

---

## REST API Documentation

All request payloads and response bodies utilize `application/json`. Private endpoints require authorization tokens passed in request headers as: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication Endpoints
- **POST `/api/auth/register`** (Public):
  - *Payload*: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`
  - *Response*: Creates account and returns `_id`, `name`, `email`, and signed `token`.
- **POST `/api/auth/login`** (Public):
  - *Payload*: `{ "email": "john@example.com", "password": "securepassword" }`
  - *Response*: Authenticates user credentials and returns user metadata and `token`.
- **GET `/api/auth/me`** (Private):
  - *Response*: Returns the authenticated user's profile detail (excluding password).

### Task Operations Endpoints
- **POST `/api/tasks`** (Private):
  - *Payload*: `{ "title": "Setup repository", "description": "Configure workspace configs", "priority": "High", "dueDate": "2026-06-01" }`
  - *Response*: Created Task document.
- **GET `/api/tasks`** (Private):
  - *Query Params*:
    - `search` (string): matches regex on title/description.
    - `status` ('Pending' | 'Completed').
    - `priority` ('Low' | 'Medium' | 'High').
    - `sortBy` ('Newest' | 'Oldest' | 'Priority' | 'DueDate').
  - *Response*: Returns array of Tasks matching filters.
- **GET `/api/tasks/:id`** (Private):
  - *Response*: Returns individual task details if owned.
- **PUT `/api/tasks/:id`** (Private):
  - *Payload*: `{ "title": "Updated", "completed": true, "priority": "Medium" }` (Accepts optional delta parameters)
  - *Response*: Returns updated Task document.
- **DELETE `/api/tasks/:id`** (Private):
  - *Response*: `{ "message": "Task deleted successfully", "id": "<taskId>" }`
- **DELETE `/api/tasks/completed/clear`** (Private):
  - *Response*: `{ "message": "Successfully deleted <count> completed tasks" }`
