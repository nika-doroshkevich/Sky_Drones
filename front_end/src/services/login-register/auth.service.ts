import axios from "axios";

const API_URL = "http://127.0.0.1:8000/sky-drones/";

class AuthService {
    login(email: string, password: string) {
        console.log("auth email, password " + email + " " + password);
        return axios
            .post(API_URL + "login", {
                email,
                password
            })
            .then(response => {

                if (response.data.access) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(email: string, username: string, password: string, role: string) {
        return axios.post(API_URL + "register", {
            email,
            username,
            password,
            role,
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
}

export default new AuthService();
