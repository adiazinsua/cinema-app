
# Fictional Cinema App
This project is a fictional cinema app built with Ionic and Angular made as a technical challenge for Prex by Ailin Diaz Insua. This application provides a seamless experience for movie enthusiasts to explore, rate, and manage their favorite films.

## Features
**User Authentication**
- Login and Registration
- Password Recovery
- User Logout
**Home Screen**
- List of Movies
**Movie Management**
- Rate movies (1-5 stars)
- Edit movie information and ratings
- Delete movies
- View detailed movie information
**User Profile**
- Change user avatar


## Technical Details
- Built with Ionic and Angular, Typescript and Sass.
- Uses Firebase for backend services
- Implements Ionic Storage for local data persistence

## Installation
**Clone the repository:**

```
git clone https://github.com/adiazinsua/cinema-app.git
cd cinema-app
```

**Install dependencies:**
```
npm install
```

**IMPORTANT! Firebase setup - Replace the Firebase configuration:**

Locate the environment.ts file in the src/environments/ directory.
Replace the existing Firebase configuration with the one provided in the attached file.


## Running the App
1. Using Ionic CLI: 
```
ionic serve
```
2. Using npm
```
npm run start
```
This will start a development server, and you can view the app in your browser at http://localhost:8100 (when running the app with Ionic CLI) or http://localhost:4200 (when running the app with npm).
