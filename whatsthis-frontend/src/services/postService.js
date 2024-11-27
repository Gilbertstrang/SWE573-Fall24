import axiosInstance from '../services/axiosInstance';


  
 const getAllPosts = async () => {
    try {
        const response = await axiosInstance.get('/posts');
        console.log("Backend response:", response.data);
        const posts = response.data?._embedded?.postDtoes || [];

        return posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
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
      await axiosInstance.post(`/posts/${id}/upvote`);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

const downvotePost = async (id) => {
    try {
      await axiosInstance.post(`/posts/${id}/downvote`);
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  };


export default { getAllPosts, getPostById  };
