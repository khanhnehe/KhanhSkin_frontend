import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { toggleFavoriteProduct, userFavorite } from '../../../../store/action/userThunks';
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import Rating from '@mui/material/Rating';
import { toast } from 'react-toastify';

import { IoIosStar } from "react-icons/io";
import './../../../SearchProduct.scss'

const FavoriteProduct = () => {
    const dispatch = useDispatch();
    const favorite = useSelector((state) => state.root.user.userFavorite);


    const [isFavorite, setIsFavorite] = useState(false);





    useEffect(() => {
        dispatch(userFavorite());
    }, [dispatch]);


    return (
        <div className='container'>
            <div className='container'>
                <div className='' style={{ display: "flex" }}>
                    <NavLink to='/'>Trang chủ</NavLink> /  
                    <p className='title ms-2 mb-3'>  Sản phẩm yêu thích của bạn</p>
                </div>

                <div className='grid-product'>
                    {favorite && favorite.length > 0 ? (
                        favorite.map(product => (
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

        </div>
    );
};

export default FavoriteProduct;