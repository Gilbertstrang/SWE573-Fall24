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
        'Content-Type': 'application/json',
      },
    });
    console.log('Create post response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

const votePost = async (postId, userId, voteType) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/${voteType}`, { userId });
    return response.data;
  } catch (error) {
    console.error(`Error ${voteType}ing post:`, error);
    throw error;
  }
};

const getUserVote = async (postId, userId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/vote/${userId}`);
    return response.data.voteType;
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
};

const searchPosts = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value !== '' && value !== false)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await axiosInstance.get(`/posts/search?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  votePost,
  getUserVote,
  searchPosts,
};
