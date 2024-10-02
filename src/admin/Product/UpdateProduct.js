import React, { useState, useEffect } from 'react';
import {
    TextField, Box, Button, Grid, Select, MenuItem, InputLabel, FormControl, Badge, Paper, IconButton
} from '@mui/material';
import { TiDelete } from "react-icons/ti";
import { FcAddImage, FcPlus } from "react-icons/fc";
import { VscDiffRemoved } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { updatedProduct, fetchAllBrand, fetchAllCategory, fetchAllType } from '../../store/action/adminThunks';
import "./Updateproduct.scss";

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Nhận product từ react-router state

    const productFromState = location.state?.product;

    const allTypes = useSelector((state) => state.root.admin.allType);
    const allCategories = useSelector((state) => state.root.admin.allCategory);
    const allBrands = useSelector((state) => state.root.admin.allBrand);

    const [imagePreview, setImagePreview] = useState(productFromState?.images || []);
    const [newProduct, setProduct] = useState({
        id: productFromState?.id || '',
        productName: productFromState?.productName || '',
        description: productFromState?.description || '',
        price: productFromState?.price || 0,
        quantity: productFromState?.quantity || 0,
        discount: productFromState?.discount || 0,
        salePrice: productFromState?.salePrice || 0,
        sku: productFromState?.sku || '',
        brandId: productFromState?.brandId || '',
        categoryIds: productFromState?.categories.map(cat => cat.id) || [],
        productTypeIds: productFromState?.productTypes.map(type => type.id) || [],
        images: productFromState?.images || [],
        variants: productFromState?.variants || []
    });

    useEffect(() => {
        dispatch(fetchAllCategory());
        dispatch(fetchAllType());
        dispatch(fetchAllBrand());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...newProduct, [name]: value });
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'zxis1bvp');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dxipaqfep/image/upload',
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
        }
    };

    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        const uploadedUrls = [];
        const newPreviews = [];

        for (let file of newFiles) {
            const url = await uploadToCloudinary(file);
            if (url) {
                uploadedUrls.push(url);
                newPreviews.push(url);
            }
        }

        setProduct(prevProduct => ({
            ...prevProduct,
            images: [...prevProduct.images, ...uploadedUrls]
        }));
        setImagePreview(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...newProduct.images];
        newImages.splice(index, 1);
        setProduct({ ...newProduct, images: newImages });

        const newPreviews = [...imagePreview];
        newPreviews.splice(index, 1);
        setImagePreview(newPreviews);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...newProduct.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setProduct({ ...newProduct, variants: newVariants });
    };

    const handleVariantImageChange = async (index, file) => {
        const url = await uploadToCloudinary(file);
        if (url) {
            const newVariants = [...newProduct.variants];
            newVariants[index] = { ...newVariants[index], imageUrl: url };
            setProduct({ ...newProduct, variants: newVariants });
        }
    };

    const removeVariantImage = (index) => {
        const newVariants = [...newProduct.variants];
        newVariants[index] = { ...newVariants[index], imageUrl: null };
        setProduct({ ...newProduct, variants: newVariants });
    };

    const addVariant = () => {
        setProduct({
            ...newProduct,
            variants: [...newProduct.variants, {
                nameVariant: '',
                priceVariant: 0,
                quantityVariant: 0,
                discountVariant: 0,
                salePriceVariant: 0,
                skuVariant: '',
                imageUrl: null
            }]
        });
    };

    const removeVariant = (index) => {
        const newVariants = newProduct.variants.filter((_, i) => i !== index);
        setProduct({ ...newProduct, variants: newVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updatedProduct({ id: newProduct.id, data: newProduct }));
            navigate('/admin/manage-product');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <>
            <div className='product'>
                <div className='update-product-container'>
                    <div className='top'>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="productName"
                                        label="Tên sản phẩm"
                                        value={newProduct.productName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="brand-label">Thương hiệu</InputLabel>
                                        <Select
                                            labelId="brand-label"
                                            name="brandId"
                                            value={newProduct.brandId}
                                            onChange={handleInputChange}
                                            required
                                            label="Thương hiệu"

                                        >
                                            {allBrands.map((brand) => (
                                                <MenuItem key={brand.id} value={brand.id}>
                                                    {brand.brandName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-label">Danh mục</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            multiple
                                            name="categoryIds"
                                            value={newProduct.categoryIds}
                                            onChange={handleInputChange}
                                            required
                                            label="Danh mục"

                                        >
                                            {allCategories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="productType-label">Phân loại sản phẩm</InputLabel>
                                        <Select
                                            labelId="productType-label"
                                            multiple
                                            name="productTypeIds"
                                            value={newProduct.productTypeIds}
                                            onChange={handleInputChange}
                                            required
                                            label="Phân loại sản phẩm"

                                        >
                                            {allTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.typeName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="price"
                                        label="Giá sản phẩm"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        type="number"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="quantity"
                                        label="Số lượng"
                                        value={newProduct.quantity}
                                        onChange={handleInputChange}
                                        type="number"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="discount"
                                        label="Giảm giá (%)"
                                        value={newProduct.discount}
                                        onChange={handleInputChange}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="salePrice"
                                        label="Giá sau khi giảm"
                                        value={newProduct.salePrice}
                                        onChange={handleInputChange}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ReactQuill
                                        value={newProduct.description}
                                        onChange={(value) => handleInputChange({ target: { name: 'description', value } })}
                                        placeholder="Mô tả sản phẩm"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="upload-images"
                                        multiple
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="upload-images">
                                        <Button variant="outlined" component="span" fullWidth>
                                            <FcAddImage /> &nbsp; Thêm ảnh
                                        </Button>
                                    </label>
                                    {imagePreview.length > 0 && (
                                        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                                            {imagePreview.map((preview, index) => (
                                                <Badge
                                                    key={index}
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                    badgeContent={
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <TiDelete />
                                                        </IconButton>
                                                    }
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                </Badge>
                                            ))}
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    {newProduct.variants.map((variant, index) => (
                                        <Paper elevation={3} sx={{ p: 2, mb: 2 }} key={index}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Tên phân loại"
                                                        value={variant.nameVariant}
                                                        onChange={(e) => handleVariantChange(index, 'nameVariant', e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Giá"
                                                        value={variant.priceVariant}
                                                        onChange={(e) => handleVariantChange(index, 'priceVariant', e.target.value)}
                                                        type="number"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Số lượng"
                                                        value={variant.quantityVariant}
                                                        onChange={(e) => handleVariantChange(index, 'quantityVariant', e.target.value)}
                                                        type="number"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Giảm giá"
                                                        value={variant.discountVariant}
                                                        onChange={(e) => handleVariantChange(index, 'discountVariant', e.target.value)}
                                                        type="number"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <input
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        id={`upload-variant-image-${index}`}
                                                        type="file"
                                                        onChange={(e) => handleVariantImageChange(index, e.target.files[0])}
                                                    />
                                                    <label htmlFor={`upload-variant-image-${index}`}>
                                                        <Button variant="outlined" component="span" fullWidth>
                                                            <FcAddImage /> &nbsp; Thêm ảnh
                                                        </Button>
                                                    </label>
                                                    {variant.imageUrl && (
                                                        <Box mt={1}>
                                                            <Badge
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                                badgeContent={
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => removeVariantImage(index)}
                                                                    >
                                                                        <TiDelete />
                                                                    </IconButton>
                                                                }
                                                            >
                                                                <img
                                                                    src={variant.imageUrl}
                                                                    alt={`Variant ${index + 1}`}
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </Badge>
                                                        </Box>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} sm={1}>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeVariant(index)}
                                                    >
                                                        <VscDiffRemoved />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    ))}
                                    <Button variant="outlined" onClick={addVariant} fullWidth>
                                        <FcPlus /> &nbsp; Thêm phân loại hàng
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" fullWidth>
                                        Cập nhật sản phẩm
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>

                </div>
            </div>
        </>


    );
};

export default UpdateProduct;
