# 🎯 Activity Ideas App

A simple, password-protected web application for managing activity ideas. Add your ideas and get random suggestions when you need inspiration!

## Features

- 🔒 Password-protected access with cookie-based authentication
- ➕ Add new activity ideas
- 🎲 Get random activity suggestions
- 📝 View all your activities
- 🗑️ Delete activities you no longer need
- 🔑 Change password from within the app
- 💾 SQLite database for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
```bash
cd /home/dumrum/Documents/Test/finRead/ActivitiesList
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## First Time Setup

1. **Default Password**: The app comes with a default password: `password`
2. **Login**: Open the app in your browser and enter the default password
3. **Change Password**: After logging in, scroll to the Settings section and change your password immediately

## Usage

### Adding Activities
1. Log in with your password
2. Type your activity idea in the input field
3. Click "Add" button

### Getting Random Activity
- Click the "🎲 Get Random Activity" button to receive a random suggestion from your list

### Managing Activities
- View all your activities in the list below the input form
- Delete any activity by clicking the "Delete" button next to it

### Changing Password
1. Scroll to the Settings section at the bottom
2. Enter your new password (minimum 4 characters)
3. Click "Change Password"

## Security Notes

- The password is hashed using bcrypt before storage
- Sessions are stored server-side
- Cookies are HTTP-only and same-site strict
- **Important**: Change the default password on first use!
- Sessions expire after 30 days (1 month) of inactivity

## File Structure

```
.
├── server.js           # Express server and API endpoints
├── database.js         # SQLite database setup and queries
├── package.json        # Project dependencies
├── public/
│   └── index.html     # Vue.js single-page application
└── activities.db      # SQLite database (created on first run)
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vue.js 3 (CDN version)
- **Authentication**: bcrypt, cookie-parser
- **Styling**: Custom CSS with gradient themes

## API Endpoints

- `POST /api/login` - Authenticate user
- `POST /api/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `GET /api/activities` - Get all activities (protected)
- `POST /api/activities` - Add new activity (protected)
- `GET /api/activities/random` - Get random activity (protected)
- `DELETE /api/activities/:id` - Delete activity (protected)
- `POST /api/auth/change-password` - Change password (protected)

## Troubleshooting

**Port already in use**: Change the port by setting the PORT environment variable:
```bash
PORT=3001 npm start
```

**Database locked**: Make sure only one instance of the server is running

**Session expired**: Simply log in again with your password

## License

ISC