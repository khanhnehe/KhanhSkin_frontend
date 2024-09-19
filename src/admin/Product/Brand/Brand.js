import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBrand, createNewBrand, updatedBrand, deletedBrand } from '../../../store/action/adminThunks';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { IoMdAdd } from "react-icons/io";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import './Brand.scss';
import Fab from '@mui/material/Fab';
import { IoIosRemoveCircle } from "react-icons/io";
import { Badge, IconButton } from '@mui/material';

const Brand = () => {
    const dispatch = useDispatch();
    const allBrands = useSelector((state) => state.root.admin.allBrand);

    const [newBrand, setNewBrand] = useState({
        brandName: '',
        imageFile: null
    });

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    const handleOpen = () => {
        setEditMode(false);
        setNewBrand({
            brandName: '',
            imageFile: null
        });
        setImagePreview(null);
        setCurrentImage(null);
        setOpen(true);
    };

    const handleEditOpen = (brand) => {
        setEditingBrand(brand);
        setNewBrand({
            brandName: brand.brandName,
            imageFile: null
        });
        setEditMode(true);
        setImagePreview(null);
        setCurrentImage(brand.image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewBrand({
            brandName: '',
            imageFile: null
        });
        setImagePreview(null);
        setCurrentImage(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBrand({
            ...newBrand,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewBrand({ ...newBrand, imageFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('BrandName', newBrand.brandName);
        if (newBrand.imageFile) {
            formData.append('ImageFile', newBrand.imageFile);
        }

        dispatch(createNewBrand(formData)).then(() => {
            setNewBrand({
                brandName: '',
                imageFile: null
            });
            handleClose();
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('BrandName', newBrand.brandName);
        if (newBrand.imageFile) {
            formData.append('ImageFile', newBrand.imageFile);
        } else if (newBrand.image === null) {
            formData.append('ImageFile', null);
        }

        const brandPayload = {
            id: editingBrand.id,
            data: formData
        };

        dispatch(updatedBrand(brandPayload)).then(() => {
            handleClose();
        });
    };

    const handleDeleteOpen = (brand) => {
        setBrandToDelete(brand);
        setConfirmOpen(true);
    };

    const handleDeleteClose = () => {
        setConfirmOpen(false);
        setBrandToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (brandToDelete) {
            dispatch(deletedBrand(brandToDelete.id)).then(() => {
                setConfirmOpen(false);
                setBrandToDelete(null);
            });
        }
    };

    useEffect(() => {
        dispatch(fetchAllBrand());
    }, [dispatch]);

    return (
        <>
            <div className="manager-brand">
                <span className='top'></span>
                <div className='bot'>
                    <div className='bot-btn mb-4'>
                        <Button variant="contained" className="custom-button" endIcon={<IoMdAdd />} onClick={handleOpen}>
                            Thêm thương hiệu
                        </Button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên thương hiệu</th>
                                <th>Logo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(allBrands) && allBrands.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.brandName}</td>
                                    <td>
                                        {brand.image && (
                                            <img
                                                src={brand.image}
                                                style={{ marginLeft: '10px', width: '55px', height: '55px', borderRadius: '50%' }}
                                                alt="Brand Logo"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <Fab
                                            size="small"
                                            className="edit-button"
                                            style={{ marginRight: '8px' }}
                                            variant="extended"
                                            onClick={() => handleEditOpen(brand)}
                                        >
                                            <EditIcon style={{ fontSize: '20px' }} /> Sửa
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="delete-button"
                                            variant="extended"
                                            onClick={() => handleDeleteOpen(brand)}
                                        >
                                            <DeleteIcon style={{ fontSize: '20px' }} /> Xóa
                                        </Fab>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    className="modal-box"
                    sx={{
                        p: 4,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        width: '80%',
                        maxWidth: '500px',
                        margin: 'auto',
                        mt: '5%',
                        borderRadius: '10px'
                    }}
                >
                    <h4 className="modal-title mb-3 ">{editMode ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu'}</h4>
                    <form onSubmit={editMode ? handleUpdateSubmit : handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tên thương hiệu"
                                    name="brandName"
                                    value={newBrand.brandName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="upload-image">
                                    <Button variant="outlined" size='small' component="span" fullWidth>
                                        Chọn logo thương hiệu
                                    </Button>
                                </label>

                                {editMode && editingBrand && editingBrand.image && !imagePreview && (
                                    <div className='mt-3'>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setNewBrand({ ...newBrand, imageFile: null, image: null });
                                                        setEditingBrand({ ...editingBrand, image: null });
                                                    }}
                                                >
                                                    <IoIosRemoveCircle />
                                                </IconButton>
                                            }
                                        >
                                            <img
                                                src={editingBrand.image}
                                                style={{ width: '55px', height: '55px', borderRadius: '50%' }}
                                            />
                                        </Badge>
                                    </div>
                                )}

                                {imagePreview && (
                                    <div className='mt-4'>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setNewBrand({ ...newBrand, imageFile: null, image: null });
                                                        setImagePreview(null);
                                                    }}
                                                >
                                                    <IoIosRemoveCircle />
                                                </IconButton>
                                            }
                                        >
                                            <img
                                                src={imagePreview}
                                                style={{ width: '55px', height: '55px', borderRadius: '50%' }}
                                            />
                                        </Badge>
                                    </div>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    className="custom-button"
                                >
                                    {editMode ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            <Modal
                open={confirmOpen}
                onClose={handleDeleteClose}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box
                    className="modal-box"
                    sx={{
                        p: 4,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        width: '400px',
                        margin: 'auto',
                        mt: '10%',
                        borderRadius: '10px'
                    }}
                >
                    <h4 className="modal-title mb-3 ">Xác nhận xóa</h4>
                    <p>Bạn có chắc chắn muốn xóa thương hiệu này không?</p>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleDeleteClose}
                            >
                                Hủy
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                onClick={handleDeleteConfirm}
                            >
                                Xóa
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
};

export default Brand;