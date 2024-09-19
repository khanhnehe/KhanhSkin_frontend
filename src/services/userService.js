import axios from "../axios";

const loginApiService = (email, password) => {
    return axios.post('/api/User/sign-in', { email, password });
}

const getAllUser = () => {
    return axios.get ('/api/User/get-all-users');
}

const createUser = (formData) => {
    return axios.post('/api/User/create-user', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};


const updateUser = (id, data) => {
    return axios.put(`/api/User/update-user/${id}`, data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteUser = (id) => {
    return axios.delete(`/api/User/delete-user/${id}`);
}

export { 
    loginApiService,
    getAllUser,
    createUser,
    updateUser,
    deleteUser

 };
