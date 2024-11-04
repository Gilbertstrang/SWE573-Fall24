import React, { useEffect, useState } from 'react';
import postService from '../services/postService';
import { Link } from 'react-router-dom';

function HomePage() {
    const [posts, setPosts] = useState([]);  // Initialize posts as an empty array
    const [loading, setLoading] = useState(true); // Manage loading state
    const [error, setError] = useState(''); // Manage error state

    useEffect(() => {
        postService.getAllPosts()
            .then((response) => {
                console.log("Fetched posts data:", response.data); // Log the response data

                // Access the posts correctly from the _embedded property
                if (response.data._embedded && response.data._embedded.postDtoes) {
                    setPosts(response.data._embedded.postDtoes);
                } else {
                    setPosts([]); // If structure is unexpected, set an empty array
                }

                setLoading(false); // Stop loading when the response is received
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Failed to fetch posts. Please try again later.");
                setLoading(false); // Stop loading on error
            });
    }, []);

    if (loading) {
        return <div>Loading posts...</div>;  // Display loading indicator
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>; // Display error message
    }

    return (
        <div className="container">
            <h2 className="my-4">Latest Posts</h2>
            <Link to="/create-post" className="btn btn-primary mb-4">Create a New Post</Link>
            <div className="post-feed">
                {posts.length === 0 ? (
                    <p>No posts available. Be the first to create one!</p>
                ) : (
                    <ul className="list-group">
                        {posts.map(post => (
                            <li key={post.id} className="list-group-item mb-3">
                                <h4>{post.title}</h4>
                                <p>{post.description}</p>
                                <Link to={`/posts/${post.id}`} className="btn btn-link">Read More</Link>
                                {/* Example: Render images */}
                                {post.imageUrls && post.imageUrls.length > 0 && (
                                    <div className="image-gallery">
                                        {post.imageUrls.map((url, index) => (
                                            <img key={index} src={url} alt={`Post Image ${index + 1}`} width="100" />
                                        ))}
                                    </div>
                                )}
                                {/* Example: Render tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="tags">
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary mx-1">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default HomePage;
