import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class InspectionService {

    async create(name: string, reason: string, facility: number) {
        const authConfig = await authHeader();
        return axios.post(API_URL + "inspection-create", {
            name,
            reason,
            facility
        }, authConfig);
    }

    async update(id: number, priority: string, pilot: number, inspector: number, status: string) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "inspection-update/" + id, {
            priority,
            pilot,
            inspector,
            status
        }, authConfig);
    }

    async updateStatus(id: number, status: string) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "inspection-update/" + id, {
            status
        }, authConfig);
    }

    async get(id: number) {
        const authConfig = await authHeader();
        return axios.get(API_URL + "inspection/" + id, authConfig);
    }

    async getList() {
        const authConfig = await authHeader();
        return axios.get(API_URL + "inspection-list", authConfig);
    }
}

export default new InspectionService();
