import axiosInstance from './axiosInstance';

const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get(`/comments/posts/${postId}/comments`);
    console.log("Fetched comments:", response.data);
    return response.data._embedded?.commentDtoes || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const addComment = async ({ postId, text, userId, username, votes = 0 }) => {
    try {
      const payload = { postId, text, userId, username, votes };
      console.log("Payload being sent:", payload); 
  
      const response = await axiosInstance.post("/comments", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response from backend:", response.data); 
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
