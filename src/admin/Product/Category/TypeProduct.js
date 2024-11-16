import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllType, createNewType, updatedType, deletedType } from '../../../store/action/adminThunks';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { IoMdAdd } from "react-icons/io";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import './TypeProduct.scss';
import Fab from '@mui/material/Fab';
import ReactPaginate from 'react-paginate';

const TypeProduct = () => {
    const dispatch = useDispatch();
    const allTypes = useSelector((state) => state.root.admin.allType);

    const [newType, setNewType] = useState({
        typeName: ''
    });

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);

    const handleOpen = () => {
        setEditMode(false);
        setNewType({
            typeName: ''
        });
        setOpen(true);
    };

    const handleEditOpen = (type) => {
        setEditingType(type);
        setNewType({
            typeName: type.typeName
        });
        setEditMode(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewType({
            typeName: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewType({
            ...newType,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewType(newType)).then(() => {
            setNewType({
                typeName: ''
            });
            handleClose();
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const typePayload = {
            id: editingType.id,
            data: newType
        };

        dispatch(updatedType(typePayload)).then(() => {
            handleClose();
        });
    };

    const handleDeleteOpen = (type) => {
        setTypeToDelete(type);
        setConfirmOpen(true);
    };

    const handleDeleteClose = () => {
        setConfirmOpen(false);
        setTypeToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (typeToDelete) {
            dispatch(deletedType(typeToDelete.id)).then(() => {
                setConfirmOpen(false);
                setTypeToDelete(null);
            });
        }
    };

    useEffect(() => {
        dispatch(fetchAllType());
    }, [dispatch]);

     // Thêm state cho phân trang
     const [currentPage, setCurrentPage] = useState(0);
     const [categoriesPerPage] = useState(5); 
 
     // Tính  các ca cho trang hiện tại
     const indexOfLastCategory = (currentPage + 1) * categoriesPerPage;
     const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
     const currentType = allTypes.slice(indexOfFirstCategory, indexOfLastCategory);
 
     const handlePageClick = (event) => {
         setCurrentPage(event.selected);
     };

    return (
        <>
            <div className="manager-type-product">
                <div className='bot-type row'>
                <div className='bot col-8 '>
                    <div className='bot-btn mb-4'>
                        <Button variant="contained" sx={{
        backgroundColor: '#dc3545',
        color: 'white',
        '&:hover': {
            backgroundColor: '#b22b38',
        }
    }} endIcon={<IoMdAdd />} onClick={handleOpen}>
                            Thêm loại sản phẩm
                        </Button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên loại sản phẩm</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(currentType) && currentType.map((type) => (
                                <tr key={type.id}>
                                    <td>{type.typeName}</td>
                                    <td>
                                        <Fab
                                            size="small"
                                            className="edit-button"
                                            style={{ marginRight: '8px' }}
                                            variant="extended"
                                            onClick={() => handleEditOpen(type)}
                                        >
                                            <EditIcon style={{ fontSize: '20px' }} /> Sửa
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="delete-button"
                                            variant="extended"
                                            onClick={() => handleDeleteOpen(type)}
                                        >
                                            <DeleteIcon style={{ fontSize: '20px' }} /> Xóa
                                        </Fab>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(allTypes.length / categoriesPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </div>
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
                    <h4 className="modal-title mb-3 ">{editMode ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm'}</h4>
                    <form onSubmit={editMode ? handleUpdateSubmit : handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tên loại sản phẩm"
                                    name="typeName"
                                    value={newType.typeName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    sx={{
        backgroundColor: '#dc3545',
        color: 'white',
        '&:hover': {
            backgroundColor: '#b22b38',
        }
    }}
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
                    <p>Bạn có chắc chắn muốn xóa loại sản phẩm này không?</p>
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

export default TypeProduct;