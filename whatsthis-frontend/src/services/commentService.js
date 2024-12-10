import axiosInstance from './axiosInstance';

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get(`/comments/posts/${postId}/comments`);
    return response.data._embedded?.commentDtoes || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (commentData) => {
  try {
    const response = await axiosInstance.post('/comments', commentData);
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
