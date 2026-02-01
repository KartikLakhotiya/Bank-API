# Bank-API
A full-stack banking application built with React, Node.js, Express.js and MongoDB. Features a modern UI for managing bank accounts, transactions, and credit lines.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## Features

### User Authentication
- **Register:** Create a new account with email and password
- **Login:** Secure authentication with JWT tokens
- **Logout:** Clear session and cookies

### Account Management
- **Dashboard:** View account balance, credit limit, and total available funds
- **Credit Line:** Increase or decrease your credit limit

### Transactions
- **Deposit:** Add funds to your account
- **Withdraw:** Withdraw cash with balance validation
- **Transfer:** Send money to other registered accounts
- **Transaction History:** View all transactions with filtering by type

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin requests

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed ([Download](https://nodejs.org/))
- MongoDB installed and running ([Installation Guide](https://docs.mongodb.com/manual/installation/))
- Git installed

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KartikLakhotiya/Bank-API.git
   cd Bank-API
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the Backend** (from `backend` folder):
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`

2. **Start the Frontend** (from `frontend` folder):
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

## Project Structure

```
Bank-API/
├── backend/
│   ├── config/          # Database configuration
│   ├── controller/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── store/       # Zustand stores
│   │   ├── types/       # TypeScript interfaces
│   │   └── lib/         # Utility functions
│   └── index.html
│
└── README.md
```

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/create` | Register new user |
| POST | `/api/users/login` | User login |
| POST | `/api/users/logout` | User logout |
| GET | `/api/users/v1/check-auth` | Verify authentication |
| GET | `/api/users/:id` | Get user by ID |

### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts/all` | Get all accounts |
| GET | `/api/accounts/:id` | Get account by ID |
| POST | `/api/accounts/check-balance` | Check account balance |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/deposit` | Deposit funds |
| POST | `/api/transactions/withdraw` | Withdraw funds |
| POST | `/api/transactions/transfer` | Transfer between accounts |
| PUT | `/api/transactions/credit` | Update credit limit |
| GET | `/api/transactions/user/:id` | Get user transactions |

## Screenshots

### Login Page
Clean and minimal login interface with form validation.

### Dashboard
Overview of account balance, credit line, and quick action buttons for common operations.

### Transaction History
Filterable list of all transactions with type indicators.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

For any questions or feedback, please raise an issue from the Issues tab.

---

### If you liked this project, please leave a ⭐ star!



