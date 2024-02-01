import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:8000/sky-drones/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    async getUserBoard() {
        return axios.get(API_URL + 'user', await authHeader());
    }

    async getModeratorBoard() {
        return axios.get(API_URL + 'mod', await authHeader());
    }

    async getAdminBoard() {
        return axios.get(API_URL + 'admin', await authHeader());
    }
}

export default new UserService();