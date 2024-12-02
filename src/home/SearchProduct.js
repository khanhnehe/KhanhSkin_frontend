import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../store/action/userThunks';
import { NavLink } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import './SearchProduct.scss';
// import '../home/main/CategoryPage/CategoryPage.scss';

const SearchProduct = () => {
    const dispatch = useDispatch();
    const searchProducts = useSelector((state) => state.root.user.searchProduct);

    return (
        <div className='container'>
            <div className='grid-product'>
                {searchProducts && searchProducts.length > 0 ? (
                    searchProducts.map(product => (
                        <NavLink to={`/product/${product.id}`} key={product.id}>
                            <div className='custom-item'>
                                <div className="image-container">
                                    <div className='discount'>-{product.discount}%</div>
                                    <img src={product.images[0]} className="product-image" alt="Product" />
                                    <img src={product.images[1]} className="product-image hover-image" alt="Product" />
                                </div>
                                <div className='bottom'>
                                    <div className="product-name">{product.productName}</div>
                                    <div className='price'>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                    <div className='sale'>{product.salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                    <div className='bottom-two'>
                                        <div className="rating">
                                            <Rating
                                                name={`rating-${product.id}`}
                                                value={product.averageRating || 0} // Ensure rating exists
                                                precision={0.5}
                                                readOnly
                                            />
                                        </div>                                                        <div className='purchases'>{product.purchases} Đã bán </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))
                ) : (
                    <div>Không có sản phẩm nào</div>
                )}
            </div>

        </div>
    );
};

export default SearchProduct;