import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVoucher } from '../../store/action/adminThunks';
import './Voucher.scss';

const Voucher = () => {
    const dispatch = useDispatch();

    const vouchers = useSelector((state) => state.root.admin.allVoucher);

    useEffect(() => {
        dispatch(getVoucher());
    }, [dispatch]);

    return (
        <div className='voucher'>
            <h1 className='text-danger'>Voucher khuyến mãi</h1>
            <div className='links mb-4'>
                <Link to="/admin/voucher-global" className='btn btn-primary me-2'>Voucher Global</Link>
                <Link to="/admin/voucher-specific" className='btn btn-secondary'>Voucher Specific</Link>
            </div>

            <div className='voucher-table'>
                {vouchers && vouchers.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Program Name</th>
                                <th>Code</th>
                                <th>Description</th>
                                <th>Discount Type</th>
                                <th>Discount Value</th>
                                <th>Minimum Order Value</th>
                                <th>Total Uses</th>
                                <th>Uses Count</th>
                                <th>Active</th>
                                <th>End Date</th>
                                <th>Associated Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.id}>
                                    <td>{voucher.programName}</td>
                                    <td>{voucher.code}</td>
                                    <td>{voucher.description || 'No description provided'}</td>
                                    <td>{voucher.discountType === 1 ? 'Amount Money' : 'Percentage'}</td>
                                    <td>{voucher.discountValue}</td>
                                    <td>{voucher.minimumOrderValue}</td>
                                    <td>{voucher.totalUses}</td>
                                    <td>{voucher.usesCount}</td>
                                    <td>{voucher.isActive ? 'Yes' : 'No'}</td>
                                    <td>{new Date(voucher.endTime).toLocaleString()}</td>
                                    <td>
                                        {voucher.productVouchers.length > 0 ? (
                                            <ul className="product-list">
                                                {voucher.productVouchers.map((productVoucher) => (
                                                    <li key={productVoucher.id}>
                                                        <p>{productVoucher.product.productName}</p>
                                                        <p>Sale Price: {productVoucher.product.salePrice}</p>
                                                        <img
                                                            src={productVoucher.product.images[0]}
                                                            alt={productVoucher.product.productName}
                                                            style={{ width: '50px', marginTop: '5px' }}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No products</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No vouchers available.</p>
                )}
            </div>
        </div>
    );
};

export default Voucher;
