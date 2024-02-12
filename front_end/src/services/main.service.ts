import axios from 'axios';
import authHeader from './login-register/auth-header';

const API_URL = 'http://127.0.0.1:8000/sky-drones/';

class MainService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    async getUserBoard() {
        return axios.get(API_URL + 'user', await authHeader());
    }

    async getModeratorBoard() {
        return axios.get(API_URL + 'users', await authHeader());
    }

    async getOwnerBoard() {
        return axios.get(API_URL + 'users', await authHeader());
    }
}

export default new MainService();
