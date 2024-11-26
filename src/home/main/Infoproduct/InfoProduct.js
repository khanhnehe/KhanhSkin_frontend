import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { getInfoForProduct, addProductCart } from '../../../store/action/adminThunks';
import { getReviewsProduct, getRecommendProduct } from '../../../store/action/userThunks';
import './InfoProduct.scss';
import { toast } from 'react-toastify';
import { GrPrevious, GrNext, GrFormNext } from "react-icons/gr";
import { IoIosStar } from "react-icons/io";
import Rating from '@mui/material/Rating';
import ReactPaginate from 'react-paginate';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const InfoProduct = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const infoProduct = useSelector(state => state.root.admin.infoOfProduct);
    const [currentImage, setCurrentImage] = useState(0);
    const [currentVariant, setCurrentVariant] = useState(null);
    const [start, setStart] = useState(0);
    const [amount, setAmount] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    //review
    const allReview = useSelector((state) => state.root.user.reviewProduct);
    const totalRecor = useSelector((state) => state.root.user.totalRecord);
    const [currentPage, setCurrentPage] = useState(0);
    const productPerPage = 5;


    const recommend = useSelector((state) => state.root.user.productRecommend);

    useEffect(() => {
        dispatch(getInfoForProduct(id));
        dispatch(getRecommendProduct(id));
    }, [dispatch, id]);

    //review
    useEffect(() => {
        dispatch(getReviewsProduct({
            productId: id,
            pageIndex: currentPage + 1,
            pageSize: productPerPage,
            isAscending: true,
            isApproved: true
        }));
    }, [dispatch, id, currentPage]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const decreaseAmount = () => {
        setAmount(prev => Math.max(prev - 1, 1));
    };

    const increaseAmount = () => {
        setAmount(prev => prev + 1);
    };

    const addToCart = async () => {
        if (!infoProduct) return;
        const input = {
            productId: infoProduct.id,
            amountAdd: amount,
            variantId: currentVariant ? currentVariant.id : undefined,
            // Add any additional fields if needed for the cart, like `voucherId`
        };

        try {
            const resultAction = await dispatch(addProductCart(input));
            if (addProductCart.fulfilled.match(resultAction)) {
                toast.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            // Error handling is already done in the thunk
        }
    };

    const images = React.useMemo(() => {
        if (!infoProduct) return [];
        const productImages = infoProduct.images || [];
        const variantImages = infoProduct.variants ? infoProduct.variants.map(v => v.imageUrl).filter(v => v) : [];
        return [...productImages, ...variantImages];
    }, [infoProduct]);

    const handlePrev = () => {
        setStart(prev => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setStart(prev => Math.min(prev + 1, images.length - 5));
    };
    const handleVariantChange = (variant) => {
        setCurrentVariant(variant);
        const variantIndex = images.indexOf(variant.imageUrl);
        if (variantIndex !== -1) setCurrentImage(variantIndex);
    };

    if (!infoProduct) {
        return <div>Loading...</div>;
    }

    const currentImageUrl = currentVariant ? currentVariant.imageUrl : images[currentImage];

    // gợi ý sp
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 2000, min: 1024 }, items: 5 },
        desktop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
        tablet: { breakpoint: { max: 768, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
    };

    return (
        <>
            <div className='product-page'>
                <div className="line">
                    <NavLink to='/'>Trang chủ</NavLink> /
                    {infoProduct.brand && (
                        <NavLink to={`/brand/${infoProduct.brand.id}`}>
                            {infoProduct.brand.brandName}
                        </NavLink>
                    )}/
                    <p className="link">{infoProduct.productName}</p>
                </div>
                <div className='container'>
                    <div className='info-product'>
                        <div className='row'>
                            <div className='col-6 left'>
                                <div className='image-info'>
                                    <div className='top-image'>
                                        {/* Display the main large image at the top */}
                                        <img src={currentImageUrl} className="product-image" alt="Product" />

                                        {/* Thumbnail navigation below the main image */}
                                        <div className="bot-image">
                                            <button id="goToPrevSlide" onClick={handlePrev}><GrPrevious className='icon' /></button>
                                            {/* Display a subset of images for thumbnail navigation, updating `currentImage` when one is clicked */}
                                            {images.slice(start, start + 5).map((image, index) => (
                                                <div className={`image-slide ${index === currentImage ? 'active' : ''}`}
                                                    key={index} onClick={() => {
                                                        setCurrentImage(start + index);
                                                        if (currentVariant) {
                                                            setCurrentVariant(null);
                                                        }
                                                    }}>
                                                    <img src={image} className="product-image" alt={`Slide ${index}`} />
                                                </div>
                                            ))}
                                            <button onClick={handleNext}><GrNext className='icon' /></button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className='col-6 right'>
                                <div className='info-top'>
                                    <div className='brand-info mb-2'>
                                        <NavLink to={`/brand/${infoProduct.brand.id}`}>
                                            {infoProduct.brand.brandName}
                                        </NavLink><GrFormNext />
                                    </div>
                                    <div className='info-top-down'>
                                        <div className='title-info'>{infoProduct.productName}</div>
                                        <div className='discount-info'>{currentVariant ? -currentVariant.discountVariant : -infoProduct.discount}%</div>
                                    </div>
                                </div>
                                <div className='info-center col-9'>
                                    {/* <p className='text-star'>{infoProduct.averageRating}<IoIosStar className='icon-star' /></p> */}
                                    <div className="rating">
                                        <Rating
                                            name={`rating-${infoProduct.id}`}
                                            value={infoProduct.averageRating || 0} // Ensure rating exists
                                            precision={0.5}
                                            readOnly
                                        />
                                    </div>
                                    <p className='text-review'>{infoProduct.reviewCount || 0} Đánh giá</p>

                                    <p className='ms-1'>{infoProduct.purchases} Đã bán</p>
                                </div>
                                <div className='price-info'>
                                    <div className='price'>{(currentVariant?.priceVariant || infoProduct.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                    <div className='sale-price'>{(currentVariant?.salePriceVariant || infoProduct.salePrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                </div>
                                <div className='variant-option'>
                                    {infoProduct.variants?.map((variant, index) => (
                                        <div
                                            className={`product-variant ${currentVariant?.id === variant.id ? 'active' : ''}`}
                                            key={variant.id}
                                        >
                                            <input
                                                value={variant.nameVariant}
                                                type="radio"
                                                id={`product-swatch-input-option1-${index + 1}`}
                                                onChange={() => handleVariantChange(variant)}
                                                checked={currentVariant?.id === variant.id}
                                            />
                                            <label htmlFor={`product-swatch-input-option1-${index + 1}`}>
                                                <img className="img-variant" src={variant.imageUrl} alt={variant.nameVariant} />
                                                <span>{variant.nameVariant}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>


                                <div className='so-luong'>
                                    <div className='amount'>
                                        <button className='btn-amount' onClick={decreaseAmount}>-</button>
                                        <div className='amount-number'>{amount}</div>
                                        <button className='btn-amount' onClick={increaseAmount}>+</button>
                                        <div className='quantity mt-4'>{currentVariant ? currentVariant.quantityVariant : infoProduct.quantity} Sản phẩm có sẵn</div>
                                    </div>
                                    <div className='mua-hang'>
                                        <div className='mua-ngay'>Mua ngay</div>
                                        <div className='add' onClick={addToCart}>Thêm vào giỏ hàng</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                   

                    <div className='info-review mt-3'>
                        {/* <div className='title mb-2'>Chi tiết sản phẩm</div> */}
                        <div
                            className='description-info mt-4'
                            dangerouslySetInnerHTML={{ __html: infoProduct.description }}
                            style={{ maxHeight: isExpanded ? '' : '350px', overflow: 'hidden' }}
                        ></div>
                        <div className="button-container">
                            {isExpanded ? (
                                <button className='btn-expand'
                                    onClick={() => setIsExpanded(false)}>Thu gọn</button>
                            ) : (
                                <button className='btn-expand'
                                    onClick={() => setIsExpanded(true)}>Mở rộng</button>
                            )}
                        </div>

                        <div className="skin-item mt-5 mb-4">
                        <div className='title-p mt-3'>Gợi ý sản phẩm</div>
                        <Carousel responsive={responsive}>
                            {recommend && recommend.length > 0 ? ( // Kiểm tra `recommend` trước khi sử dụng `.length`
                                recommend.map((product) => (
                                    <NavLink to={`/product/${product.id}`} key={product.id}>
                                        <div key={product.id} className="custom-item">
                                            <div className="image-container">
                                                <div className="discount">-{product.discount}%</div>
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.productName}
                                                    className="product-image"
                                                />
                                                <img
                                                    src={product.images[1]}
                                                    alt={product.productName}
                                                    className="product-image hover-image"
                                                />
                                            </div>
                                            <div className="bottom">
                                                <div className="product-name">{product.productName}</div>
                                                <div className="price">
                                                    {product.price.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                                <div className="sale">
                                                    {product.salePrice.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                                <div className="bottom-two">
                                                    <div className="rating">
                                                        <Rating
                                                            name={`rating-${product.id}`}
                                                            value={product.averageRating || 0}
                                                            precision={0.5}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="purchases">
                                                        {product.purchases} Đã bán
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))
                            ) : (
                                <div>Không có sản phẩm nào</div>
                            )}
                        </Carousel>
                    </div>

                        <div className='review'>
                            <div className='boc-dg'>
                                <div className='title'>Đánh giá sản phẩm</div>
                                <div className='boc-sao'>
                                    <p className='text-star'>{infoProduct.averageRating}<IoIosStar className='icon-star' /></p>
                                    <p className='text-p'>trên  5</p>
                                </div>
                            </div>
                        </div>


                        <div className='review-list'>
                            {allReview && allReview.length > 0 ? (
                                allReview.map((review) => (
                                    <div key={review.id} className='boc-review'>
                                        <div className='user-info'>
                                            <img src={review.user.image} alt={review.user.fullName} className='user-image' />
                                            <p className='user-name'>{review.user.fullName}</p>
                                        </div>
                                        <Rating value={review.rating} readOnly className='review-rating' />
                                        <p className='comment'>{review.comment}</p>
                                        <p className='created-at'>{new Date(review.reviewDate).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                            )}
                        </div>
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(totalRecor / productPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>


            </div>
        </>
    );
};

export default InfoProduct;
