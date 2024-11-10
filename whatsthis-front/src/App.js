import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostCreatePage from './pages/PostCreatePage';
import PostDetailPage from './pages/PostDetailsPage'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-post" element={<PostCreatePage />} />
                <Route path="/posts/:postId" element={<PostDetailPage />} /> 
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
