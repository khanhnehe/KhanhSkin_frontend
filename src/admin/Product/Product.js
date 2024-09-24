import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProduct } from '../../store/action/adminThunks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPaginate from 'react-paginate';
import './Product.scss';
import { Badge } from '@mui/material';
import { IoIosRemoveCircle } from "react-icons/io";
import Fab from '@mui/material/Fab';
import CreateProduct from './CreateProduct';

const Product = () => {
    const dispatch = useDispatch();
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

    return (
        <div className="manager-product">
            <div className='top'>
                <CreateProduct />
            </div>
            <div className='bot'>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Doanh số</TableCell>
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
                                                    style={{ width: '50px', height: '55px', marginRight: '10px' }}
                                                    alt="Product"
                                                />
                                            )}
                                            <div>{product.productName}</div>

                                        </div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                {variant.imageUrl} {variant.nameVariant}
                                            </div>
                                        ))}

                                    </TableCell>
                                    <TableCell>
                                        <div>{product.purchases}</div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">&nbsp;</div>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        <div>{product.sku}</div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">{variant.skuVariant}</div>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        <div>{product.price.toLocaleString()} đ</div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                {variant.priceVariant.toLocaleString()} đ
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        <div>{product.quantity}</div>
                                        {product.variants && product.variants.map((variant, index) => (
                                            <div key={variant.id} className="variant-row">
                                                {variant.quantityVariant}
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
                                        // onClick={() => handleEditOpen(brand)}
                                        >
                                            <EditIcon style={{ fontSize: '18px' }} /> Sửa
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="delete-button"
                                            variant="extended"
                                        // onClick={() => handleDeleteOpen(brand)}
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