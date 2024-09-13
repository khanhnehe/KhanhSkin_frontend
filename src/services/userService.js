import axios from "../axios";

const loginApiService = (email, password) => {
    return axios.post('/User/sign-in', { email, password });
}

const getAllUser = () => {
    return axios.get ('/User/get-all-users');
}

export { 
    loginApiService,
    getAllUser

 };
