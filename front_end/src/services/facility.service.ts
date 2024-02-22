import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class FacilityService {

    async create(latitude: number, longitude: number, name: string, type: string, location: string,
                 description: string, company: number) {
        const authConfig = await authHeader();
        return axios.post(API_URL + "facility-create", {
            latitude,
            longitude,
            name,
            type,
            location,
            description,
            company
        }, authConfig);
    }

    async update(id: number, latitude: number, longitude: number, name: string, type: string, location: string,
                 description: string, company: number) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "facility/" + id, {
            latitude,
            longitude,
            name,
            type,
            location,
            description,
            company
        }, authConfig);
    }

    async get(id: number) {
        const authConfig = await authHeader();
        return axios.get(API_URL + "facility/" + id, authConfig);
    }
}

export default new FacilityService();
