import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { IoSearch } from 'react-icons/io5';
import { getPageOrders } from '../../store/action/adminThunks';
import { changeStatusOrder } from '../../store/action/userThunks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, subDays } from 'date-fns';
import ReactPaginate from 'react-paginate';
import './Order.scss';
import { MdOutlineDateRange } from "react-icons/md";

const Order = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(0);
    const [input, setInput] = useState({
        orderStatus: null,
        freeTextSearch: '',
        pageIndex: currentPage + 1,
        pageSize: 5,
        sortBy: 'orderDate',
        isAscending: true,
        startDate: null,
        endDate: null,
    });

    const listAllOrder = useSelector(state => state.root.admin.allOrder);
    const totalRecord = useSelector((state) => state.root.admin.totalRecord);

    useEffect(() => {
        fetchOrders();
    }, [input, currentPage]);

    const fetchOrders = useCallback(() => {
        const formattedStartDate = input.startDate
            ? setHours(setMinutes(new Date(input.startDate), 0), 0).toISOString()
            : null;
        const formattedEndDate = input.endDate
            ? setHours(setMinutes(new Date(input.endDate), 59), 23).toISOString()
            : null;

        const searchParams = {
            ...input,
            pageIndex: currentPage + 1,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        dispatch(getPageOrders(searchParams));
    }, [dispatch, input, currentPage]);

    const handleStatusClick = (status) => {
        setInput((prev) => ({ ...prev, orderStatus: status }));
    };

    const handleSearchChange = (event) => {
        setInput((prev) => ({ ...prev, freeTextSearch: event.target.value }));
    };

    const handleDateChange = (date, isStart) => {
        if (isStart) {
            setInput((prev) => ({ ...prev, startDate: date }));
        } else {
            setInput((prev) => ({ ...prev, endDate: date }));
        }
    };

    const handleCancelOrder = useCallback((orderId) => {
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
                dispatch(changeStatusOrder({ orderId, status: 'cancel', orderStatus: input.orderStatus }))
                    .then(() => {
                        Swal.fire('Thành công!', 'Đơn hàng đã được hủy.', 'success');
                        fetchOrders(); 
                    }).catch(() => {
                        Swal.fire('Lỗi!', 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
                    });
            }
        });
    }, [dispatch, input.orderStatus, fetchOrders]);


    const handleReceiveOrder = useCallback((orderId) => {
        dispatch(changeStatusOrder({ orderId, status: 'receive', orderStatus: input.orderStatus }))
            .then(() => {
                Swal.fire('Thành công!', 'Đơn hàng đã được nhận.', 'success');
                fetchOrders();
            }).catch(() => {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
            });
        }, [dispatch, input.orderStatus, fetchOrders]);



    const handleConfirmOrder = useCallback((orderId) => {
        dispatch(changeStatusOrder({ orderId, status: 'confirm', orderStatus: input.orderStatus }))
            .then(() => {
                Swal.fire('Thành công!', 'Đơn hàng đã được xác nhận.', 'success');
                fetchOrders(); 
            }).catch(() => {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
            });
    }, [dispatch, input.orderStatus, fetchOrders]);

    



   


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

    const handlePageClick = (event) => {
        setCurrentPage(event.selected); // Cập nhật currentPage khi trang thay đổi
    };

    const renderedOrders = useMemo(() => {
        return listAllOrder && listAllOrder.length > 0 ? (
            listAllOrder.map(order => (
                <div className='boc' key={order.trackingCode}>
                    <div className='info-order'>
                        <div className='user-top'>
                        <img src={order.user?.image} className='img-user'></img>
                        <div className='name-user'>{order.user.fullName}</div>
                        </div>
                   
                    <div className='code'>Mã đơn: {order.trackingCode}</div>
                    </div>
                    {order.orderItems.map((item, index) => (
                        <div key={index} className='product-info'>
                            <div className='product-info-name'>
                                <div className='up-info'>
                                    <img src={item.images[0]} className='product-image' alt={item.productName} />
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
                            <div className='btn-group'>
                                <div
                                    className='btn btn-danger cancel-button me-3'
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Hủy đơn
                                </div>
                                <div
                                    className='btn btn-success cancel-button'
                                    onClick={() => handleConfirmOrder(order.id)}
                                >
                                    Xác nhận
                                </div>
                            </div>
                        ) : order.orderStatus === 2 ? (
                            <div className='btn-group'>
                                <div
                                    className='btn btn-primary receive-button'
                                    onClick={() => handleReceiveOrder(order.id)}
                                >
                                    Đã nhận hàng
                                </div>
                            </div>
                        ) : <div></div>}

                        

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
    }, [listAllOrder]);

    return (
        <>
            <div className='manager-order'>
                <div className='bottom-down row mt-0 p-0'>
                    <li className='option'>
                        <div className={`${input.orderStatus === null ? 'active' : ''}`} onClick={() => handleStatusClick(null)}>Tất cả đơn hàng</div>
                        <div className={`${input.orderStatus === 1 ? 'active' : ''}`} onClick={() => handleStatusClick(1)}>Đang chờ xử lý</div>
                        <div className={`${input.orderStatus === 2 ? 'active' : ''}`} onClick={() => handleStatusClick(2)}>Đang giao hàng</div>
                        <div className={`${input.orderStatus === 3 ? 'active' : ''}`} onClick={() => handleStatusClick(3)}>Đã hoàn thành</div>
                        <div className={`${input.orderStatus === 4 ? 'active' : ''}`} onClick={() => handleStatusClick(4)}>Đã hủy</div>
                    </li>
                </div>
                <div className='row search'>
                    <div className='search-bar col-7'>
                        <input
                            type='text'
                            placeholder='Nhập tên sản phẩm, mã vận đơn để tìm kiếm đơn hàng'
                            value={input.freeTextSearch}
                            onChange={handleSearchChange}
                        />
                        <IoSearch className="search-icon" />
                    </div>
                    <div className="date">
                        <div className='title-date'>Lọc đơn theo ngày tạo</div>
                        <div className='filter-date'>
                            <div className="date-picker-container">
                                <DatePicker
                                    placeholderText="Ngày đầu"
                                    selected={input.startDate}
                                    onChange={(date) => handleDateChange(date, true)}
                                    selectsStart
                                    startDate={input.startDate}
                                    endDate={input.endDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    locale="vi"
                                />
                                <MdOutlineDateRange className="date-icon" />
                            </div>

                            <div className="date-picker-container">
                                <DatePicker
                                    selected={input.endDate}
                                    placeholderText="Ngày cuối"
                                    onChange={(date) => handleDateChange(date, false)}
                                    selectsEnd
                                    startDate={input.startDate}
                                    endDate={input.endDate}
                                    minDate={input.startDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    locale="vi"
                                />
                                <MdOutlineDateRange className="date-icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='listAllOrder'>
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
        </>
    );
};

export default Order;
