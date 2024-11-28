import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResult = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Lấy các tham số từ URL
    const queryParams = new URLSearchParams(location.search);
    const transactionStatus = queryParams.get('vnp_TransactionStatus');

    // Xử lý trạng thái giao dịch
    if (transactionStatus === '00') {
      setStatusMessage('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.');
      setIsSuccess(true);
    } else {
      setStatusMessage('Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
      setIsSuccess(false);
    }
  }, [location]);

  return (
    <div className='container '>
      <h1 className={isSuccess ? 'text-success' : 'text-danger'}>
        {isSuccess ? 'Thành công' : 'Thất bại'}
      </h1>
      <p>{statusMessage}</p>
    </div>
  );
};

export default PaymentResult;
