import axios from "axios";
import authHeader from "./login-register/auth-header";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class CompanyService {

    async create(name: string, phone: string, website: string, company_type: string, inspecting_company: number) {
        const authConfig = await authHeader();
        return axios.post(API_URL + "company", {
            name,
            phone,
            website,
            company_type,
            inspecting_company
        }, authConfig);
    }

    async update(id: number, name: string, phone: string, website: string, company_type: string) {
        const authConfig = await authHeader();
        return axios.put(API_URL + "company/" + id, {
            name,
            phone,
            website,
            company_type,
        }, authConfig);
    }

    async getCompaniesByType(companyType: string) {
        return axios.get(API_URL + "company?type=" + companyType, await authHeader());
    }
}

export default new CompanyService();
