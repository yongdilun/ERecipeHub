import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaHeart, FaFlag } from 'react-icons/fa';
import Header from './Header';
import './RecipeDetail.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RecipeDetail = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [hasRated, setHasRated] = useState(false);
    const [totalRatings, setTotalRatings] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState('');
    const [reportedId, setReportedId] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    const fetchRecipe = async () => {
        try {
            const recipeResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}`, {
                params: { user_id: userId },
            });

            const { recipe, averageRating, userRating } = recipeResponse.data;
            setRecipe(recipe);
            setAverageRating(Number(averageRating));
            setRating(userRating || 0);
            setHasRated(!!userRating);

            const ratingResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/rate`);
            setAverageRating(Number(ratingResponse.data.averageRating));
            setTotalRatings(ratingResponse.data.totalRatings);

            const stepsResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/steps`);
            setSteps(stepsResponse.data);

            const ingredientsResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/ingredients`);
            setIngredients(ingredientsResponse.data);

            const commentsResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/comments`);
            setComments(commentsResponse.data.comments);
            setTotalComments(commentsResponse.data.totalComments);
        } catch (error) {
            console.error('Error fetching recipe data:', error);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [recipeId]);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const response = await axios.get(
                    `${API_BASE_URL}/api/favorites/check/${recipeId}`,
                    { params: { userId } }
                );
                setIsFavorited(response.data.isFavorited);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [recipeId]);

    const handleRatingSubmit = async () => {
        try {
            if (!userId) {
                console.error("User ID not available. Please log in again.");
                return;
            }

            await axios.post(`${API_BASE_URL}/api/recipes/${recipeId}/rate`, {
                user_id: userId,
                rating
            });

            await fetchRecipe();
            setHasRated(true);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            if (!userId) {
                console.error("User ID not available. Please log in again.");
                return;
            }

            await axios.post(`${API_BASE_URL}/api/recipes/${recipeId}/comment`, {
                user_id: userId,
                content: newComment
            });

            setNewComment('');

            const commentsResponse = await axios.get(`${API_BASE_URL}/api/recipes/${recipeId}/comments`);
            setComments(commentsResponse.data.comments);
            setTotalComments(commentsResponse.data.totalComments);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleFavoriteClick = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            if (isFavorited) {
                await axios.delete(`${API_BASE_URL}/api/favorites/remove`, {
                    data: { user_id: userId, recipe_id: recipeId }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/favorites/add`, {
                    user_id: userId,
                    recipe_id: recipeId
                });
            }
            setIsFavorited(!isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleReport = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            await axios.post(`${API_BASE_URL}/api/reports/create`, {
                reporter: userId,
                reportedContentId: reportedId,
                reportedContentType: reportType,
                reason: reportReason,
                description: reportDescription || null
            });

            setShowReportModal(false);
            setReportReason('');
            setReportDescription('');
            alert('Report submitted successfully');
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Error submitting report');
        }
    };

    const openReportModal = (type, id) => {
        setReportType(type);
        setReportedId(id);
        setShowReportModal(true);
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <div>
            <Header />
            <div className="recipe-detail-container">
                <div className="recipe-detail-content">
                    <div className="recipe-detail-info">
                        <div className="recipe-header">
                            <h1>{recipe.title}</h1>
                            <div className="recipe-header-buttons">
                                <button 
                                    onClick={handleFavoriteClick}
                                    className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                                >
                                    <FaHeart /> {isFavorited ? 'Favorited' : 'Add to Favorites'}
                                </button>
                                <button 
                                    onClick={() => openReportModal('recipe', recipeId)}
                                    className="btn-secondary"
                                >
                                    <FaFlag /> Report Recipe
                                </button>
                            </div>
                        </div>
                        <p>Average Rating: {Number.isFinite(averageRating) ? averageRating.toFixed(1) : 'N/A'} / 5 ({totalRatings} ratings)</p>

                        <div className="rating-input">
                            <p>Rate this recipe:</p>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <FaStar
                                        key={index}
                                        className="star"
                                        color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        size={30}
                                        onClick={() => !hasRated && setRating(starValue)}
                                        onMouseEnter={() => !hasRated && setHover(starValue)}
                                        onMouseLeave={() => !hasRated && setHover(null)}
                                    />
                                );
                            })}
                            {!hasRated && (
                                <button onClick={handleRatingSubmit} className="rating-submit-button" disabled={hasRated}>
                                    Submit Rating
                                </button>
                            )}
                        </div>

                        <div className="recipe-detail-meta">
                            <p><span role="img" aria-label="prep-time">⏱️</span> {recipe.prep_time} min prep</p>
                            <p><span role="img" aria-label="cook-time">🍳</span> {recipe.cooking_time} min cook</p>
                            <p><span role="img" aria-label="servings">🍽️</span> {recipe.servings} Servings</p>
                        </div>
                        <p className="recipe-detail-description">{recipe.description}</p>
                    </div>
                    <div className="recipe-detail-image-wrapper">
                        <img
                            src={getImageUrl(recipe.image_url)}
                            alt={recipe.title}
                            className="recipe-detail-image"
                        />
                    </div>
                </div>

                <h2>Ingredients</h2>
                <ul className="recipe-ingredients">
                    {ingredients.map(ingredient => (
                        <li key={ingredient.ingredient_number}>
                            {ingredient.quantity} {ingredient.ingredient_name}
                        </li>
                    ))}
                </ul>

                <h2>Steps</h2>
                <ol className="recipe-steps">
                    {steps.map(step => (
                        <li key={step.step_number}>
                            <p>{step.description}</p>
                            {step.image_url && 
                                <img 
                                    src={getImageUrl(step.image_url)} 
                                    alt={`Step ${step.step_number}`} 
                                    className="recipe-step-image" 
                                />
                            }
                        </li>
                    ))}
                </ol>

                <h2>Comments ({totalComments})</h2>
                <ul className="recipe-comments">
                    {comments.map(comment => (
                        <li key={comment._id} className="comment-item">
                            <div className="comment-header">
                                <p><strong>{comment.user_id.username}</strong></p>
                                <button 
                                    onClick={() => openReportModal('comment', comment._id)}
                                    className="btn-icon"
                                    title="Report comment"
                                >
                                    <FaFlag />
                                </button>
                            </div>
                            <p>{comment.content}</p>
                            <p className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>

                {userId ? (
                    <div className="comment-section">
                        <textarea
                            className="comment-input"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Leave a comment"
                        />
                        <button onClick={handleCommentSubmit} className="comment-submit-button">
                            Submit Comment
                        </button>
                    </div>
                ) : (
                    <p>Log in to leave a comment.</p>
                )}

                {showReportModal && (
                    <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>Report {reportType}</h2>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Reason:</label>
                                    <select 
                                        value={reportReason} 
                                        onChange={(e) => setReportReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="SPAM">Spam</option>
                                        <option value="INAPPROPRIATE">Inappropriate Content</option>
                                        <option value="COPYRIGHT">Copyright Violation</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description (optional):</label>
                                    <textarea
                                        value={reportDescription}
                                        onChange={(e) => setReportDescription(e.target.value)}
                                        placeholder="Please provide additional details..."
                                        rows="4"
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => setShowReportModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn-primary"
                                        onClick={handleReport}
                                        disabled={!reportReason}
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RecipeDetail;
