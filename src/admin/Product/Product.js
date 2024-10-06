import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProduct, deletedProduct } from '../../store/action/adminThunks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPaginate from 'react-paginate';
import './Product.scss';
import { Badge } from '@mui/material';
import { IoIosRemoveCircle } from "react-icons/io";
import Fab from '@mui/material/Fab';
import CreateProduct from './CreateProduct';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const Product = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allProducts = useSelector((state) => state.root.admin.allProduct);

    useEffect(() => {
        dispatch(fetchAllProduct());
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(0);
    const [productPerPage] = useState(5);

    const indexOfLastProduct = (currentPage + 1) * productPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleDelete = (productId) => {
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
                dispatch(deletedProduct(productId));
            }
        });
    };
    const handleAddProductClick = () => {
        navigate('/admin/create-product');
    };

    const handleEdit = (product) => {
        navigate(`/admin/update-product/${product.id}`, { state: { product } });
    };

    return (
        <div className="manager-product">
            <div className='top'>
                <Button
                    variant="contained"
                    className="custom-button"
                    endIcon={<IoMdAdd />}
                    onClick={handleAddProductClick}
                >
                    Thêm sản phẩm
                </Button>
            </div>
            <div className='bot'>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Kho hàng</TableCell>
                                <TableCell>Thương hiệu</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Phân loại</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentProducts.map((product) => (
                                <TableRow key={product.id} className="product-row">
                                    <TableCell>
                                        <div className='product-top'>
                                            {product.images && (
                                                <img
                                                    src={product.images[0]}
                                                    style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                    alt="Product"
                                                />
                                            )}
                                            <div className='productName'>{product.productName}</div>

                                        </div>

                                        {/* VARINATS */}
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="row">
                                                <div className="col">
                                                    <img src={variant.imageUrl} alt={variant.nameVariant} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />

                                                </div>
                                                <div className='col' >{variant.nameVariant}</div>
                                            </div>
                                        ))}

                                    </TableCell>


                                    <TableCell>
                                        <div>{product.sku}</div>

                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                <div className="col">
                                                    <div style={{ width: '40px', height: '18px', objectFit: 'cover' }} />

                                                </div>
                                                <div className='col' >{variant.skuVariant}</div>
                                            </div>
                                        ))}


                                    </TableCell>

                                    <TableCell>
                                        <div>{product.price.toLocaleString()} đ</div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                <div className="col">
                                                    <div style={{ width: '40px', height: '18px', objectFit: 'cover' }} />

                                                </div>
                                                <div className='col'>{variant.priceVariant.toLocaleString()} đ</div>
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        <div>{product.quantity}</div>
                                         {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                <div className="col">
                                                    <div style={{ width: '40px', height: '18px', objectFit: 'cover' }} />

                                                </div>
                                                <div className='col'>{variant.quantityVariant}</div>
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell>{product.brand.brandName}</TableCell>
                                    <TableCell>{product.categories.map(cat => cat.categoryName).join(', ')}</TableCell>
                                    <TableCell>{product.productTypes.map(type => type.typeName).join(', ')}</TableCell>
                                    <TableCell className='button-custom'>
                                        <Fab
                                            size="small"
                                            className="edit-button"
                                            style={{ marginRight: '8px' }}
                                            variant="extended"
                                            onClick={() => handleEdit(product)}                                        >
                                            <EditIcon style={{ fontSize: '18px' }} /> Sửa
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="delete-button"
                                            variant="extended"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <DeleteIcon style={{ fontSize: '18px' }} /> Xóa
                                        </Fab>


                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(allProducts.length / productPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
};

export default Product;