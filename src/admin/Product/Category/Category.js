import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategory, fetchAllType, createNewCategory, updatedCategory, deletedCategory } from '../../../store/action/adminThunks';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { IoMdAdd } from "react-icons/io";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import './Category.scss';
import Fab from '@mui/material/Fab';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ReactPaginate from 'react-paginate';
import TypeProduct from './TypeProduct';


const Category = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.root.admin.allCategory);
  const allTypes = useSelector((state) => state.root.admin.allType);

  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    productTypeIds: []
  });

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCategory());
    dispatch(fetchAllType());
  }, [dispatch]);

  const handleOpen = () => {
    setEditMode(false);
    setNewCategory({
      categoryName: '',
      productTypeIds: []
    });
    setOpen(true);
  };

  const handleEditOpen = (category) => {
    setEditingCategory(category);
    setNewCategory({
      categoryName: category.categoryName,
      productTypeIds: category.productTypes.map(type => type.id)
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCategory({
      categoryName: '',
      productTypeIds: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  const handleTypeChange = (event) => {
    setNewCategory({
      ...newCategory,
      productTypeIds: event.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewCategory(newCategory)).then(() => {
      setNewCategory({
        categoryName: '',
        productTypeIds: []
      });
      handleClose();
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const categoryPayload = {
      id: editingCategory.id,
      data: newCategory
    };

    dispatch(updatedCategory(categoryPayload)).then(() => {
      handleClose();
    });
  };

  const handleDeleteOpen = (category) => {
    setCategoryToDelete(category);
    setConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      dispatch(deletedCategory(categoryToDelete.id)).then(() => {
        setConfirmOpen(false);
        setCategoryToDelete(null);
      });
    }
  };

  const getProductTypeNames = (productTypes) => {
    return productTypes.map(type => type.typeName).join(', ');
  };

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriesPerPage] = useState(5);

  // Tính  các ca cho trang hiện tại
  const indexOfLastCategory = (currentPage + 1) * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategory = allCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };


  return (
    <>
      <div className="manager-category">
        <h4 style={{ color: "#c7313f" }}>DANH MỤC SẢN PHẨM</h4>
        <div className='top mt-2'>
          <div className='bot-btn mb-4'>
            <Button variant="contained" sx={{
              backgroundColor: '#dc3545',
              color: 'white',
              '&:hover': {
                backgroundColor: '#b22b38',
              }
            }} endIcon={<IoMdAdd />} onClick={handleOpen}>
              Thêm danh mục
            </Button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Loại sản phẩm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentCategory) && currentCategory.map((category) => (
                <tr key={category.id}>
                  <td>{category.categoryName}</td>
                  <td>{getProductTypeNames(category.productTypes)}</td>
                  <td>
                    <Fab
                      size="small"
                      className="edit-button"
                      style={{ marginRight: '8px' }}
                      variant="extended"
                      onClick={() => handleEditOpen(category)}
                    >
                      <EditIcon style={{ fontSize: '20px' }} /> Sửa
                    </Fab>
                    <Fab
                      size="small"
                      className="delete-button"
                      variant="extended"
                      onClick={() => handleDeleteOpen(category)}
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
            pageCount={Math.ceil(allCategories.length / categoriesPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>

        <div className='bot'>
          <h4 style={{ color: "#c7313f" }}>PHÂN LOẠI SẢN PHẨM</h4>
          <TypeProduct />
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
          <h4 className="modal-title mb-3 ">{editMode ? 'Cập nhật danh mục' : 'Thêm danh mục'}</h4>
          <form onSubmit={editMode ? handleUpdateSubmit : handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  name="categoryName"
                  value={newCategory.categoryName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="product-type-label">Loại sản phẩm</InputLabel>
                  <Select
                    labelId="product-type-label"
                    multiple
                    value={newCategory.productTypeIds}
                    onChange={handleTypeChange}
                    label="Loại sản phẩm"
                  >
                    {allTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
          <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
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

export default Category;