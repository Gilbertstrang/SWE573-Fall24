import axiosInstance from '../services/axiosInstance';

// Service to handle post-related operations
const postService = {
  
  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get('/posts');
      return response.data._embedded?.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw error;
    }
  },

  createPost: async (formData) => {
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
  },

  upvotePost: async (id) => {
    try {
      await axiosInstance.post(`/posts/${id}/upvote`);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  },

  downvotePost: async (id) => {
    try {
      await axiosInstance.post(`/posts/${id}/downvote`);
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  },
};

export default postService;
