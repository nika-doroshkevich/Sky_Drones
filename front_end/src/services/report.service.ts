import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class ReportService {

    async create(inspectionId: number) {
        const authConfig = await authHeader();
        return axios.post(API_URL + "report-create", {
            inspectionId
        }, authConfig);
    }
}

export default new ReportService();
