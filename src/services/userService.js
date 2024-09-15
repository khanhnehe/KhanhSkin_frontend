import axios from "../axios";

const loginApiService = (email, password) => {
    return axios.post('/User/sign-in', { email, password });
}

const getAllUser = () => {
    return axios.get ('/User/get-all-users');
}

const createUser = (data)=>{
    return axios.post('/User/create-user', data);
}

const updateUser = (id, data) => {
    return axios.put(`/User/update-user/${id}`, data);
}

const deleteUser = (id) => {
    return axios.delete(`/User/delete-user/${id}`);
}

export { 
    loginApiService,
    getAllUser,
    createUser,
    updateUser,
    deleteUser

 };
