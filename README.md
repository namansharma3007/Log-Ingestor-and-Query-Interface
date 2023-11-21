# Log Viewer Application
## Overview
The Log Viewer Application provides real-time updates of logs with the ability to filter and display logs based on various attributes. It utilizes WebSocket for real-time communication and MongoDB to store log data.

## How to Run
## Prerequisites
- Node.js must be installed.
- MongoDB Compass is required if you intend to run the application on a local server. In this case, make necessary changes to <code>/Assignment_namansharma3007/backend/server.js</code>. All requirements are outlined in the file—please refer to the comments. Otherwise, the application will use the default MongoDB Atlas cloud service.
- An internet connection is necessary for real-time updates.
## Steps
- Clone or download the code:

```
cd Assignment_namansharma3007
```
- If yarn is not installed, execute the following command:

```
npm i -g yarn
```
- Install dependencies:


```
npm install
```
- Start the server:

```
yarn start
```
> This command initiates both the backend and frontend servers simultaneously.
- Frontend will be initiated on http://localhost:3456/

- To push data to the backend, use a POST request to http://localhost:3000/pushLogs.

## System Design
The system comprises a front-end built with React.js and a back-end using Node.js and Express.js. Real-time updates are facilitated through WebSocket communication. Log data is stored in MongoDB, and the user interface features a responsive layout designed with Bootstrap.

## Features
- Real-time log updates
- Filter logs by level, message, resource ID, timestamp, trace ID, span ID, commit, and parent resource ID
- Clear filters to view all logs
- User-friendly interface with Bootstrap styling
- Backend indexing for enhanced search capabilities
## Identified Issues
Since a paid version of the MongoDB service is not used, the speed of fetching and pushing data may be slower than expected from the server.
## Author
[@namansharma3007](https://github.com/namansharma3007)

Email: namansharma3007c@gmail.com