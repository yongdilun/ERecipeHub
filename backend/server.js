const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const authRoute = require('./routes/auth'); 
const addRecipesRouter = require('./routes/addRecipes');
const uploadRouter = require('./routes/upload'); 
const recipesRouter = require('./routes/recipes'); 
const homeRoutes = require('./routes/home');
const myRecipesRouter = require('./routes/myRecipes');
const editRecipeRouter = require('./routes/editRecipe');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://your-frontend-domain.com', // Your frontend production domain
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// API Routes
app.use('/api/home', homeRoutes);
app.use('/api/auth', authRoute);
app.use('/api/addrecipes', addRecipesRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/myrecipes', myRecipesRouter);
app.use('/api/edit-recipe', editRecipeRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Root route should be last
app.get('/', (req, res) => {
  res.send('Hello, MERN!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
