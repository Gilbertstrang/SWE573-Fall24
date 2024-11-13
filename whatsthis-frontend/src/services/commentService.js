import axiosInstance from './axiosInstance';

const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    return response.data._embedded ? response.data._embedded.comments : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const addComment = async (postId, text) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, { text });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export default {
  getCommentsByPostId,
  addComment,
};
