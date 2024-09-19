import axios from "../axios";

const createBrand = (formData) => {
    return axios.post('/api/Brand/create-brand', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getAllBrand = () => {
    return axios.get ('/api/Brand/get-all-brand');
}


const updateBrand = (id, formData) => {
    return axios.put(`/api/Brand/update-brand/${id}`, formData,{
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
    return axios.get ('/api/Category/get-all-category');
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
    return axios.get ('/api/TypeProduct/get-all-productTypes');
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

export { 
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand
   

 };




