# Hypercare Monitoring Agent (SAP Monitor Agent)

This is a proof-of-concept application for a Hypercare Monitoring Agent that extracts KPIs from an SAP S/4HANA system and displays them in a React dashboard UI.

## Architecture

*   **Backend**: Node.js with Express, running on `http://localhost:4000`
*   **Frontend**: React with Vite and Material UI, running on `http://localhost:3000`

## Prerequisites

*   Node.js (v20.19.0 or higher)
*   npm

## Project Structure

```
.
├── client/         # React Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/         # Node.js Backend
│   ├── src/
│   │   ├── services/
│   │   ├── sap/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## Setup and Installation

1.  **Clone the repository** (or download the files).

2.  **Setup the Backend:**
    *   Navigate to the `server` directory: `cd server`
    *   Install dependencies: `npm install`
    *   The `server/.env` file is pre-configured to use mock data (`MOCK_MODE=true`). If you want to connect to a real SAP system, update the `SAP_*` variables in this file and set `MOCK_MODE=false`.

3.  **Setup the Frontend:**
    *   Navigate to the `client` directory: `cd client`
    *   Install dependencies: `npm install`

## Running the Application

You will need to run the backend and frontend servers in separate terminals.

1.  **Start the Backend Server:**
    *   Navigate to the `server` directory.
    *   Run the command: `npm start`
    *   The server will start on `http://localhost:4000`.

2.  **Start the Frontend Application:**
    *   Navigate to the `client` directory.
    *   Run the command: `npm run dev`
    *   The frontend development server will start on `http://localhost:3000`.

3.  **Access the Dashboard:**
    *   Open your web browser and go to `http://localhost:3000`.
    *   You should see the Hypercare Monitoring dashboard with the sidebar navigation. The frontend is configured to proxy API requests to the backend server.

```
