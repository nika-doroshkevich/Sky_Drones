import axios from "axios";
import authHeader from "./login-register/auth-header";
import IDefect from "../types/defect.type";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class DefectService {

    async create(defectsArray: IDefect[], inspectionId: number) {
        const defects = JSON.stringify(defectsArray);
        const authConfig = await authHeader();
        return axios.post(API_URL + "defects-create", {
            defects,
            inspectionId
        }, authConfig);
    }

    async delete(id: number) {
        const deleted = true;
        const authConfig = await authHeader();
        return axios.put(API_URL + "delete-defect/" + id, {
            deleted
        }, authConfig);
    }

    async getList(inspection_id: number) {
        const authConfig = await authHeader();
        return axios.get(API_URL + "defects-list/" + inspection_id, authConfig);
    }
}

export default new DefectService();
