# ERecipeHub Frontend

A React-based frontend for the ERecipeHub recipe sharing platform, providing a modern, responsive interface for users to discover, create, and share recipes.

## Features

- User Authentication
  - Login/Signup with validation
  - Password Change with security checks
  - Profile Management
  - Role-based access control (user/admin)
- Recipe Management
  - Create New Recipes with multi-step form
  - Edit Existing Recipes with image uploads
  - Delete Recipes with confirmation
  - View Recipe Details with step-by-step instructions
- Recipe Interactions
  - Rate Recipes (1-5 stars)
  - Comment on Recipes
  - Favorite Recipes for quick access
  - Report Inappropriate Content
- Recipe Discovery
  - Search Recipes by title, description, or cuisine
  - Filter by Cuisine type
  - Sort by date, rating, or title
  - View Latest Recipes on homepage
  - View Top-Rated Recipes on homepage
- Admin Dashboard
  - User Management Overview with activity metrics
  - Recipe Management with moderation tools
  - Report Management with resolution workflow
  - Activity Statistics and analytics
  - Content Moderation tools
- Content Reporting System
  - Report Recipes for various violation types
  - Report Comments for inappropriate content
  - Report Status Tracking (pending/resolved/rejected)
  - Admin Review Interface with draggable details panel
- Responsive Design
  - Mobile-Friendly Interface
  - Adaptive Layout for all screen sizes
  - Consistent styling across components

## Tech Stack

- **React** - Frontend Framework for building the user interface
- **React Router** - Client-side Routing for navigation between pages
- **Axios** - HTTP Client for API communication with the backend
- **React Icons** - Icon Components for enhanced UI elements
- **Font Awesome** - Icon Library for additional visual elements
- **React Draggable** - Draggable Components for interactive admin interfaces
- **CSS3** - Styling with component-specific CSS files
- **localStorage** - Browser storage for authentication tokens and user data

## Architecture

### Component Structure

The application follows a component-based architecture with:

1. **Page Components** - Full pages like Home, Recipes, RecipeDetail
2. **Shared Components** - Reusable elements like Header, Footer
3. **Form Components** - Input handling for AddRecipe, EditRecipe, Login, etc.
4. **Admin Components** - Dashboard and management interfaces
5. **Protected Components** - Routes that require authentication

### Authentication Flow

1. User submits login/signup form
2. Credentials sent to backend API
3. On success, JWT token stored in localStorage
4. Protected routes check for token presence
5. Admin routes additionally check for admin role
6. Token included in subsequent API requests
7. On logout, token and user data cleared from localStorage

### State Management

- Component-level state using React's useState hook
- Props for passing data between parent and child components
- localStorage for persistent authentication state
- URL parameters for dynamic routing (recipe IDs, etc.)

### Styling Approach

- Component-specific CSS files (e.g., Home.css, RecipeDetail.css)
- CSS variables for consistent theming (colors, spacing, etc.)
- Responsive design with media queries
- Flexbox and Grid for layout

## Project Structure

```
frontend/
├── public/                    # Static files
│   ├── images/                # Static images (logo, background, etc.)
│   ├── _redirects             # Netlify redirects configuration
│   ├── manifest.json          # Web app manifest
│   └── index.html             # HTML template
├── src/
│   ├── components/            # React components
│   │   ├── AddRecipe.js       # Recipe creation form
│   │   ├── EditRecipe.js      # Recipe editing form
│   │   ├── Home.js            # Homepage with featured recipes
│   │   ├── Header.js          # Navigation header
│   │   ├── Login.js           # User login form
│   │   ├── MyRecipes.js       # User's recipes list
│   │   ├── Profile.js         # User profile management
│   │   ├── RecipeDetail.js    # Detailed recipe view
│   │   ├── Recipes.js         # Recipe browsing with filters
│   │   ├── Signup.js          # User registration form
│   │   ├── AdminDashboard.js  # Admin overview page
│   │   ├── AdminHeader.js     # Admin navigation header
│   │   ├── UserOverview.js    # User management for admins
│   │   ├── RecipeOverview.js  # Recipe management for admins
│   │   ├── ManageRecipe.js    # Detailed recipe management
│   │   └── ManageReports.js   # Content report management
│   ├── styles/                # CSS files for components
│   │   ├── Home.css
│   │   ├── RecipeDetail.css
│   │   ├── AdminDashboard.css
│   │   └── ...
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── reportWebVitals.js     # Performance monitoring
├── .env.development           # Development environment variables
└── .env.production            # Production environment variables
```

## Environment Variables

The application uses environment variables to configure API endpoints and other settings based on the environment.

### Development (.env.development)
```env
# Backend API URL for local development
REACT_APP_API_URL=http://localhost:10000
```

### Production (.env.production)
```env
# Backend API URL for production deployment
REACT_APP_API_URL=https://erecipehubback.onrender.com
```

### Environment Variable Usage

- **REACT_APP_API_URL**: Base URL for all API requests
  - Used in Axios requests throughout the application
  - Automatically selected based on the build environment
  - Can be overridden at build time

## Available Scripts

