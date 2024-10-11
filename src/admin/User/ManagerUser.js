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
import { IoIosRemoveCircle } from "react-icons/io";
import { Badge, IconButton } from '@mui/material';

const ManagerUser = () => {
    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.root.admin.allUser);

    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        imageFile: null,
        role: 1
    });

    const [open, setOpen] = useState(false); // mở/đóng 
    const [editMode, setEditMode] = useState(false); //edit mode
    const [editingUser, setEditingUser] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false); // modal xác nhận
    const [userToDelete, setUserToDelete] = useState(null);

    const [imagePreview, setImagePreview] = useState(null); // Biến trạng thái để lưu trữ URL của ảnh đã chọn
    const [currentImage, setCurrentImage] = useState(null); // Trạng thái để lưu trữ URL của ảnh hiện tại khi sửa


    //mở modal add
    const handleOpen = () => {
        setEditMode(false); // Chuyển sang chế độ add
        setNewUser({
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            imageFile: null,
            role: 1
        });
        setImagePreview(null);
        setCurrentImage(null); // Xóa hình hiện tại khi thêm mới
        setOpen(true); // Mở modal
    };

    // Mở modal và điền data input edit
    const handleEditOpen = (user) => {
        setEditingUser(user); // Lưu trữ info user để sửa
        setNewUser({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: '......',
            imageFile: null, // Đặt lại imageFile vì sẽ cập nhật mới nếu người dùng chọn
            role: user.role
        });
        setEditMode(true); // Chuyển sang sửa
        setImagePreview(null);
        setCurrentImage(user.image); // Hiển thị ảnh hiện tại khi sửa
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
            imageFile: null,
            role: 1
        });
        setImagePreview(null);
        setCurrentImage(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: name === 'role' ? parseInt(value, 10) : value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewUser({ ...newUser, imageFile: file });
            setImagePreview(URL.createObjectURL(file)); // Cập nhật URL của ảnh đã chọn
        }
    };

    // add new user
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('FullName', newUser.fullName);
        formData.append('Email', newUser.email);
        formData.append('PhoneNumber', newUser.phoneNumber);
        formData.append('Password', newUser.password);
        formData.append('Role', parseInt(newUser.role, 10));
        if (newUser.imageFile) {
            formData.append('ImageFile', newUser.imageFile);
        }

        dispatch(createNewUser(formData)).then(() => {
            setNewUser({
                fullName: '',
                email: '',
                phoneNumber: '',
                password: '',
                imageFile: null,
                role: 1
            });
            handleClose();
        });
    };

    //update user
    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('FullName', newUser.fullName);
        formData.append('Email', newUser.email);
        formData.append('PhoneNumber', newUser.phoneNumber);
        formData.append('Password', newUser.password);
        formData.append('Role', parseInt(newUser.role, 10));
        if (newUser.imageFile) {
            formData.append('ImageFile', newUser.imageFile);
        } else if (newUser.image === null) {
            formData.append('ImageFile', null); // Đặt ImageFile thành null nếu không có ảnh
        }

        const userPayload = {
            id: editingUser.id, // Gán id user 
            data: formData
        };

        dispatch(updatedUser(userPayload)).then(() => {
            handleClose();
        });
    };

    //delete user
    const handleDeleteOpen = (user) => {
        setUserToDelete(user);
        setConfirmOpen(true);
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
                <h4 style={{color: "#c7313f"}}>NGƯỜI DÙNG</h4>
                <div className='bot mt-2'>
                    <div className='bot-btn mb-4'>
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
                                    <td>
                                        {user.image && (
                                            <img
                                                src={user.image}
                                                style={{ marginLeft: '10px', width: '55px', height: '55px', borderRadius: '50%' }}
                                                alt="User Avatar"
                                            />
                                        )}
                                    </td>
                                    <td>{user.role === 1 ? 'User' : 'Admin'}</td>
                                    <td>
                                        <Fab
                                            size="small"
                                            className="edit-button"
                                            style={{ marginRight: '8px' }}
                                            variant="extended"
                                            onClick={() => handleEditOpen(user)} // Mở modal sửa
                                        >
                                            <EditIcon style={{ fontSize: '20px' }} /> Sửa
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
                        mt: '5%',
                        borderRadius: '10px'
                    }}
                >
                    <h4 className="modal-title mb-3 ">{editMode ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h4>
                    <form onSubmit={editMode ? handleUpdateSubmit : handleSubmit}>
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
                                    type="email"
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
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
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
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="upload-image">
                                    <Button variant="outlined" size='small' component="span" fullWidth>
                                        Chọn ảnh đại diện
                                    </Button>
                                </label>

                                {/* Hiển thị ảnh đại diện hiện tại khi đang chỉnh sửa */}
                                {editMode && editingUser && editingUser.image && !imagePreview && (
                                    <div className='mt-3'>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setNewUser({ ...newUser, imageFile: null, image: null });
                                                        setEditingUser({ ...editingUser, image: null });
                                                    }}

                                                >
                                                    <IoIosRemoveCircle />
                                                </IconButton>
                                            }
                                        >
                                            <img
                                                src={editingUser.image}
                                                style={{ width: '55px', height: '55px', borderRadius: '50%' }}
                                            />
                                        </Badge>
                                    </div>
                                )}

                                {/* Hiển thị ảnh xem trước khi chọn ảnh mới */}
                                {imagePreview && (
                                    <div className='mt-4'>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={
                                                <IconButton
                                                    color="error"

                                                    onClick={() => {
                                                        setNewUser({ ...newUser, imageFile: null, image: null });
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

            {/* Modal xác nhận xóa */}
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
                    <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
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

export default ManagerUser;
