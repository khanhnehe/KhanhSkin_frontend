import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { getCartByUser, deletedCartItem, addProductCart, getActiveVouchers, applyToVoucher } from '../../../store/action/adminThunks';
import './CartOrder.scss';
import { useNavigate, NavLink } from 'react-router-dom';
import { ChevronDown, AlertCircle } from 'react-feather';
import { CiDiscount1 } from "react-icons/ci";
import { RiInformationLine } from "react-icons/ri";

const CartOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const listCart = useSelector(state => state.root.admin.cartByUser || {});
    const activeVouchers = useSelector(state => state.root.admin.activeVoucher || []);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        dispatch(getCartByUser());
        dispatch(getActiveVouchers());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deletedCartItem(id)).then(() => {
            dispatch(getCartByUser());
        });
    };

    const handleChangeAmount = (cartItemId, amountChange) => {
        const cartItem = listCart.cartItems?.find(item => item.id === cartItemId);
        if (cartItem) {
            const newAmount = cartItem.amount + amountChange;
            if (newAmount > -1) {
                if (newAmount <= 0) {
                    return;
                }
                dispatch(addProductCart({
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                    amountAdd: amountChange,
                })).then(() => {
                    dispatch(getCartByUser());
                });
            }
            if (newAmount === 0) {
                handleDelete(cartItemId);
            }
        }
    };

    const handleCheckOut = () => {
        navigate('/checkout');
    };

    const handleApplyVoucher = (voucherId) => {
        dispatch(applyToVoucher({ voucherId, action: "apply" }))
            .unwrap()
            .then(() => {
                dispatch(getCartByUser());
                setSelectedVoucher(voucherId);
            })
            .catch((error) => {
                console.error("Error applying voucher:", error);
            });
    };

    const handleRemoveVoucher = () => {
        if (selectedVoucher) {
            dispatch(applyToVoucher({ voucherId: selectedVoucher, action: "remove" }))
                .unwrap()
                .then(() => {
                    setSelectedVoucher(null);
                    dispatch(getCartByUser());
                })
                .catch((error) => {
                    console.error("Error removing voucher:", error);
                });
        }
    };

    return (
        <div className="cart-page">
            <div className="line">Trang chủ / Giỏ hàng</div>
            <div className='container'>
                <h1 className="title-cart">Giỏ hàng</h1>
                {listCart?.cartItems?.length > 0 ? (
                    <Col>
                        <Row>
                            <Col md={9}>
                                {listCart.cartItems.map(item => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="item-left">
                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>x</button>
                                            <NavLink to={`/product/${item.productId}`} key={item.productId}>
                                                <img src={item.images[0]} alt="Product" className="cart-image" />
                                            </NavLink>
                                        </div>
                                        <div className="item-right">
                                            <div className="name">{item.productName}</div>
                                            {item.nameVariant && <span className="name-variant">{item.nameVariant}</span>}
                                        </div>
                                        <div className="content-right">
                                            <div className="item-amount">
                                                <button onClick={() => handleChangeAmount(item.id, -1)}>-</button>
                                                <div className="amount-number">{item.amount}</div>
                                                <button onClick={() => handleChangeAmount(item.id, 1)}>+</button>
                                            </div>
                                            <div className="item-price">
                                                <div className="price">{item?.productPrice.toLocaleString('vi-VN')} ₫</div>
                                                <div className="sale_price">{item?.productSalePrice.toLocaleString('vi-VN')} ₫</div>
                                            </div>
                                            <div className="tong-price">{item?.itemsPrice.toLocaleString('vi-VN')} ₫</div>
                                        </div>
                                    </div>
                                ))}
                            </Col>
                            <Col md={3}>
                                <div className="order-summary">
                                    <span className="text-tam-tinh">Tổng Đơn hàng</span>
                                    <div className='price'>
                                        <div className="tam-tinh">Tạm Tính:</div>
                                        <div className='final-price'>{listCart?.totalPrice?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className='price'>
                                        <div className="tam-tinh">Mã giảm:</div>
                                        <div className='final-price'>-{listCart?.discountValue?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className="price">
                                        <div className="tam-tinh">Tổng cộng:</div>
                                        <div className="final-price">{listCart?.finalPrice?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <Button variant="success" onClick={handleCheckOut} className="check-out" block>
                                        Thanh toán
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="apply-voucher">
                                <div
                                    className="flex items-center mb-4 cursor-pointer"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <ChevronDown
                                        className={`text ${isOpen ? '' : '-rotate-90'}`}
                                        size={20}
                                    />
                                    <span className="title-voucher">MÃ GIẢM GIÁ</span>
                                </div>
                                <div className={`transition-all duration-300 origin-top ${isOpen ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                    <div className="top-voucher gap-2 mb-4 ms-3">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã giảm giá/Phiếu mua hàng"
                                            className="flex-1 px-4 py-2 border rounded"
                                            value={listCart.voucherProgramName || ""}
                                            onChange={(e) => setSelectedVoucher(e.target.value)}
                                        />
                                    </div>
                                    <div className="bottom-voucher">
                                        {activeVouchers.map((voucher) => (
                                            <div key={voucher.id} className="item-voucher">

                                                <div className="card shadow-lg rounded-lg overflow-hidden">
                                                    <div className="ticket-perforations top">
                                                        {[...Array(20)].map((_, i) => (
                                                            <div key={i} className="circle" />
                                                        ))}
                                                    </div>

                                                    <div className="ticket-perforations bot">
                                                        {[...Array(20)].map((_, i) => (
                                                            <div key={i} className="circle" />
                                                        ))}
                                                    </div>

                                                    <div className="voucher">
                                                        <div className="icon-container">
                                                            <div className="icon-wrapper">
                                                                <CiDiscount1 className="icon" />
                                                            </div>
                                                        </div>
                                                        <div className="voucher-content ">
                                                            <div className="">
                                                                <div className="text-voucher">{voucher.programName}</div>
                                                                <div className="text-child">
                                                                    {voucher.discountType === 1
                                                                        ? `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}₫`
                                                                        : `Giảm ${voucher.discountValue}%`}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-child">

                                                                    {voucher.minimumOrderValue &&
                                                                        `Đơn tối thiểu: ${voucher.minimumOrderValue.toLocaleString('vi-VN')}₫`}
                                                                </div>
                                                                <div className="text-child">Mã: {voucher.code} </div>
                                                                <div className='text-child' >
                                                                    HSD: {new Date(voucher.endTime).toLocaleString('vi-VN')}
                                                                </div>

                                                            </div>
                                                        </div>
                                                        {/* áp dụng */}
                                                        <div className="text-cancel">

                                                            {listCart.voucherId === voucher.id ? (
                                                                <button className="btn btn-danger" onClick={handleRemoveVoucher}>
                                                                    Gỡ bỏ
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-outline-danger" onClick={() => handleApplyVoucher(voucher.id)}>
                                                                    Áp dụng
                                                                </button>
                                                            )}
                                                            <div onClick={() => navigate(`/condition-voucher/${voucher.id}`)}>
                                                                <RiInformationLine className="icon" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </Col>
                ) : (
                    <div>Không có sản phẩm nào</div>
                )}
            </div>
        </div>
    );
};

export default CartOrder;
