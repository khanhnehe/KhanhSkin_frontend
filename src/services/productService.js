import axios from "../axios";

const createBrand = (formData) => {
    return axios.post('/api/Brand/create-brand', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getAllBrand = () => {
    return axios.get('/api/Brand/get-all-brand');
}


const updateBrand = (id, formData) => {
    return axios.put(`/api/Brand/update-brand/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteBrand = (id) => {
    return axios.delete(`/api/Brand/delete-brand/${id}`);
}


//categoty
export const getAllCategory = () => {
    return axios.get('/api/Category/get-all-category');
}

export const createCategory = (data) => {
    return axios.post('/api/Category/create-category', data);
};


export const updateCategory = (id, data) => {
    return axios.put(`/api/Category/update-category/${id}`, data)
}

export const deleteCategory = (id) => {
    return axios.delete(`/api/Category/delete-category/${id}`);
}

//type
export const getAllType = () => {
    return axios.get('/api/TypeProduct/get-all-productTypes');
}

export const createType = (data) => {
    return axios.post('/api/TypeProduct/create-productType', data);
};


export const updateType = (id, data) => {
    return axios.put(`/api/TypeProduct/update-productType/${id}`, data)
}

export const deleteType = (id) => {
    return axios.delete(`/api/TypeProduct/delete-productType/${id}`);
}

//product
export const getAllProduct = () => {
    return axios.get('/api/Product/get-all-product');
}

export const createProduct = (data) => {
    return axios.post('/api/Product/create-product', data);
}

export const updateProduct = (id, formData) => {
    return axios.put(`/api/Product/update-product/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteProduct = (id) => {
    return axios.delete(`/api/Product/delete-product/${id}`);
}

export const getFilterProducts = (input) => {
    return axios.get('/api/Product/get-filter-products', {
        params: {
            CategoryIds: input.CategoryIds
        },
        paramsSerializer: params => {
            return params.CategoryIds.map(c => `CategoryIds=${c}`).join('&');
        }
    });
};

export const postFilterProducts = (input) => {
    return axios.post('/api/Product/post-filte-products', input); // Truyền dữ liệu qua body
};

export const getProductByCategory = (categoryId) => {
    return axios.get(`/api/Product/get-by-category/${categoryId}`);
}

export const getProductBrand = (brandId) => {
    return axios.get(`/api/Product/get-by-brand/${brandId}`);
}


export const getProductType = (brandId) => {
    return axios.get(`/api/Product/get-by-producttype/${brandId}`);
}

export const getInfoProduct = (id) => {
    return axios.get(`/api/Product/get-by-Id-product/${id}`);
}



export const addProductToCart = async (input) => {
    return await axios.post('/api/Cart/add-product-to-cart', input);
}

export const getCartByUserId = () => {
    return axios.get('/api/Cart/get-cart-by-user-id');
};

export const deleteCartItem = (cartItemId) => {
    return axios.delete(`/api/Cart/delete/${cartItemId}`);
};

export {
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand


};




