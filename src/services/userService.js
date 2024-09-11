import axios from "../axios";

const loginApiService = (email, password) => {
    return axios.post('/User/sign-in', { email, password });
}

export { loginApiService };
