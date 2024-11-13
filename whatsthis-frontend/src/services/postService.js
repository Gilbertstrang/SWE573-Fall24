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

const createPost = async (post) => {
  try {
    const response = await axiosInstance.post('/posts', post);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export default {
  getAllPosts,
  createPost,
};
