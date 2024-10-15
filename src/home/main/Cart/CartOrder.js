import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getCartByUser, deletedCartItem,addProductCart } from '../../../store/action/adminThunks';
import './CartOrder.scss';

const CartOrder = () => {
    const dispatch = useDispatch();
    const listCart = useSelector(state => state.root.admin.cartByUser);

    useEffect(() => {
        dispatch(getCartByUser());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deletedCartItem(id));
    };
   
    
    const handleChangeAmount = (cartItemId, amountChange) => {
        // Hàm để thay đổi số lượng sản phẩm
        const cartItem = listCart.cartItems.find(item => item.id === cartItemId);  // Tìm sản phẩm trong giỏ hàng
        if (cartItem) {
            const newAmount = cartItem.amount + amountChange;  // Tính số lượng mới
            if (newAmount > -1) {
                // Nếu số lượng mới hợp lệ, gọi API để cập nhật
                if (newAmount <= 0) {
                    // Nếu số lượng mới là 1 và người dùng muốn giảm số lượng, không cho phép
                    return;
                }
                dispatch(addProductCart({
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                    amountAdd: amountChange,
                }));
            }
            if (newAmount === 0) {
                handleDelete(cartItemId);
            }
        }
    };

    
    return (
        <div className="cart-page">
            <div className="line">Trang chủ / Giỏ hàng</div>
            <div className='container'>
                <h1 className="title-cart">Giỏ hàng</h1>
                <Row>
                    <Col md={9}>
                        {listCart && listCart.cartItems && listCart.cartItems.length > 0 ?
                            (listCart.cartItems.map(item => (
                                <div className="cart-item" key={item.id}>
                                    <div className="item-left">
                                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>x</button>
                                        <img src={item.images[0]} alt="Product" className="cart-image" />
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
                            ))
                            ) : (<div>Không có sản phẩm nào</div>)
                        }
                    </Col>
                    <Col md={3}>
                        <div className="order-summary">
                            <span className="text-tam-tinh">Tổng Đơn hàng</span>
                            <div className='price'>
                                <div className="tam-tinh">Tạm Tính:</div>
                                <div className='final-price'> {listCart?.finalPrice.toLocaleString('vi-VN')} ₫</div>
                            </div>

                            <Button variant="success" className="check-out" block>Thanh toán</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CartOrder;
