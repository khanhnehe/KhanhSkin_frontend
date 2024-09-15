import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUser, createNewUser, updatedUser, deletedUser } from '../../store/action/adminThunks'; // Import hành động tạo mới và cập nhật người dùng
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { IoPersonAdd } from "react-icons/io5";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'; 
import './ManagerUser.scss';
import Fab from '@mui/material/Fab';

const ManagerUser = () => {
    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.root.admin.allUser); 

    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        image: '',
        role: 1
    });

    const [open, setOpen] = useState(false); // mở/đóng 
    const [editMode, setEditMode] = useState(false); //edit mode
    const [editingUser, setEditingUser] = useState(null); 
    const [confirmOpen, setConfirmOpen] = useState(false); // modal xác nhận
    const [userToDelete, setUserToDelete] = useState(null); 


    //mở modal add
    const handleOpen = () => {
        setEditMode(false); // Chuyển sang chế độ add
        setNewUser({
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            image: '',
            role: 1
        });
        setOpen(true); // Mở modal
    };

    // Mở modal và điền data input edit
    const handleEditOpen = (user) => {
        setEditingUser(user); // Lưu trữ info user để sửa
        setNewUser({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: '........', 
            image: user.image,
            role: user.role
        });
        setEditMode(true); // Chuyển sang sửa
        setOpen(true); 
    };

    // Đóng modal
    const handleClose = () => {
        setOpen(false);
        setNewUser({
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            image: '',
            role: 1
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: name === 'role' ? parseInt(value, 10) : value
        });
    };

    // add new user
    const handleSubmit = (e) => {
        e.preventDefault();
        const userPayload = {
            ...newUser,
            role: parseInt(newUser.role, 10) // chuyển thành int
        };
        dispatch(createNewUser(userPayload)).then(() => {
            setNewUser({
                fullName: '',
                email: '',
                phoneNumber: '',
                password: '',
                image: '',
                role: 1
            });
            handleClose();
        });
    };

    //update user
    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const userPayload = {
            id: editingUser.id, // Gán id user 
            data: {
                ...newUser,
                role: parseInt(newUser.role, 10) 
            }
        };
        dispatch(updatedUser(userPayload)).then(() => {
            handleClose(); 
        });
    };

    //delete user

    const handleDeleteOpen = (user) => {
        setUserToDelete(user);
        setConfirmOpen(true);
        console.log('handleDeleteOpen ', user); // Di chuyển console.log vào đây

    };

    const handleDeleteClose = () => {
        setConfirmOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            dispatch(deletedUser(userToDelete.id)).then(() => {
                setConfirmOpen(false);
                setUserToDelete(null);
            });
        }
    };


    useEffect(() => {
        dispatch(fetchAllUser());
    }, [dispatch]);

    return (
        <>
            <div className="manager-user">
                <span className='top'></span>
                <div className='bot'>
                    <div className='bot-btn mb-3'>
                        <Button variant="contained" className="custom-button" endIcon={<IoPersonAdd />} onClick={handleOpen}>
                            Thêm người dùng
                        </Button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Ảnh đại diện</th>
                                <th>Quyền</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(allUsers) && allUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td><img src={user.image} width="50" /></td>
                                    <td>{user.role === 1 ? 'User' : 'Admin'}</td>                                        <td>
                                        <Fab
                                            size="small"
                                            className="edit-button"
                                            style={{ marginRight: '8px' }}
                                            variant="extended"
                                            onClick={() => handleEditOpen(user)} // Mở modal sửa
                                        >
                                            <EditIcon style={{ fontSize: '20px' }}/> Sửa
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="delete-button"
                                            variant="extended"
                                            onClick={() => handleDeleteOpen(user)}
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
                open={open} // Điều khiển mở modal
                onClose={handleClose} // Đóng modal
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
                        mt: '10%',
                        borderRadius: '10px'
                    }}
                >
                    {/* Tiêu đề Modal thay đổi theo trạng thái thêm/sửa */}
                    <h4 className="modal-title mb-3 ">{editMode ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h4>
                    <form onSubmit={editMode ? handleUpdateSubmit : handleSubmit}> {/* Form điều khiển thêm/sửa */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="fullName"
                                    value={newUser.fullName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={newUser.phoneNumber}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mật khẩu"
                                    name="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required // Mật khẩu bắt buộc khi thêm, không cần khi sửa
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Quyền"
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                    required
                                >
                                    <option value={1}>User</option>
                                    <option value={2}>Admin</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="URL ảnh đại diện"
                                    name="image"
                                    value={newUser.image}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" className="custom-button">
                                    {editMode ? 'Cập nhật' : 'Lưu'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
            <Modal
            open={confirmOpen}
            onClose={handleDeleteClose}
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
        >
            <Box
                sx={{
                    p: 4,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    width: '80%',
                    maxWidth: '400px',
                    margin: 'auto',
                    mt: '20%',
                    borderRadius: '10px'
                }}
            >
                <h5 id="delete-confirmation-title">Bạn chắc chắn muốn xóa người dùng này chứ?</h5>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{ marginRight: 2 }}
                    >
                        Đồng ý
                    </Button>
                    <Button
                        onClick={handleDeleteClose}
                        variant="contained"
                        color="success"
                    >
                        Hủy bỏ
                    </Button>
                </Box>
            </Box>
        </Modal>
        </>
    );
}

export default ManagerUser;