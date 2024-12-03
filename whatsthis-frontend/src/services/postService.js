import axiosInstance from './axiosInstance';

const getAllPosts = async () => {
  try {
    const response = await axiosInstance.get('/posts');
    return response.data._embedded?.postDtoes || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

const createPost = async (formData) => {
  try {
    const response = await axiosInstance.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

const upvotePost = async (id) => {
  try {
    const response = await axiosInstance.post(`/posts/${id}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
};

const downvotePost = async (id) => {
  try {
    const response = await axiosInstance.post(`/posts/${id}/downvote`);
    return response.data;
  } catch (error) {
    console.error('Error downvoting post:', error);
    throw error;
  }
};


const votePost = async (postId, userId, voteType) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/votes`, {
      userId,
      voteType, 
    });
    return response.data;
  } catch (error) {
    console.error(`Error ${voteType}ing post:`, error);
    throw error;
  }
};


const cancelVote = async (postId, userId) => {
  try {
    const response = await axiosInstance.delete(`/posts/${postId}/votes/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling vote:', error);
    throw error;
  }
};

const getUserVote = async (postId, userId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/votes/${userId}`);
    return response.data.voteType; 
  } catch (error) {
    console.error('Error fetching user vote:', error);
    throw error;
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  upvotePost,
  downvotePost,
  votePost,
  cancelVote,
  getUserVote,
};
