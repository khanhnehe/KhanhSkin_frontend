import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './CheckOut.scss';
import { GrFormNext } from "react-icons/gr";
import { getCartByUser, checkOutOrder, getActiveVouchers, applyToVoucher } from '../../../store/action/adminThunks';
import { getAddressById } from '../../../store/action/userThunks';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { ChevronDown, AlertCircle } from 'react-feather';
import { CiDiscount1 } from "react-icons/ci";
import vnPay from '../../../assets/Logo-VNPAY-QR-1.webp';
import cod from '../../../assets/Ảnh chụp màn hình 2024-11-30 004603.png';
import { RiInformationLine } from "react-icons/ri";


const shippingMethods = [
    { value: 1, label: 'Giao hàng nhanh' },        // FasfDelivery = 1
    { value: 2, label: 'Giao hàng tiết kiệm' }     // EconomyDelivery = 2
];

const paymentMethods = [
    { value: 1, label: 'Thanh toán khi nhận hàng' }, // Receive = 1
    { value: 2, label: 'Thanh toán VNpay' }          // Vnpay = 2
];

const CheckOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const listCart = useSelector(state => state.root.admin.cartByUser);
    const activeVouchers = useSelector(state => state.root.admin.activeVoucher || []);
    const infoAddress = useSelector(state => state.root.user.address);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [tempSelectedAddressId, setTempSelectedAddressId] = useState(null);

    const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0].value);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].value);
    const [noteText, setNoteText] = useState('');

    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        dispatch(getCartByUser());
        dispatch(getAddressById());
        dispatch(getActiveVouchers());
    }, [dispatch]);

    useEffect(() => {
        if (infoAddress && infoAddress.length > 0) {
            const defaultAddress = infoAddress.find(address => address.isDefault) || infoAddress[0];
            setSelectedAddress(defaultAddress);
            setTempSelectedAddressId(defaultAddress.id);
        }
    }, [infoAddress]);

    const handleConfirmAddress = () => {
        const selected = infoAddress.find(address => address.id === tempSelectedAddressId);
        setSelectedAddress(selected);
        setShowAddressModal(false);
    };

    const handleCloseModal = () => setShowAddressModal(false);

    const handleCheckout = () => {
        if (!selectedAddress) {
            toast.error('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        const checkoutData = {
            cartId: listCart.id,
            addressId: selectedAddress.id,
            shippingMethod: selectedShippingMethod,
            paymentMethod: selectedPaymentMethod,
            note: noteText,
            voucherId: selectedVoucher
        };

        dispatch(checkOutOrder(checkoutData))
            .unwrap()
            .then((response) => {
                if (response.paymentUrl) {
                    // Nếu thanh toán VNPay, điều hướng người dùng đến URL thanh toán
                    window.location.href = response.paymentUrl;
                } else {
                    // Nếu COD, chuyển hướng đến trang đơn hàng
                    toast.success("Đặt hàng thành công!");
                    // setTimeout(() => {
                    //     navigate('/profile/order');
                    // }, 2000);
                }
            })
            .catch(() => {
                toast.error("Đặt hàng không thành công.");
            });
    };


    const handleApplyVoucher = (voucherId) => {
        dispatch(applyToVoucher({ voucherId, action: "apply" }))
            .unwrap()
            .then(() => {
                dispatch(getCartByUser());
                setSelectedVoucher(voucherId);
            })
            .catch(() => {
                toast.error("Không thể áp dụng voucher.");
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
                .catch(() => {
                    toast.error("Không thể gỡ bỏ voucher.");
                });
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    return (
        <div className='checkOut-page'>
            <div className='line'>
                <div className='title-checkOut'>Thanh toán</div>
            </div>
            <div className='container'>
                <div className='checkOut row'>
                    <div className='cart'>
                        <Link to='/cart'>
                            <div style={{ color: "#009eff" }}>Giỏ hàng</div>
                        </Link>
                        <div className='title-small'>
                            <GrFormNext />Thông tin giao hàng
                        </div>
                    </div>

                    <div className='left col-6'>
                        <div className='shipping-address'>
                            <div className='address-header'>
                                <span className='icon'><i className="fas fa-map-marker-alt"></i></span>
                                <span className='title'>Địa Chỉ Nhận Hàng</span>
                            </div>
                            {selectedAddress && (
                                <div className='address-content'>
                                    <p className='address-detail'> Tên người nhận: {selectedAddress.fullName}</p>
                                    <p className='address-detail'> Sđt: {selectedAddress.phoneNumber}</p>
                                    <div className='address-detail'>
                                        <div> Địa chỉ: {selectedAddress.addressDetail}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}</div>

                                    </div>
                                    <div className='address-actions mt-2'>
                                        {selectedAddress.isDefault && <span className='default-label'>Mặc Định</span>}
                                        <button className='change-btn' onClick={() => setShowAddressModal(true)}>Thay Đổi</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='name mt-4'>Phương thức vận chuyển</div>
                        <div className='shipping-method col-11 mt-1'>
                            {shippingMethods.map(method => (
                                <div key={method.value}>
                                    <input
                                        type="radio"
                                        name="shippingMethod"
                                        className='ms-3'
                                        value={method.value}
                                        checked={selectedShippingMethod === method.value}
                                        onChange={() => setSelectedShippingMethod(method.value)}
                                    />
                                    <span> {method.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="col-sm-11 mt-3">
                            <textarea
                                placeholder="Nhập ghi chú (nếu có)"
                                rows="3"
                                className="form-control"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            ></textarea>
                        </div>

                        <div className='payment-method col-11 mt-3'>
                            <div className='name'>Phương thức thanh toán</div>
                            {paymentMethods.map(method => (
                                <div key={method.value}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        className='mt-3'
                                        value={method.value}
                                        checked={selectedPaymentMethod === method.value}
                                        onChange={() => setSelectedPaymentMethod(method.value)}
                                    />
                                    {method.value === 2 ? (
                                        <span>
                                            <img src={vnPay} alt="VNPay" style={{ width: '106px', marginLeft: '10px' }} />    Thanh toán với VNpay
                                        </span>
                                    ) :
                                        (
                                            <span>
                                                <img src={cod} alt="cod" style={{ width: '106px', marginLeft: '10px' }} /> Thanh toán khi nhận hàng
                                            </span>
                                        )}
                                </div>
                            ))}
                        </div>


                        {/* Mã giảm giá */}
                        <div className="apply-voucher">
                            <div
                                className="flex items-center mb-4 cursor-pointer"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <ChevronDown className={`text ${isOpen ? '' : '-rotate-90'}`} size={20} />
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
                    </div>

                    <div className='right col-6'>
                        <div className='order row'>
                            {listCart?.cartItems?.length > 0 && (
                                <>
                                    {listCart.cartItems.map((item, index) => (
                                        <div className='left col-12' key={index}>
                                            <div className='check-row'>
                                                <div className='content-left'>
                                                    <div className='item-left'>
                                                        <img src={item.images[0]} className="checkOut-image" alt="product" />
                                                    </div>
                                                    <div className='item-right'>
                                                        <div className='name'>{item.productName}</div>
                                                        {item.nameVariant && <span className="name-variant">{item.nameVariant}</span>}
                                                    </div>
                                                </div>
                                                <div className='content-right'>
                                                    <div className='amount-number'>x {item.amount}</div>
                                                    <div className="tong-price">{item.itemsPrice.toLocaleString('vi-VN')} ₫</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className='gia-ship col-12'>
                                        <div className='tam-tinh'>Tạm tính</div>
                                        <div className='tam-tinh'>{listCart.totalPrice?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className='gia-ship col-12'>
                                        <div className='tam-tinh'>Mã giảm</div>
                                        <div className='tam-tinh'>- {listCart.discountValue?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className='gia-ship col-12'>
                                        <div className='tam-tinh'>Tổng cộng</div>
                                        <div className='tam-tinh'>{listCart.finalPrice?.toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className='gia-ship col-12'>
                                        <div className='tam-tinh'>Phí vận chuyển</div>
                                        <div className='tam-tinh'>
                                            {(selectedShippingMethod === 1 ? 35000 : 25000).toLocaleString('vi-VN')} ₫
                                        </div>
                                    </div>
                                    <div className='gia col-12'>
                                        <div className='tam'>Tổng thanh toán</div>
                                        <div className='tam'>{(listCart.finalPrice + (selectedShippingMethod === 1 ? 35000 : 25000)).toLocaleString('vi-VN')} ₫</div>
                                    </div>
                                    <div className='col thanh-toan col-11 mb-3' onClick={handleCheckout}>
                                        Hoàn tất đơn hàng
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                <Modal
                    open={showAddressModal}
                    onClose={handleCloseModal}
                    aria-labelledby="address-modal-title"
                    aria-describedby="address-modal-description"
                >
                    <Box sx={modalStyle}>
                        <div className="modal-header">
                            <h4 id="address-modal-title">Chọn địa chỉ giao hàng</h4>
                        </div>
                        <div className="modal-body" id="address-modal-description mt-3">
                            {infoAddress && infoAddress.map(address => (
                                <div key={address.id} className="address-item ">
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address.id}
                                        checked={tempSelectedAddressId === address.id}
                                        onChange={() => setTempSelectedAddressId(address.id)}
                                    />
                                    <label className='mb-3 mt-3 ms-2'>
                                        {address.fullName}, {address.phoneNumber}, {address.detail}, {address.ward}, {address.district}, {address.province}
                                        {address.isDefault && <span className=' ms-2 text-danger'>Mặc Định</span>}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-dark me-3' onClick={handleCloseModal}>Đóng</button>
                            <button className='btn btn-success' onClick={handleConfirmAddress}>Xác nhận</button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default CheckOut;
