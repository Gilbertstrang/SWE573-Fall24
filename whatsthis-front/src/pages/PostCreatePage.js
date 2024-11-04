import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import tagService from '../services/tagService'; 

function PostCreatePage() {
    const navigate = useNavigate();
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        material: '',
        size: '',
        color: '',
        timePeriod: '',
        location: '',
        weight: '',
        handmade: false,
        functionality: '',
        tags: [],
        imageUrls: []  // For URLs to images
    });
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostData({
            ...postData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleTagInputChange = (e) => {
        const query = e.target.value;

        if (query.length > 2) { 
            setLoadingTags(true);
            tagService.getTagSuggestions(query)
                .then((response) => {
                    setTagSuggestions(response.data);
                    setLoadingTags(false);
                })
                .catch((error) => {
                    console.error("Error fetching tag suggestions:", error);
                    setLoadingTags(false);
                });
        } else {
            setTagSuggestions([]);
        }
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.some(selectedTag => selectedTag.label === tag.label)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setTagSuggestions([]);
    };

    const handleRemoveTag = (index) => {
        setSelectedTags(selectedTags.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page
    
        const dataToSubmit = {
            ...postData,
            tags: selectedTags.map(tag => tag.label)  // Only send labels to the backend
        };
    
        postService.createPost(dataToSubmit)
            .then((response) => {
                console.log("Post created successfully:", response.data);
    
                // Navigate to the post details page using the ID of the created post
                navigate(`/posts/${response.data.id}`);
            })
            .catch((error) => {
                console.error("Error creating post:", error);
            });
    };

    return (
        <div className="container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={postData.title} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" value={postData.description} onChange={handleChange} />
                </div>

                {/* Add other fields like material, size, color, etc. */}
                <div className="mb-3">
                    <label htmlFor="material" className="form-label">Material</label>
                    <input type="text" className="form-control" id="material" name="material" value={postData.material} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="size" className="form-label">Size</label>
                    <input type="text" className="form-control" id="size" name="size" value={postData.size} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="color" className="form-label">Color</label>
                    <input type="text" className="form-control" id="color" name="color" value={postData.color} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="timePeriod" className="form-label">Time Period</label>
                    <input type="text" className="form-control" id="timePeriod" name="timePeriod" value={postData.timePeriod} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" name="location" value={postData.location} onChange={handleChange} />
                </div>

                {/* Wikidata Tag Input */}
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input type="text" className="form-control" id="tags" name="tags" onChange={handleTagInputChange} placeholder="Start typing to see suggestions..." />
                    {loadingTags && <div>Loading tags...</div>}
                    <ul className="list-group">
                        {tagSuggestions.map((tag, index) => (
                            <li key={index} className="list-group-item" onClick={() => handleTagSelect(tag)}>
                                <strong>{tag.label}</strong> - {tag.description}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Display selected tags */}
                {selectedTags.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label">Selected Tags:</label>
                        <div className="d-flex flex-wrap">
                            {selectedTags.map((tag, index) => (
                                <span key={index} className="badge bg-primary mx-1">
                                    {tag.label}
                                    <button type="button" className="btn-close ms-1" onClick={() => handleRemoveTag(index)} />
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" className="btn btn-success">Create Post</button>
            </form>
        </div>
    );
}

export default PostCreatePage;
