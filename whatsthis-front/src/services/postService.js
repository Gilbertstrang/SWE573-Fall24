import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

const getAllPosts = () => {
    return axios.get(`${API_BASE_URL}/posts`);
};

const createPost = (post) => {
    return axios.post(`${API_BASE_URL}/posts`, post);
};

const getPostById = (postId) => {
    return axios.get(`${API_BASE_URL}/posts/${postId}`);
};

export default {
    getAllPosts,
    createPost,
    getPostById
};
