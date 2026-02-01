# Bank-API
A backend project made with NodeJS, ExpressJS and MongoDB to create backend APIs for an banking application.

## Features

- **Create Account:** Users can create a new bank account by providing required personal details. A unique account id is generated for each user.
  
- **Transfer Funds:** Users can transfer funds between their accounts and other registered accounts. The transfer process includes verification and ensures secure transactions.

- **Deposit Cash:** Users can deposit cash into their accounts, increasing their available balance.

- **Withdraw Cash:** Users can withdraw cash from their accounts, ensuring sufficient balance is available before the transaction is processed.

- **View Transactions:** Users can view a detailed history of their transactions, including deposits, withdrawals, and fund transfers.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side logic
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user, accounts and transactions data
- **Postman**: To send API request.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed. (Download from [Node.js](https://nodejs.org/))
- MongoDB installed and running. (Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/))
- Postman 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KartikLakhotiya/Bank-API.git
   ```

2. Install all the dependencies:
   ```bash
   npm install
   ```

3. Setup .env file
   ```bash
    PORT=5000
    MONGODB_URI=your_mongo_connection_string
    ```

4. Run the Application
   ```bash
   npm run dev
   ```

## API Routes

Expore all the API Routes in the routes folder.

## Contact

For any questions or feedback, please raise an issue from the Issues tab.
Feel free to adjust any details to fit the specifics of your project or personal preferences!

### If you liked my project please leave a star, Thank You



