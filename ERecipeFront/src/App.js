import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from "./components/Login";
import Home from "./components/Home";
import AddRecipe from "./components/AddRecipe";
import Profile from './components/Profile';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import ChangePassword from './components/ChangePassword';
import MyRecipes from './components/MyRecipes';
import EditRecipe from './components/EditRecipe';
import AboutUs from './components/AboutUs';
import AdminDashboard from './components/AdminDashboard';
import UserOverview from './components/UserOverview';
import RecipeOverview from './components/RecipeOverview';
import ManageRecipe from './components/ManageRecipe';
import ManageReports from './components/ManageReports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('userId');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('role') === 'admin';
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/addrecipe" 
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/myrecipes" 
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-recipe/:recipeId" 
          element={
            <ProtectedRoute>
              <EditRecipe />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<AboutUs />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminProtectedRoute>
              <UserOverview />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/recipes" 
          element={
            <AdminProtectedRoute>
              <RecipeOverview />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/recipes/:recipeId/manage" 
          element={
            <AdminProtectedRoute>
              <ManageRecipe />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/recipes/:recipeId/edit" 
          element={
            <AdminProtectedRoute>
              <EditRecipe />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <AdminProtectedRoute>
              <ManageReports />
            </AdminProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
