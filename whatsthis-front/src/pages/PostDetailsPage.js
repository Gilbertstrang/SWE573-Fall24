import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import postService from '../services/postService';

function PostDetailPage() {
    const { postId } = useParams();  // Get the post ID from the URL
    const [post, setPost] = useState(null);  // Initialize post as null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        postService.getPostById(postId)
            .then((response) => {
                console.log("Fetched post data:", response.data);
                setPost(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
                setError("Failed to load the post. Please try again later.");
                setLoading(false);
            });
    }, [postId]);

    if (loading) {
        return <div>Loading post...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!post) {
        return <div>No post found.</div>;
    }

    return (
        <div className="container">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p><strong>Material:</strong> {post.material}</p>
            <p><strong>Color:</strong> {post.color}</p>
            <p><strong>Size:</strong> {post.size}</p>
            <p><strong>Weight:</strong> {post.weight}</p>
            <p><strong>Location:</strong> {post.location}</p>
            <p><strong>Time Period:</strong> {post.timePeriod}</p>
            <p><strong>Functionality:</strong> {post.functionality}</p>
            <p><strong>Handmade:</strong> {post.handmade ? 'Yes' : 'No'}</p>
            {/* Render images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="image-gallery">
                    {post.imageUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Post Image ${index + 1}`} width="200" className="mb-3" />
                    ))}
                </div>
            )}
            {/* Render tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="tags">
                    <strong>Tags:</strong>
                    {post.tags.map((tag, index) => (
                        <span key={index} className="badge bg-secondary mx-1">{tag}</span>
                    ))}
                </div>
            )}
            <h3>Comments</h3>
            {post.comments && post.comments.length > 0 ? (
                <ul className="list-group">
                    {post.comments.map((comment, index) => (
                        <li key={index} className="list-group-item mb-2">
                            <p>{comment.text}</p>
                            <small>Votes: {comment.votes}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
}

export default PostDetailPage;
