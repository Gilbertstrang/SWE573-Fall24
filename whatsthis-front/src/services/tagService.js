import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';  // Assuming you have an endpoint for wikidata

const getTagSuggestions = (query) => {
    return axios.get(`${API_BASE_URL}/tags/search`, {
        params: { query }
    });
};

export default {
    getTagSuggestions
};