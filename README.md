# ERecipeHub

A full-stack recipe sharing platform where users can discover, create, and share recipes.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Features](#features)
- [Project Structure](#project-structure)

## Overview

ERecipeHub is a comprehensive recipe sharing platform that allows users to browse, create, and share recipes. The application includes features such as user authentication, recipe management, rating and commenting systems, and an admin dashboard for content moderation.

## Tech Stack

### Frontend

- **React** - Frontend framework for building the user interface
- **React Router** - Client-side routing for navigation
- **Axios** - HTTP client for API communication
- **React Icons** - Icon components for enhanced UI
- **Font Awesome** - Additional icon library
- **React Draggable** - For interactive admin interfaces
- **CSS3** - Styling with component-specific CSS files

### Backend

- **Node.js** - Runtime environment for executing JavaScript server-side
- **Express** - Web framework for building APIs
- **MongoDB** - NoSQL database for storing application data
- **Mongoose** - ODM library for MongoDB
- **JWT** - Authentication using JSON Web Tokens
- **Bcrypt.js** - Password hashing for security
- **Multer** - Middleware for handling file uploads
- **Cloudinary** - Cloud storage for images
- **Jimp** - Image processing library
- **CORS** - Cross-Origin Resource Sharing middleware

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ERecipeHub.git
   cd ERecipeHub
   ```

### Running the Application

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ERecipeBack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:
   - Create `.env.development` for development:
     ```
     NODE_ENV=development
     PORT=10000
     MONGODB_URI=mongodb://localhost:27017/test
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:3000
     STORAGE_TYPE=local
     IMAGE_BASE_URL=http://localhost:10000
     ```

4. Create required directories:
   ```bash
   mkdir -p public/images/recipes
   mkdir -p public/images/steps
   ```

5. Start MongoDB:
   ```bash
   # Windows
   "C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
   
   # macOS/Linux
   mongod
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:10000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../ERecipeFront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   - Create `.env.development` for development:
     ```
     REACT_APP_API_URL=http://localhost:10000
     ```

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Features

- User authentication (signup, login, password change)
- Recipe management (create, read, update, delete)
- Recipe discovery with search, filter, and sort options
- Rating and commenting system
- Favorite recipes functionality
- Content reporting system
- Admin dashboard for content moderation
- Responsive design for all devices

## Project Structure

The project is organized into two main directories:

- **ERecipeFront** - React frontend application
- **ERecipeBack** - Node.js/Express backend API

For more detailed information about each part of the application, please refer to the README files in the respective directories.
