import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class ImageUploadDownloadService {

    async upload(formData: FormData, facility_id: number) {
        const authConfig = await authHeader();
        return axios.post<string[]>(API_URL + 'upload-images/' + facility_id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...authConfig.headers
            },
        });
    }

    async get(facility_id: number) {
        return axios.get<string[]>(API_URL + 'get-images/' + facility_id, await authHeader());
    }
}

export default new ImageUploadDownloadService();
