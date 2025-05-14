import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import './ManageRecipe.css';
import { FaTrash, FaStar, FaClock, FaUtensils, FaHourglassHalf, FaComment, FaFlag, FaTimes, FaCheck, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ManageRecipe = () => {
    const { recipeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const focusCommentId = location.state?.focusCommentId;
    const [showReportDetails, setShowReportDetails] = useState(false);
    const [reportDetails, setReportDetails] = useState(null);
    const reportId = location.state?.reportId;
    const [modalPosition, setModalPosition] = useState({ x: window.innerWidth - 450, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetchRecipeAndComments();
    }, [recipeId]);

    useEffect(() => {
        if (focusCommentId) {
            const commentElement = document.getElementById(`comment-${focusCommentId}`);
            if (commentElement) {
                commentElement.scrollIntoView({ behavior: 'smooth' });
                commentElement.classList.add('admin-highlighted-comment');
            }
        }
    }, [focusCommentId, comments]);

    useEffect(() => {
        const fetchReportDetails = async () => {
            if (reportId) {
                try {
                    const token = localStorage.getItem('token');
                    console.log('Fetching report details for ID:', reportId);
                    const response = await axios.get(
                        `${API_BASE_URL}/api/admin/reports/${reportId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('Report details response:', response.data);
                    if (response.data.success) {
                        setReportDetails(response.data.data);
                        setShowReportDetails(true);
                    }
                } catch (err) {
                    console.error('Error fetching report details:', err);
                    setError('Error fetching report details');
                }
            }
        };

        fetchReportDetails();
    }, [reportId]);

    const fetchRecipeAndComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const [recipeRes, commentsRes, stepsRes, ingredientsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/recipes/${recipeId}`),
                axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/comments`),
                axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/steps`),
                axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/ingredients`)
            ]);

            setRecipe(recipeRes.data.recipe);
            setComments(commentsRes.data.comments);
            setSteps(stepsRes.data);
            setIngredients(ingredientsRes.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching recipe details');
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/recipes/${recipeId}/edit`);
    };

    const handleDeleteRecipe = async () => {
        if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/api/admin/recipes/${recipeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { source: 'admin' }
                });
                navigate(-1);
            } catch (err) {
                setError('Error deleting recipe');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/api/admin/comments/${commentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const commentsRes = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/comments`);
                setComments(commentsRes.data.comments);
            } catch (err) {
                setError('Error deleting comment');
            }
        }
    };

    const handleReportStatusUpdate = async (status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE_URL}/api/admin/reports/${reportId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReportDetails(prev => ({ ...prev, status }));
        } catch (err) {
            console.error('Error updating report status:', err);
        }
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.admin-modal-controls')) return;
        
        const modalElement = e.currentTarget.parentElement;
        const rect = modalElement.getBoundingClientRect();
        
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // Ensure the modal stays within the viewport
        const maxX = window.innerWidth - 400; // modal width
        const maxY = window.innerHeight - (isMinimized ? 50 : 400); // modal height

        setModalPosition({
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY)
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                handleMouseMove(e);
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    if (loading) return (
        <div className="admin-manage-recipe">
            <AdminHeader />
            <div className="admin-manage-container">
                <div className="admin-loading">Loading...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-manage-recipe">
            <AdminHeader />
            <div className="admin-manage-container">
                <div className="admin-error-message">{error}</div>
            </div>
        </div>
    );

    console.log('Show report details:', showReportDetails);
    console.log('Report details:', reportDetails);

    return (
        <div className="admin-manage-recipe">
            <AdminHeader />
            <div className="admin-manage-container">
                <div className="admin-recipe-header">
                    <h1>{recipe.title}</h1>
                    <div className="admin-action-buttons">
                        <button onClick={handleEdit} className="admin-edit-button">
                            Edit Recipe
                        </button>
                        <button onClick={handleDeleteRecipe} className="admin-delete-button">
                            Delete Recipe
                        </button>
                    </div>
                </div>

                <div className="admin-recipe-content">
                    <div className="admin-recipe-main">
                        <div className="admin-recipe-image">
                            <img 
                                src={recipe.image_url.startsWith('http') 
                                    ? recipe.image_url 
                                    : `${API_BASE_URL}${recipe.image_url}`} 
                                alt={recipe.title} 
                            />
                        </div>

                        <div className="admin-recipe-info">
                            <p className="admin-description">{recipe.description}</p>
                            <div className="admin-recipe-stats">
                                <div className="admin-stat-item">
                                    <FaHourglassHalf className="admin-icon" />
                                    <span>{recipe.prep_time}m prep</span>
                                </div>
                                <div className="admin-stat-item">
                                    <FaClock className="admin-icon" />
                                    <span>{recipe.cooking_time}m cook</span>
                                </div>
                                <div className="admin-stat-item">
                                    <FaUtensils className="admin-icon" />
                                    <span>{recipe.servings} servings</span>
                                </div>
                                <div className="admin-stat-item">
                                    <FaStar className="admin-icon" />
                                    <span>{recipe.averageRating?.toFixed(1) || 'No ratings'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-recipe-details">
                        <div className="admin-ingredients-section">
                            <h2>Ingredients</h2>
                            <ul className="admin-ingredients-list">
                                {ingredients.map(ingredient => (
                                    <li key={ingredient._id} className="admin-ingredient-item">
                                        <span className="admin-ingredient-quantity">{ingredient.quantity}</span>
                                        <span className="admin-ingredient-name">{ingredient.ingredient_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="admin-steps-section">
                            <h2>Steps</h2>
                            <ol className="admin-steps-list">
                                {steps.map(step => (
                                    <li key={step._id} className="admin-step-item">
                                        <div className="admin-step-content">
                                            <p>{step.description}</p>
                                            {step.image_url && (
                                                <div className="admin-step-image-container">
                                                    <img 
                                                        src={step.image_url.startsWith('http') 
                                                            ? step.image_url 
                                                            : `${API_BASE_URL}${step.image_url}`
                                                        } 
                                                        alt={`Step ${step.step_number}`} 
                                                        className="admin-step-image"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="admin-comments-section">
                        <h2>
                            <FaComment className="admin-icon" />
                            Comments ({comments.length})
                        </h2>
                        <div className="admin-comments-list">
                            {comments.map(comment => (
                                <div 
                                    key={comment._id} 
                                    id={`comment-${comment._id}`}
                                    className={`admin-comment ${focusCommentId === comment._id ? 'admin-highlighted-comment' : ''}`}
                                >
                                    <div className="admin-comment-header">
                                        <div className="admin-comment-info">
                                            <span className="admin-comment-author">
                                                {comment.user_id.username}
                                            </span>
                                            <span className="admin-comment-date">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="admin-delete-comment-button"
                                            title="Delete comment"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <p className="admin-comment-content">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showReportDetails && reportDetails && (
                    <div 
                        className={`admin-report-modal ${isMinimized ? 'minimized' : ''}`}
                        style={{
                            left: `${modalPosition.x}px`,
                            top: `${modalPosition.y}px`,
                            cursor: isDragging ? 'grabbing' : 'default'
                        }}
                    >
                        <div 
                            className="admin-report-modal-header"
                            onMouseDown={handleMouseDown}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        >
                            <h2>Report Details</h2>
                            <div className="admin-modal-controls">
                                <button 
                                    className="admin-minimize-modal-btn"
                                    onClick={() => setIsMinimized(!isMinimized)}
                                >
                                    {isMinimized ? <FaWindowMaximize /> : <FaWindowMinimize />}
                                </button>
                                <button 
                                    className="admin-close-modal-btn"
                                    onClick={() => setShowReportDetails(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <div className="admin-report-modal-content">
                            <div className="admin-report-info">
                                <p>
                                    <strong>Type:</strong> 
                                    {reportDetails.reportedContentType}
                                </p>
                                <p>
                                    <strong>Status:</strong> 
                                    <span className={`admin-report-status-${reportDetails.status}`}>
                                        {reportDetails.status.toUpperCase()}
                                    </span>
                                </p>
                                <p>
                                    <strong>Reason:</strong> 
                                    {reportDetails.reason}
                                </p>
                                {reportDetails.description && (
                                    <p>
                                        <strong>Description:</strong>
                                        {reportDetails.description}
                                    </p>
                                )}
                                <p>
                                    <strong>Reported by:</strong> 
                                    {reportDetails.reporter.username}
                                </p>
                                <p>
                                    <strong>Date:</strong> 
                                    {new Date(reportDetails.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {reportDetails.status === 'pending' && (
                                <div className="admin-report-actions">
                                    <button
                                        onClick={() => handleReportStatusUpdate('resolved')}
                                        className="admin-resolve-btn"
                                    >
                                        <FaCheck /> Mark as Resolved
                                    </button>
                                    <button
                                        onClick={() => handleReportStatusUpdate('rejected')}
                                        className="admin-reject-btn"
                                    >
                                        <FaTimes /> Reject Report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRecipe;
