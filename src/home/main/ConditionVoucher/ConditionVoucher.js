import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { conditionOfVoucher } from '../../../store/action/userThunks';
import './ConditionVoucher.scss';

const ConditionVoucher = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const voucher = useSelector((state) => state.root.user.infoVoucher);

  useEffect(() => {
    if (id) {
      dispatch(conditionOfVoucher(id));
    }
  }, [dispatch, id]);

  if (!voucher) {
    return <div className="text-center mt-4">Đang tải dữ liệu...</div>;
  }

  const productVouchers = voucher.productVouchers || [];

  return (
    <div className="container">
      <h4 className="text-center mb-4">Thông tin mã giảm giá</h4>
      <h3 className="text-center text-danger mb-4">{voucher.programName || 'Không có tên chương trình'}</h3>
      <h6 className="text-center mb-4">{voucher.description || 'Không có mô tả'}</h6>
      <div className="voucher-details mb-4 p-3 bg-light rounded shadow-lg">
        <div>
          <strong>Mã Voucher:</strong> {voucher.code || 'Không có mã'}
        </div>
        <div>
          <strong>Loại Voucher:</strong>{' '}
          {voucher.voucherType === 1 ? 'Toàn hệ thống' : 'Cho sản phẩm nhất định'}
        </div>
        <div>
          <strong>Loại Giảm Giá:</strong>{' '}
          {voucher.discountType === 1 ? 'Số tiền' : 'Phần trăm'}
        </div>
        <div>
          <strong>Giá trị giảm:</strong>{' '}
          {voucher.discountType === 1
            ? `${voucher.discountValue?.toLocaleString('vi-VN')} VND` || 'Không xác định'
            : `${voucher.discountValue}%`}
        </div>
        <div>
          <strong>Giá trị đơn hàng tối thiểu:</strong>{' '}
          {voucher.minimumOrderValue
            ? `${voucher.minimumOrderValue.toLocaleString('vi-VN')} VND`
            : 'Không yêu cầu'}
        </div>
        <div>
          <strong>Thời hạn:</strong>{' '}
          {voucher.endTime ? new Date(voucher.endTime).toLocaleString('vi-VN') : 'Không xác định'}
        </div>
        <div>
          <strong>Số lần sử dụng:</strong>{' '}
          {voucher.totalUses !== undefined ? voucher.totalUses : 'Không giới hạn'}
        </div>
      </div>
      {productVouchers.length > 0 ? (
        <div className="grid-product">
          {productVouchers.map((productVoucher) => (
            <div key={productVoucher.id}>
              <NavLink to={`/product/${productVoucher.product.id}`} key={productVoucher.id}>
                <div className="custom-item">
                  <div className="image-container">
                    <img
                      src={productVoucher.product.images?.[0] || 'https://via.placeholder.com/150'}
                      className="product-image"
                      alt={productVoucher.product.productName || 'Không có tên sản phẩm'}
                    />
                  </div>
                  <div className="bottom">
                    <div className="product-name">
                      {productVoucher.product.productName || 'Không có tên sản phẩm'}
                    </div>
                    <div className="price">
                      {productVoucher.product.price
                        ? `${productVoucher.product.price.toLocaleString('vi-VN')} VND`
                        : 'Không xác định'}
                    </div>
                    <div className="sale">
                      {productVoucher.product.salePrice
                        ? `${productVoucher.product.salePrice.toLocaleString('vi-VN')} VND`
                        : 'Không xác định'}
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">Voucher này không có sản phẩm áp dụng.</p>
      )}
    </div>
  );
};

export default ConditionVoucher;
