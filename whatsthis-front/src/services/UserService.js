import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

const getAllUsers = () => {
    return axios.get(`${API_BASE_URL}/users`);
};

const createUser = (user) => {
    return axios.post(`${API_BASE_URL}/users`, user);
};

export default {
    getAllUsers,
    createUser
};
