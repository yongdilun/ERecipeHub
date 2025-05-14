import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import './ManageReports.css';
import { FaExclamationCircle, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching reports');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reportId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/admin/reports/${reportId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReports(); // Refresh reports after update
        } catch (err) {
            setError('Error updating report status');
        }
    };

    const handleViewContent = (report) => {
        if (report.reportedContentType === 'recipe') {
            navigate(`/admin/recipes/${report.reportedContentId}/manage`, {
                state: { reportId: report._id }
            });
        } else if (report.reportedContentType === 'comment') {
            navigate(`/admin/recipes/${report.recipeId}/manage`, {
                state: { 
                    focusCommentId: report.reportedContentId,
                    reportId: report._id
                }
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'var(--warning-color)';
            case 'resolved': return 'var(--success-color)';
            case 'rejected': return 'var(--danger-color)';
            default: return 'var(--text-color)';
        }
    };

    if (loading) return (
        <div className="manage-reports">
            <AdminHeader />
            <div className="manage-reports-container">
                <div className="loading">Loading...</div>
            </div>
        </div>
    );

    return (
        <div className="manage-reports">
            <AdminHeader />
            <div className="manage-reports-container">
                <h1>Manage Reports</h1>
                {error && <div className="error-message">{error}</div>}
                
                <div className="reports-grid">
                    {reports.map(report => (
                        <div key={report._id} className="report-card">
                            <div className="report-header">
                                <span className="report-type">
                                    {report.reportedContentType.toUpperCase()}
                                </span>
                                <span 
                                    className="report-status"
                                    style={{ color: getStatusColor(report.status) }}
                                >
                                    {report.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="report-content">
                                <p><strong>Reason:</strong> {report.reason}</p>
                                {report.description && (
                                    <p><strong>Description:</strong> {report.description}</p>
                                )}
                                <p><strong>Reported by:</strong> {report.reporter.username}</p>
                                <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="report-actions">
                                <button
                                    onClick={() => handleViewContent(report)}
                                    className="view-button"
                                >
                                    <FaEye /> View Content
                                </button>
                                {report.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                            className="resolve-button"
                                        >
                                            <FaCheck /> Resolve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(report._id, 'rejected')}
                                            className="reject-button"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageReports;
