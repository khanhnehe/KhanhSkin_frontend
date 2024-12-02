import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPageVouchers } from '../../store/action/adminThunks';
import './Voucher.scss';
import { IoMdAdd } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import { setHours, setMinutes } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { MdOutlineDateRange } from "react-icons/md";
import { IoSearch } from 'react-icons/io5';

const Voucher = () => {
    const dispatch = useDispatch();

    const allVoucher = useSelector((state) => state.root.admin.allVouchers);
    const totalRecord = useSelector((state) => state.root.admin.totalRecord);

    const [statusFilter, setStatusFilter] = useState(""); // Trạng thái lọc (default: Tất cả)
    const [currentPage, setCurrentPage] = useState(0);
    const [input, setInput] = useState({
        freeTextSearch: '',
        pageIndex: currentPage + 1,
        pageSize: 5,
        voucherType: null,
        isAscending: true,
        startDate: null,
        endDate: null,
    });

    const fetchVouchers = useCallback(() => {
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
            status: statusFilter, // Truyền statusFilter vào API
        };

        console.log("Fetching vouchers with params:", searchParams); // Debug
        dispatch(getPageVouchers(searchParams));
    }, [dispatch, input, currentPage, statusFilter]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

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

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(0); // Reset lại trang khi đổi trạng thái
    };

    const pageCount = useMemo(() => Math.ceil(totalRecord / input.pageSize), [totalRecord, input.pageSize]);

    const memoizedVoucherRows = useMemo(() => {
        return allVoucher.map((voucher) => (
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
                            {voucher.productVouchers.map((item, index) => (
                                item.product && item.product.images ? (
                                    <div key={index}>
                                        <div className='info-product'>
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.productName || 'No name'}
                                                style={{ width: '50px', marginTop: '5px' }}
                                            />
                                            <div className='product-name'>{item.product.productName || 'No name'}</div>
                                        </div>
                                        <p style={{ fontWeight: "600" }}>Giá: {item.product.salePrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'N/A'}</p>
                                    </div>
                                ) : (
                                    <span key={index}>Invalid Product</span>
                                )
                            ))}
                        </div>
                    ) : (
                        <span>Toàn shop</span>
                    )}
                </td>
                {/* <td>
                    {voucher.isActive ? "Active" : "Inactive"}
                </td> */}
            </tr>
        ));
    }, [allVoucher]);

    return (
        <div className='voucher'>
            <div className='top mb-3'>
                <h3 className='text-danger'>Mã khuyến mãi</h3>
                <div className='links mb-2 mt-2'>
                    <Link to="/admin/voucher-global" className='p-2 btn btn-success me-2 '>Mã khuyến mãi Toàn shop <IoMdAdd /></Link>
                    <Link to="/admin/voucher-specific" className='p-2 btn text-light' style={{ backgroundColor: "#ff7f7f" }}>Mã khuyến mãi Sản phẩm cụ thể <IoMdAdd /></Link>
                </div>
            </div>
            <div className='row search'>
                <div className='search-bar col-7'>
                    <input
                        type='text'
                        placeholder='Nhập tên chương trình, mã code để tìm ...'
                        value={input.freeTextSearch}
                        onChange={handleSearchChange}
                    />
                    <IoSearch className="search-icon" />
                </div>
                <div className="date">
                    <div className='title-date'>Lọc mã giảm giá theo ngày tạo</div>
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

            <div className='top'>
                <div className='status-filter mb-4'>
                    <button
                        className={`btn ${statusFilter === "" ? "btn-primary" : "btn-outline-primary"} me-2`}
                        onClick={() => handleStatusFilterChange("")}
                    >
                        Tất cả
                    </button>
                    <button
                        className={`btn ${statusFilter === "active" ? "btn-success" : "btn-outline-success"} me-2`}
                        onClick={() => handleStatusFilterChange("active")}
                    >
                        Đang hoạt động
                    </button>
                    <button
                        className={`btn ${statusFilter === "inactive" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => handleStatusFilterChange("inactive")}
                    >
                        Đã hết hạn
                    </button>
                </div>
                <div className='voucher-table'>
                    {allVoucher && allVoucher.length > 0 ? (
                        <table className="table table-striped border">
                            <thead>
                                <tr>
                                    <th>Tên mã</th>
                                    <th>Code</th>
                                    <th>Giá trị giảm</th>
                                    <th>Giá đơn hàng tối thiểu</th>
                                    <th>Lượt dùng</th>
                                    <th>Ngày hết hạn</th>
                                    <th>Sản phẩm</th>
                                    {/* <th>Trạng thái</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {memoizedVoucherRows}
                            </tbody>
                        </table>
                    ) : (
                        <p>No vouchers available.</p>
                    )}
                </div>
            </div>
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default Voucher;
