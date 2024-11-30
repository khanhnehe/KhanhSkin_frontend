import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderByUser, changeStatusOrder, createdReview } from '../../../../store/action/userThunks';
import './OrderPage.scss';
import { IoSearch } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { Modal, Box, Button } from '@mui/material';
import { Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const OrderPage = () => {
  const dispatch = useDispatch();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({});
  const totalRecord = useSelector((state) => state.root.user.totalRecord);
  const listOrder = useSelector(state => state.root.user.orderUser);
  const [currentPage, setCurrentPage] = useState(0);
  const [input, setInput] = useState({
    orderStatus: null,
    freeTextSearch: null,
    isAscending: false,
    pageIndex: currentPage + 1,
    pageSize: 8,
  });


  useEffect(() => {
    dispatch(getOrderByUser(input));
  }, [dispatch, input, currentPage]);

  const handleStatusClick = (status) => {
    setInput((prev) => ({ ...prev, orderStatus: status }));
  };

  const handleSearchChange = (event) => {
    setInput((prev) => ({ ...prev, freeTextSearch: event.target.value }));
  };

  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(changeStatusOrder({ orderId, status: 'cancel', orderStatus: input.orderStatus }));
      }
    });
  };

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);

    // Khởi tạo dữ liệu đánh giá cho từng sản phẩm trong đơn hàng
    const initialReviewData = order.orderItems.reduce((acc, item) => {
      const productId = item.productId;
      if (!acc[productId]) {
        acc[productId] = {
          rating: 0,
          comment: '',
          productName: item.productName,
          images: item.images,
          variants: [item.nameVariant],
        };
      } else {
        acc[productId].variants.push(item.nameVariant);
      }
      return acc;
    }, {});

    setReviewData(initialReviewData);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedOrder(null);
    setReviewData({});
  };

  // sao
  const handleRatingChange = (productId, rating) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  //cmt
  const handleCommentChange = (productId, comment) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleSubmitReview = () => {
    // Tạo mảng review payload
    const reviewsPayload = Object.keys(reviewData).map((productId) => {
      const { rating, comment } = reviewData[productId];
      return {
        orderId: selectedOrder.id,
        productId,
        rating,
        comment,
        reviewDate: new Date().toISOString(),
        isApproved: false,
      };
    });

    // Gửi payload đi
    dispatch(createdReview(reviewsPayload));
    closeReviewModal();
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    setInput((prev) => ({ ...prev, pageIndex: event.selected + 1 }));
  };

  const getColorAndName = (status) => {
    switch (status) {
      case 1:
        return { backgroundColor: '#dbf2d3', color: '#006d3a', name: 'Đang chờ xử lý' };
      case 2:
        return { backgroundColor: '#fec0f6', color: '#b917ce', name: 'Đang giao hàng' };
      case 3:
        return { backgroundColor: '#c7ecfb', color: '#13108a', name: 'Đã hoàn thành' };
      case 4:
        return { backgroundColor: '#fec2c2', color: '#d10101', name: 'Đã hủy' };
      default:
        return { backgroundColor: 'gray', color: 'white', name: 'Không xác định' };
    }
  };

  const renderedOrders = useMemo(() => {
    return listOrder && listOrder.length > 0 ? (
      listOrder.map(order => (
        <div className='boc' key={order.trackingCode}>
          <div className='code'>Mã đơn: {order.trackingCode}</div>
          {order.orderItems.map((item, index) => (
            <div key={index} className='product-info'>
              <div className='product-info-name'>
                <div className='up-info'>
                  <NavLink to={`/product/${item.productId}`} key={item.productId}>
                    <img src={item.images[0]} className='product-image' alt={item.productName} />
                  </NavLink>

                  <div className='name'>
                    <span className='product-name'>{item.productName}</span>
                    {item.nameVariant && (
                      <span className='product-variant'>{item.nameVariant}</span>
                    )}
                  </div>
                </div>
                <div className='down-info'>
                  <span className='amount'>x {item.amount}</span>
                  <div className='price'>
                    {item.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                  <div className='price-sale'>
                    {item.productSalePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='bottom'>
            {order.orderStatus === 1 ? (
              <div
                className='btn btn-danger cancel-button'
                onClick={() => handleCancelOrder(order.id)}
              >
                Hủy đơn
              </div>
            ) : order.orderStatus === 3 ? (
              order.hasReviewe ? (
                <div className='btn btn-secondary text-light cancel-button disabled'>
                  Đã đánh giá
                </div>
              ) : (
                <div
                  className='btn btn-success text-light cancel-button'
                  onClick={() => openReviewModal(order)}
                >
                  Đánh giá
                </div>
              )
            ) : (
              <div></div>
            )}

            <div className='right-price'>
              <div className='tien'>
                Thành tiền: {order.finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
              <div className='status-tong' style={getColorAndName(order.orderStatus)}>
                {getColorAndName(order.orderStatus).name}
              </div>
            </div>
          </div>

        </div>
      ))
    ) : (
      <p>Không có đơn hàng nào ở trạng thái này.</p>
    );
  }, [listOrder]);

  return (
    <div className='container'>
      <div className='order'>
        <div className='bottom-down row mt-0 p-0'>
          <li className='option'>
            <div
              className={` ${input.orderStatus === null ? 'active' : ''}`}
              onClick={() => handleStatusClick(null)}
            >
              Tất cả đơn hàng
            </div>
            <div
              className={` ${input.orderStatus === 1 ? 'active' : ''}`}
              onClick={() => handleStatusClick(1)}
            >
              Đang chờ xử lý
            </div>
            <div
              className={` ${input.orderStatus === 2 ? 'active' : ''}`}
              onClick={() => handleStatusClick(2)}
            >
              Đang giao hàng
            </div>
            <div
              className={` ${input.orderStatus === 3 ? 'active' : ''}`}
              onClick={() => handleStatusClick(3)}
            >
              Đã hoàn thành
            </div>
            <div
              className={` ${input.orderStatus === 4 ? 'active' : ''}`}
              onClick={() => handleStatusClick(4)}
            >
              Đã hủy
            </div>
          </li>
        </div>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Nhập tên sản phẩm, mã vận đơn để tìm kiếm đơn hàng'
            value={input.freeTextSearch}
            onChange={handleSearchChange}
          />
          <IoSearch className="search-icon" />
        </div>
        <div className='listOrder'>
          <div className='top'>
            <div className='my-order'>
              {renderedOrders}
            </div>
          </div>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={Math.ceil(totalRecord / input.pageSize)}  // Tổng số trang
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}  // Hàm xử lý khi chuyển trang
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>


      {/* Modal Đánh Giá Sản Phẩm */}
      <Modal open={isReviewModalOpen} onClose={closeReviewModal} aria-labelledby="order-review-modal">
        <Box
          className="modal-box"
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: 24,
            width: '80%',
            maxWidth: '1000px',
            margin: 'auto',
            mt: '1%',
            borderRadius: '5px',
            maxHeight: '650px',
            overflowY: 'auto',
          }}
        >
          <div className="modal-header mb-3">
            <h2 className="h5">Đánh Giá Sản Phẩm</h2>
            <div className="text-muted ms-auto">Mã đơn: {selectedOrder?.trackingCode}</div>
          </div>

          {/* Hiển thị các sản phẩm trong modal */}
          <div className="modal-body mb-1">
            {Object.keys(reviewData).map((productId) => {
              const product = reviewData[productId];
              return (
                <div key={productId} className="mb-4">
                  <div className="ratting-review d-flex gap-3 mb-3">
                    <img src={product.images[0]} className="rounded" style={{ width: "80px", height: "80px" }} alt={product.productName} />
                    <div>
                      <h6 className="fw-bold">{product.productName}</h6>
                      <div className="mt-2">
                        {product.variants.map((variant, index) => (
                          <div key={index} className="d-flex align-items-center text-muted small">
                            <span className="me-2">•</span>
                            <span>Phân loại: {variant}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="form-label  fw-bold">Chất lượng sản phẩm</label>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => handleRatingChange(productId, star)} className="btn btn-link p-0">
                            <Star className={`w-8 h-8 ${product.rating >= star ? 'text-warning star-filled' : 'text-muted'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        className="form-control mt-2"
                        placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                        value={product.comment}
                        onChange={(e) => handleCommentChange(productId, e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal-footer d-flex justify-content-end gap-2">
            <Button onClick={closeReviewModal} variant="secondary" className="btn btn-outline-secondary">
              Trở lại
            </Button>
            <Button onClick={handleSubmitReview} variant="primary" className="btn btn-primary">
              Đã hoàn thành
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderPage;
