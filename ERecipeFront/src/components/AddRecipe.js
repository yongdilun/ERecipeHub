import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './AddRecipe.css';
import Header from './Header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AddRecipe() {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState([{ step: '', image: null }]);
  const [stepImageFiles, setStepImageFiles] = useState([]);
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [recipeId, setRecipeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleStepImageSelection = (index, event) => {
    const file = event.target.files[0];
    const newStepImageFiles = [...stepImageFiles];
    newStepImageFiles[index] = file;
    setStepImageFiles(newStepImageFiles);
  };

  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][key] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleInstructionChange = (index, key, value) => {
    const newInstructions = [...instructions];
    newInstructions[index][key] = value;
    setInstructions(newInstructions);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { step: '', image: null }]);
    setStepImageFiles([...stepImageFiles, null]);
  };

  const handleViewRecipe = () => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleCreateNew = () => {
    setTitle('');
    setImageFile(null);
    setDescription('');
    setIngredients([{ name: '', quantity: '' }]);
    setInstructions([{ step: '', image: null }]);
    setStepImageFiles([]);
    setServings('');
    setCookingTime('');
    setPrepTime('');
    setCuisine('');
    setSuccessMessage('');
    setRecipeId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setLoadingImage(true);
    setError('');

    if (!title || !description || !servings || !cookingTime || !prepTime || !cuisine) {
      setError("Please fill out all required fields.");
      setLoadingImage(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      console.log("User ID:", userId);

      if (!userId) {
        setError("User ID not available. Please log in again.");
        setLoadingImage(false);
        setIsSubmitting(false);
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append('file', imageFile);
          const response = await axios.post(`${API_BASE_URL}/api/uploads/recipe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          imageUrl = response.data.imageUrl;
        } catch (uploadError) {
          setError("Failed to upload recipe image. Please try again.");
          setLoadingImage(false);
          setIsSubmitting(false);
          return;
        }
      }

      const stepImageUrls = await Promise.all(
        stepImageFiles.map(async (file) => {
          if (!file) return null;
          try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_BASE_URL}/api/uploads/recipestep`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.imageUrl;
          } catch {
            setError("Failed to upload one or more step images. Please try again.");
            setLoadingImage(false);
            setIsSubmitting(false);
            throw new Error("Step image upload failed.");
          }
        })
      );

      const data = {
        user_id: userId,
        title,
        description,
        servings: parseInt(servings, 10),
        cookingTime: parseInt(cookingTime, 10),
        prepTime: parseInt(prepTime, 10),
        cuisine,
        image_url: imageUrl,
        ingredients: ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
        })),
        instructions: instructions.map((instruction, index) => ({
          step: instruction.step,
          image: stepImageUrls[index],
        })),
      };

      const recipeResponse = await axios.post(`${API_BASE_URL}/api/addrecipes/add`, data);
      console.log('Recipe created successfully:', recipeResponse.data);
      setRecipeId(recipeResponse.data.recipeId);
      setSuccessMessage('Recipe created successfully!');
    } catch (error) {
      console.error('Recipe creation error:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Please ensure all fields are correctly filled out.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoadingImage(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="add-recipe-page">
        <section className="hero-section">
          <h1>Create Your Recipe</h1>
          <p>Share your culinary masterpiece with our community</p>
        </section>

        <div className="add-recipe-container">
          <h2>Create New Recipe</h2>
          {successMessage ? (
            <div className="success-message">
              <p>{successMessage}</p>
              <button onClick={handleViewRecipe}>View Recipe</button>
              <button onClick={handleCreateNew}>Create Another Recipe</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group required">
                <label>Recipe Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter recipe title"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group required">
                <label>Recipe Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter recipe description"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Recipe Image</label>
                <input 
                  type="file" 
                  onChange={handleImageSelection} 
                  disabled={isSubmitting}
                />
                {loadingImage && (
                  <div className="image-loading">
                    Uploading image...
                  </div>
                )}
                {imageFile && (
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Recipe Preview" 
                    className="recipe-image-preview" 
                  />
                )}
              </div>

              <div className="form-group required">
                <label>Ingredients</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-group">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Enter ingredient"
                      disabled={isSubmitting}
                    />
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={handleAddIngredient}
                  disabled={isSubmitting}
                >
                  + Add Ingredient
                </button>
              </div>

              <div className="form-group required">
                <label>Instructions</label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="instruction-step">
                    <label>Step {index + 1}</label>
                    <textarea
                      value={instruction.step}
                      onChange={(e) => handleInstructionChange(index, 'step', e.target.value)}
                      placeholder="Write instruction"
                      disabled={isSubmitting}
                    />
                    <input 
                      type="file" 
                      onChange={(e) => handleStepImageSelection(index, e)}
                      disabled={isSubmitting}
                    />
                    {loadingImage && (
                      <div className="image-loading">
                        Uploading image...
                      </div>
                    )}
                    {stepImageFiles[index] && (
                      <img 
                        src={URL.createObjectURL(stepImageFiles[index])} 
                        alt={`Step ${index + 1}`} 
                        className="step-image-preview" 
                      />
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={handleAddInstruction}
                  disabled={isSubmitting}
                >
                  + Add Step
                </button>
              </div>

              <div className="form-group required">
                <label>Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="Enter servings"
                  disabled={isSubmitting}
                  min="1"
                />
              </div>

              <div className="form-group required">
                <label>Cooking Time (in minutes)</label>
                <input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="Enter cooking time"
                  disabled={isSubmitting}
                  min="1"
                />
              </div>

              <div className="form-group required">
                <label>Prep Time (in minutes)</label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="Enter prep time"
                  disabled={isSubmitting}
                  min="1"
                />
              </div>

              <div className="form-group required">
                <label>Cuisine</label>
                <select 
                  value={cuisine} 
                  onChange={(e) => setCuisine(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select cuisine</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                </select>
              </div>

              {error && <p className="error-message">{error}</p>}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={isSubmitting ? 'button-submitting' : ''}
              >
                {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AddRecipe;
