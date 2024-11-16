import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVoucher } from '../../store/action/adminThunks';
import './Voucher.scss';
import { IoMdAdd } from "react-icons/io";

const Voucher = () => {
    const dispatch = useDispatch();

    const vouchers = useSelector((state) => state.root.admin.allVoucher);

    useEffect(() => {
        dispatch(getVoucher());
    }, [dispatch]);

    return (
        <div className='voucher'>
            <div className='top'>
            <h3 className='text-danger'>Mã khuyến mãi</h3>
            <div className='links mb-4'>
                <Link to="/admin/voucher-global" className='p-2 btn btn-success me-2 ' >Voucher Toàn shop <IoMdAdd/></Link>
                <Link to="/admin/voucher-specific" className='p-2 btn text-light' style={{backgroundColor: "#ff7f7f"}}>Voucher Sản phẩm cụ thể <IoMdAdd/> </Link>
            </div>

            <div className='voucher-table'>
                {vouchers && vouchers.length > 0 ? (
                    <table className="table table-striped border ">
                        <thead>
                            <tr>
                                <th>Tên mã</th>
                                <th>Code</th>
                                {/* <th>Mô tả</th> */}
                                {/* <th>Loại giảm giá</th> */}
                                <th>Giá trị giảm</th>
                                <th>Giá đơn hàng tối thiểu</th>
                                <th>Lượt dùng</th>
                                <th>Ngày hết hạn</th>
                                <th>Sản phẩm</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.id}>
                                    <td>{voucher.programName}</td>
                                    <td>{voucher.code}</td>
                                    <td>
                                        {voucher.discountType === 1
                                            ? `${voucher.discountValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`
                                            : `${voucher.discountValue}%`}
                                    </td>
                                    <td>{voucher.minimumOrderValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td>{voucher.totalUses}</td>
                                    <td>{new Date(voucher.endTime).toLocaleString()}</td>
                                    <td>
                                        {voucher.productVouchers.length > 0 ? (
                                            <div className="product-list">
                                                {voucher.productVouchers.map((productVoucher) => (
                                                    <div key={productVoucher.id}>
                                                        <div className='info-product'>
                                                            <img
                                                                src={productVoucher.product.images[0]}
                                                                alt={productVoucher.product.productName}
                                                                style={{ width: '50px', marginTop: '5px' }}
                                                            />
                                                            <div className='product-name'>{productVoucher.product.productName}</div>

                                                        </div>
                                                        <p style={{ fontWeight: "600" }}>Giá: {productVoucher.product.salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>


                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span>No products</span>
                                        )}
                                    </td>
                                    <td>
                                        <td>{voucher.usesCount}</td>
                                        <td>{voucher.isActive ? 'Yes' : 'No'}</td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No vouchers available.</p>
                )}
            </div>
            </div>
           
        </div>
    );
};

export default Voucher;