### `npm start`
- Runs the app in development mode
- Opens [http://localhost:3000](http://localhost:3000)
- Hot reloads on changes

### `npm run build`
- Builds the app for production
- Outputs to the `build` folder
- Optimizes build for best performance

### `npm test`
- Launches the test runner
- Runs in interactive watch mode

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yongdilun/ERecipeFront.git
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
- Copy `.env.example` to `.env.development` for local development
- Copy `.env.example` to `.env.production` for production
- Fill in the appropriate values

4. Start the development server:
```bash
npm start
```

## Dependencies

- **@fortawesome/fontawesome-svg-core**: Core library for Font Awesome, used to manage icons in SVG format.
- **@fortawesome/free-regular-svg-icons**: Collection of free regular-style icons from Font Awesome.
- **@fortawesome/free-solid-svg-icons**: Collection of free solid-style icons from Font Awesome.
- **@fortawesome/react-fontawesome**: React wrapper for Font Awesome, enabling easy integration of Font Awesome icons in React projects.
- **@testing-library/jest-dom**: Custom Jest matchers for testing DOM elements more effectively.
- **@testing-library/react**: Testing utilities for React components, helping simulate user interactions.
- **@testing-library/user-event**: Simulates complex user interactions like typing or clicking during tests.
- **axios**: Promise-based HTTP client for making API requests in JavaScript and React.
- **react**: Core library for building user interfaces with components.
- **react-dom**: React package for working with the DOM, enabling rendering of React components to web pages.
- **react-draggable**: Provides functionality for making elements draggable within React applications.
- **react-icons**: Library of popular icon sets for React, offering lightweight SVG-based icons.
- **react-router-dom**: Declarative routing library for handling navigation in React applications.
- **react-scripts**: Configuration and scripts for building React applications (used in Create React App projects).
- **web-vitals**: Utility for measuring essential web performance metrics like loading, interactivity, and visual stability.


## Key Features in Detail

### Recipe Creation and Editing

The recipe creation process is handled through a multi-step form that allows users to:

1. Add basic recipe information (title, description, cuisine)
2. Specify cooking details (prep time, cooking time, servings)
3. Add ingredients with quantities
4. Create step-by-step cooking instructions
5. Upload images for the recipe and individual steps

The form includes validation to ensure all required fields are completed before submission.

### Recipe Discovery

Users can discover recipes through multiple methods:

- **Homepage Carousels**: Latest and top-rated recipes
- **Search Functionality**: Find recipes by title, description, or cuisine
- **Filtering**: Narrow results by cuisine type
- **Sorting**: Arrange recipes by date, rating, or title

### User Authentication

The authentication system provides:

- **Secure Login**: JWT-based authentication
- **Registration**: With email validation and password strength checking
- **Profile Management**: Update user information
- **Role-Based Access**: Different permissions for regular users and admins

### Admin Interface

The admin interface is a protected area accessible only to users with the admin role.

#### Dashboard
- Overview of site statistics with real-time metrics
- Recent activity monitoring with latest recipes and comments
- User growth tracking with new user statistics
- Popular content analysis based on ratings and engagement

#### User Management
- User statistics overview with total and new user counts
- Activity monitoring showing recipes, comments, and ratings per user
- Role management capabilities
- Comprehensive user listing with detailed activity metrics

#### Recipe Management
- Recipe moderation tools for content review
- Content editing capabilities
- Recipe deletion with associated content cleanup
- Statistics tracking for engagement metrics

#### Report Management
- Content report review interface
- Report status updates (pending/resolved/rejected)
- Draggable report details window for better workflow
- Quick access to reported content with direct links

## Browser Support

```json
"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

## Contributing

Feel free to contribute to this project. Fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Backend server** running (see backend setup in the backend README)
- Modern web browser (Chrome, Firefox, Edge, etc.)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ERecipeHub.git
   cd ERecipeHub/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   - Create `.env.development` file in the root directory
   ```env
   REACT_APP_API_URL=http://localhost:10000
   ```

4. **Start the Development Server**:
   ```bash
   npm start
   # or
   yarn start
   ```
   - This will open http://localhost:3000 in your browser
   - The page will reload when you make changes
   - Any lint errors will appear in the console

### Building for Production

1. **Create Production Environment File**:
   - Create `.env.production` with your production API URL
   ```env
   REACT_APP_API_URL=https://your-production-api.com
   ```

2. **Build the Application**:
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Deploy the Build Folder**:
   - The optimized production build will be in the `build` folder
   - Deploy this folder to your hosting service (Netlify, Vercel, etc.)

### Deployment Options

- **Netlify**: Supports automatic deployment from GitHub
- **Vercel**: Optimized for React applications
- **GitHub Pages**: Free hosting for static sites
- **AWS S3**: Scalable static website hosting

### Troubleshooting Common Issues

- **Port 3000 already in use**:
  - React will automatically suggest using another port
  - Type 'Y' to accept the alternative port

- **API connection failed**:
  - Ensure backend server is running
  - Check REACT_APP_API_URL in .env.development
  - Verify CORS settings on the backend

- **Images not loading**:
  - Verify backend server is running
  - Check image paths in backend public/images directory
  - Inspect network requests in browser developer tools

- **Authentication issues**:
  - Clear localStorage in browser
  - Check token expiration settings
  - Verify credentials with backend

### Development Tips

- **Use Chrome DevTools** for debugging
- **Enable React Developer Tools** extension
- **Check console** for errors and warnings
- **Use Network tab** to monitor API calls
- **Use React.StrictMode** to catch potential problems

### Testing the Admin Interface

1. Create a user account through the signup form
2. Use MongoDB Compass to change user role to 'admin':
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Log in with admin credentials
4. Access admin dashboard at /admin/dashboard
