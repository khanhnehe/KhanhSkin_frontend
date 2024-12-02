import axios from "../axios";

const loginApiService = (email, password) => {
    return axios.post('/api/User/sign-in', { email, password });
}

const getAllUser = () => {
    return axios.get('/api/User/get-all-users');
}

const createUser = (formData) => {
    return axios.post('/api/User/create-user', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const updateUser = (id, data) => {
    return axios.put(`/api/User/update-user/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteUser = (id) => {
    return axios.delete(`/api/User/delete-user/${id}`);
}

export const getUserId = () => {
    return axios.get('/api/User/get-user-by-id');
};

export const createAddress = (data) => {
    return axios.post('/api/Address/create-address', data);
};

export const updateAddress = (id, data) => {
    return axios.put(`/api/Address/update-address/${id}`, data);
};

export const deleteAddress = (id) => {
    return axios.delete(`/api/Address/delete-address/${id}`);
};

export const getAddressId = () => {
    return axios.get('/api/Address/get-my-address');
};


export const getOrdersByUser = (input) => {
    return axios.post('/api/Order/get-orders-by-user-status', input);
};


export const changeStatus = (input) => {
    return axios.post('/api/Order/change-status', input);
};

export const createReview = (input) => {
    return axios.post('/api/Review/create-reviews', input);
};

export const getReviewProduct = (input) => {
    return axios.post('/api/Review/get-review-product', input);
};



export const getRecommendations = (productId) => {
    return axios.get(`/api/Product/${productId}/recommendations`);
};


export const getVoucherActive = () => {
    return axios.get(`/api/Voucher/get-active-vouchers`);
};

export const changePassword = (input) => {
    return axios.post('/api/User/change-password', input);
};



export const searchProduct = (keyword) => {
    return axios.get(`api/Product/search-product`, {
      params: { keyword },
    });
  };

  export const toggleFavorite = (input) => {
    return axios.post('/api/Product/toggle-favorite', input);
};
  
  export const userFavorites = () => {
    return axios.get(`/api/Product/user-favorites`);
  };
  

  export const register = (input) => {
    return axios.post('/api/User/register-user', input);
};


export const conditionVoucher = (id) => {
    return axios.get(`/api/Voucher/get-voucher/${id}`);
};


export const updateUserById = (formData) => {
    return axios.put('/api/User/update-user', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export { 
    loginApiService,
    getAllUser,
    createUser,
    updateUser,
    deleteUser
};
