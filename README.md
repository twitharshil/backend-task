# DEEL BACKEND TASK

💫 Welcome! 🎉

This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

## Key Features Implemented

- Endpoints for managing contracts, jobs, and user balances and admin controls within the API.
- All payment-related operations ensure transactional integrity. For instance, a task is marked as paid only upon successful payment by the client.
- Concurrency control is handled to manage simultaneous database operations, ensuring data integrity and consistency. For example, payment for a task is processed only if it hasn't already been paid.

## What is done

- For the API endpoints, I've added a Postman collection along with its environment variables file. It is present inside the Postman_Collection folder
  
- ESLint has been integrated to ensure syntax correctness, identify issues, and enforce consistent code style throughout the project. Routes, controllers, and services are organized into separate directories for modularity and maintainability.

- Jest has been included for testing purposes, along with a sample unit test provided within the tests directory. While more complex test scenarios were not implemented to make sure I complete task on time, we can execute the tests by running `npm run test`.
  
- GET /contracts/:id: Retrieve a particular contract based on its ID only if the user profile ID matches either as a client or the contractor.
  
- GET /contracts: List non-terminated contracts for the authenticated user profile.
  
- GET /jobs/unpaid: Retrieve all unpaid jobs for active contracts of the authenticated user.
  
- POST /jobs/:job_id/pay: Pay for a job, transferring funds from a client to a contractor.
  
- POST /balances/deposit/:userId: Deposit funds into a client's balance. Made sure that deposit amount can be in decimal too.
  
- For the GET endpoint at /admin/best-clients?start=<date>&end=<date>&limit=<integer> The date format should be in ISO format, such as 2019-01-25. While the limit parameter has a default value of 2, both the start and end dates are mandatory.

- When querying the GET endpoint at /admin/best-profession?start=<date>&end=<date> Give the highest-earning profession in a given date range. The date format should be in ISO format. If no profession stands out as the best, the response of 'No profession found' will be produced. Otherwise, it will return an object containing the relevant information.

## Possible Improvements

Here are some points that are important, and I would like to implement to make the code task better, but I could not implement them due to time constraint:

- Add API documentation
- Add more unit tests for all the endpoints.
- Setting up a CI/CD pipeline for automated testing and deployment.

## Technical Stack

- Runtime: Node.js
- Framework: Express.js
- Database: SQLite
- ORM: Sequelize

## Tests Implemented

Tests can be run by running the following command in the root folder of the project:

```
npm run test
```

1. GET /contracts/:id: Fetch a specific contract by its ID.
2. GET /contracts: List non-terminated contracts for the authenticated user.

## Data Models Used

### Profile

A profile can be either a `client` or a `contractor`.
Clients create contracts with contractors. Contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract

A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. Contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job

Contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by creating a local repository for this folder.

2. In the repo root directory, run `npm install` to gather all dependencies.

3. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

4. Then run `npm start` which should start both the server and the React client.

5. Then run `npm run test` which should run the unit test.
❗️ **Make sure you commit all changes to the master branch!**

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3001.

## APIs To Implement

Below is a list of the required API's for the application.

1. **_GET_** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

## Going Above and Beyond the Requirements

Given the time expectations of this exercise, we don't expect anyone to submit anything super fancy, but if you find yourself with extra time, any extra credit item(s) that showcase your unique strengths would be awesome! 🙌

It would be great for example if you'd write some unit test / simple frontend demostrating calls to your fresh APIs.

## Submitting the Assignment

When you have finished the assignment, zip your repo (make sure to include .git folder) and send us the zip.

Thank you and good luck! 🙏
