import axiosInstance from './axiosInstance';

const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get(`/api/comments/posts/${postId}/comments`);
    return response.data._embedded?.commentDtoes || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const addComment = async (commentData) => {
  try {
    const response = await axiosInstance.post('/api/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export default {
  getCommentsByPostId,
  addComment,
};
