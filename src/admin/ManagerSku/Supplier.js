import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPageSupplier, deletedSupplier, createdSupplier } from '../../store/action/adminThunks';
import { IoMdAdd } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import './Supplier.scss';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Supplier = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allSupplier = useSelector((state) => state.root.admin.allSupplier);
    const totalRecor = useSelector((state) => state.root.admin.totalRecord);
    const [supplierPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(0);
    const [textSearch, setTextSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [supplierName, setSupplierName] = useState('');
    const [phoneSupplier, setPhoneSupplier] = useState('');
    const [addresSuppliers, setaddresSuppliers] = useState('');
    const [emailSupplier, setEmailSupplier] = useState('');

    const handleAddSupplier = () => {
        if (supplierName && phoneSupplier && addresSuppliers && emailSupplier) {
            const newSupplier = {
                supplierName,
                phoneSupplier,
                addresSuppliers,
                emailSupplier,
            };
            dispatch(createdSupplier(newSupplier)).then(() => fetchSupplier()); // Refetch after adding supplier
            handleCloseModal();
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const searchParams = useMemo(() => ({
        freeTextSearch: textSearch,
        pageIndex: currentPage + 1,
        pageSize: supplierPage,
        isAscending: true,
    }), [textSearch, currentPage, supplierPage]);

    const fetchSupplier = () => {
        dispatch(getPageSupplier(searchParams));
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const supplierPageChange = (event) => {
        setTextSearch(event.target.value);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý, xóa!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deletedSupplier(id)).then(() => fetchSupplier()); // Refetch after deleting supplier
            }
        });
    };

    useEffect(() => {
        fetchSupplier();
    }, [currentPage, textSearch]); // Only run fetch when currentPage or textSearch changes

    return (
        <div className='supplier'>
            <h3 className='text-danger'>Nhà phân phối</h3>
            <div className='top'>
                <TextField className='col-7'
                    label="Tìm kiếm nhà phân phối"
                    variant="outlined"
                    value={textSearch}
                    onChange={supplierPageChange}
                    style={{ marginRight: '10px' }}
                />

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#b22b38',
                        }
                    }}
                    endIcon={<IoMdAdd />}
                    onClick={handleOpenModal}
                >
                    Thêm nhà phân phối
                </Button>
            </div>
            <div className='bot'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" className='border'>
                        <TableHead className='bg-secondary-subtle'>
                            <TableRow>
                                <TableCell>Tên nhà phân phối</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allSupplier && allSupplier.length > 0 ? (
                                allSupplier.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>{supplier.supplierName}</TableCell>
                                        <TableCell>{supplier.phoneSupplier}</TableCell>
                                        <TableCell>{supplier.addresSuppliers}</TableCell>
                                        <TableCell>{supplier.emailSupplier}</TableCell>
                                        <TableCell className='button-custom'>
                                            <Fab
                                                size="small"
                                                className="edit-button"
                                                style={{ marginRight: '8px' }}
                                                variant="extended"
                                            >
                                                <EditIcon style={{ fontSize: '18px' }} /> Sửa
                                            </Fab>
                                            <Fab
                                                size="small"
                                                className="delete-button"
                                                variant="extended"
                                                onClick={() => handleDelete(supplier.id)}
                                            >
                                                <DeleteIcon style={{ fontSize: '18px' }} /> Xóa
                                            </Fab>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Không có nhà phân phối nào</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalRecor / supplierPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
            <Modal
                open={openModal}
                onClose={handleCloseModal}
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
                    <h4 className="modal-title mb-3 ">Thêm nhà phân phối</h4>
                    <TextField
                        label="Tên nhà phân phối"
                        variant="outlined"
                        fullWidth
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Số điện thoại"
                        variant="outlined"
                        fullWidth
                        value={phoneSupplier}
                        onChange={(e) => setPhoneSupplier(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Địa chỉ"
                        variant="outlined"
                        fullWidth
                        value={addresSuppliers}
                        onChange={(e) => setaddresSuppliers(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={emailSupplier}
                        onChange={(e) => setEmailSupplier(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddSupplier}
                    >
                        Thêm nhà phân phối
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Supplier;
