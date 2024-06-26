import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class UserService {
    async update(id: number, title: string, username: string, email: string, phone: string, job_title: string) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "user/" + id, {
            title,
            email,
            username,
            phone,
            job_title,
        }, authConfig);
    }

    async joinCompany(id: number, email: string, company: number) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "join-company/" + id, {
            email,
            company
        }, authConfig);
    }

    async makeUserInactive(id: number, email: string) {
        const status = "INACTIVE";
        const authConfig = await authHeader();
        return axios.put(API_URL + "user/" + id, {
            email,
            status
        }, authConfig);
    }

    async getUser() {
        return axios.get(API_URL + "user", await authHeader());
    }

    async getList() {
        return axios.get(API_URL + "users", await authHeader());
    }
}

export default new UserService();
