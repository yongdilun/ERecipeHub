import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AddRecipe.css';
import Header from './Header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState([{ step: '', image: null }]);
  const [stepImageFiles, setStepImageFiles] = useState([]);
  const [currentStepImages, setCurrentStepImages] = useState([]);
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/edit-recipe/${recipeId}`);
        const { recipe, ingredients: recipeIngredients, steps } = response.data;
        
        setTitle(recipe.title);
        setDescription(recipe.description);
        setCurrentImageUrl(getImageUrl(recipe.image_url));
        setServings(recipe.servings);
        setCookingTime(recipe.cooking_time);
        setPrepTime(recipe.prep_time);
        setCuisine(recipe.cuisine);
        
        setIngredients(recipeIngredients.map(ing => ({
          name: ing.ingredient_name,
          quantity: ing.quantity
        })));
        
        setInstructions(steps.map(step => ({
          step: step.description,
          image: getImageUrl(step.image_url)
        })));
        
        setCurrentStepImages(steps.map(step => getImageUrl(step.image_url)));
      } catch (error) {
        setError('Error fetching recipe details');
      }
    };

    fetchRecipe();
  }, [recipeId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoadingImage(true);
    setError('');

    try {
        let imageUrl = currentImageUrl;
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            const response = await axios.post(`${API_BASE_URL}/api/uploads/recipe`, formData);
            imageUrl = response.data.imageUrl;
        }

        const stepImageUrls = await Promise.all(
            stepImageFiles.map(async (file, index) => {
                if (!file) return currentStepImages[index] || null;
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post(`${API_BASE_URL}/api/uploads/recipestep`, formData);
                return response.data.imageUrl;
            })
        );

        const data = {
            title,
            description,
            servings: parseInt(servings, 10),
            cookingTime: parseInt(cookingTime, 10),
            prepTime: parseInt(prepTime, 10),
            cuisine,
            image_url: imageUrl,
            ingredients: ingredients.map(ingredient => ({
                name: ingredient.name,
                quantity: ingredient.quantity,
            })),
            instructions: instructions.map((instruction, index) => ({
                step: instruction.step,
                image: stepImageUrls[index] || instruction.image,
            })),
        };

        await axios.put(`${API_BASE_URL}/api/edit-recipe/${recipeId}`, data);
        setSuccessMessage('Recipe updated successfully!');
        
        setTimeout(() => {
            navigate(-1); // Navigate back one page for both user and admin
        }, 2000);
    } catch (error) {
        setError('Error updating recipe. Please try again.');
    } finally {
        setLoadingImage(false);
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) return;
    
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        try {
            setIsSubmitting(true);
            setLoadingImage(true);
            
            // Check if we're in admin route
            const isAdminRoute = window.location.pathname.includes('/admin/');
            
            await axios.delete(`${API_BASE_URL}/api/edit-recipe/${recipeId}`, {
                params: { source: isAdminRoute ? 'admin' : 'user' }
            });
            
            setSuccessMessage('Recipe deleted successfully!');
            
            setTimeout(() => {
                if (isAdminRoute) {
                    navigate(-2); // Go back two pages if in admin route
                    window.history.go(-2); // Force a double back navigation
                } else {
                    navigate(-1); // Go back one page if in normal route
                }
            }, 1500);
        } catch (error) {
            console.error('Delete error:', error);
            setError('Error deleting recipe. Please try again.');
        } finally {
            setLoadingImage(false);
            setIsSubmitting(false);
        }
    }
  };

  return (
    <>
      <Header />
      <div className="add-recipe-page">
        <div className="add-recipe-container">
          <h2>Edit Recipe</h2>
          {error && <div className="error-message">{error}</div>}
          {successMessage ? (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          ) : (
            <>
              <div className="edit-actions">
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className={`delete-recipe-btn ${isSubmitting ? 'button-submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Recipe'}
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Recipe Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter recipe title"
                  />
                </div>

                <div className="form-group">
                  <label>Recipe Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter recipe description"
                  />
                </div>

                <div className="form-group">
                  <label>Recipe Image:</label>
                  {currentImageUrl && (
                    <img 
                      src={currentImageUrl} 
                      alt="Current Recipe" 
                      className="recipe-image-preview" 
                    />
                  )}
                  <input type="file" onChange={handleImageSelection} />
                  {loadingImage && <p>Uploading image...</p>}
                  {imageFile && (
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="New Recipe Preview" 
                      className="recipe-image-preview" 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Ingredients:</label>
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-group">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Enter ingredient"
                      />
                      <input
                        type="text"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={handleAddIngredient}>+ Add Ingredient</button>
                </div>

                <div className="form-group">
                  <label>Instructions:</label>
                  {instructions.map((instruction, index) => (
                    <div key={index} className="instruction-step">
                      <label>Step {index + 1}</label>
                      <textarea
                        value={instruction.step}
                        onChange={(e) => handleInstructionChange(index, 'step', e.target.value)}
                        placeholder="Write instruction"
                      />
                      {currentStepImages[index] && (
                        <img 
                          src={currentStepImages[index]} 
                          alt={`Current Step ${index + 1}`} 
                          className="step-image-preview" 
                        />
                      )}
                      <input type="file" onChange={(e) => handleStepImageSelection(index, e)} />
                      {loadingImage && <p>Uploading image...</p>}
                      {stepImageFiles[index] && (
                        <img 
                          src={URL.createObjectURL(stepImageFiles[index])} 
                          alt={`New Step ${index + 1}`} 
                          className="step-image-preview" 
                        />
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddInstruction}>+ Add Step</button>
                </div>

                <div className="form-group">
                  <label>Servings:</label>
                  <input
                    type="text"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="Enter servings"
                  />
                </div>

                <div className="form-group">
                  <label>Cooking Time (in minutes):</label>
                  <input
                    type="text"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    placeholder="Enter cooking time"
                  />
                </div>

                <div className="form-group">
                  <label>Prep Time (in minutes):</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="Enter prep time"
                  />
                </div>

                <div className="form-group">
                  <label>Cuisine:</label>
                  <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                    <option value="">Select cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={isSubmitting ? 'button-submitting' : ''}
                >
                  {isSubmitting ? 'Updating Recipe...' : 'Update Recipe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default EditRecipe; 