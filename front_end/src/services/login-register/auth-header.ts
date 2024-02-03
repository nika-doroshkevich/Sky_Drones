import axios, {AxiosRequestConfig} from "axios";

const API_URL = 'http://127.0.0.1:8000/sky-drones/';

export default async function authHeader(): Promise<AxiosRequestConfig> {
    const userStr = localStorage.getItem("user");
    let user = null;

    if (userStr) {
        user = JSON.parse(userStr);

        if (user.access && !isTokenExpired(user.access)) {
            return {headers: {Authorization: 'Bearer ' + user.access}};
        }

        if (user.refresh) {
            try {
                const refreshResponse = await axios.post(API_URL + "token/refresh/", {refresh: user.refresh});

                const newToken = {access: refreshResponse.data.access, refresh: user.refresh};
                localStorage.setItem("user", JSON.stringify(newToken));

                return {headers: {Authorization: 'Bearer ' + refreshResponse.data.access}};
            } catch (refreshError) {
                console.error("Error during token refresh:", refreshError);
                return {headers: {Authorization: ''}};
            }
        }
    }

    return {headers: {Authorization: ''}};
}

function isTokenExpired(token: string) {
    const decodedToken = parseJwt(token);
    return decodedToken.exp * 1000 < Date.now();
}

function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
