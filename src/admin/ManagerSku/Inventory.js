import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./Inventory.scss";
import { getPageInventoryLog } from '../../store/action/adminThunks';
import { setHours, setMinutes } from 'date-fns';
import { IoSearch } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { MdOutlineDateRange } from "react-icons/md";
import ReactPaginate from 'react-paginate';

const Inventory = () => {
    const dispatch = useDispatch();
    const allInventoryLogs = useSelector((state) => state.root.admin.allInventoryLog);
    const totalRecord = useSelector((state) => state.root.admin.totalRecord);

    const [currentPage, setCurrentPage] = useState(0);
    const [input, setInput] = useState({
        freeTextSearch: '',
        pageIndex: currentPage + 1,
        pageSize: 5,
        isAscending: true,
        startDate: null,
        endDate: null,
    });

    const fetchInventory = useCallback(() => {
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

        dispatch(getPageInventoryLog(searchParams));
    }, [dispatch, input, currentPage]);

    const handleSearchChange = (event) => {
        setInput((prev) => ({ ...prev, freeTextSearch: event.target.value }));
    };

    const handleDateChange = (date, isStart) => {
        setInput((prev) => (isStart ? { ...prev, startDate: date } : { ...prev, endDate: date }));
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    useEffect(() => {
        fetchInventory();
    }, [input, currentPage]);

    return (
        <div className='Inventory'>
            <h3 className='text-danger'>Lịch sử xuất nhập</h3>

            <div className='row search'>
                <div className='search-bar col-7'>
                    <input
                        type='text'
                        placeholder='Nhập tên sản phẩm, SKU để tìm ...'
                        value={input.freeTextSearch}
                        onChange={handleSearchChange}
                    />
                    <IoSearch className="search-icon" />
                </div>
                <div className="date">
                    <div className='title-date'>Lọc theo ngày nhập</div>
                    <div className='filter-date'>
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

            <div className='inventory-list'>
                {allInventoryLogs?.map((log, index) => (
                    <div
                        key={log.id}
                        className={`inventory-item ${log.actionType === 1 ? 'import' : log.actionType === 2 ? 'export' : 'cancel'}`}
                    >
                        <p><strong>{log.productName}</strong> - {log.variantName || 'Không có biến thể'}</p>
                        <p>Số Lượng: {log.quantityChange}</p>
                        <p>Ngày: {new Date(log.transactionDate).toLocaleDateString()}</p>
                        <p>
                            Loại hoạt động:
                            {log.actionType === 1
                                ? ' Nhập'
                                : log.actionType === 2
                                    ? ' Xuất'
                                    : ' Đơn hủy'}
                        </p>
                        {log.supplierName && <p>Nhà Cung Cấp: {log.supplierName}</p>}
                    </div>
                ))}
            </div>



            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalRecord / input.pageSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default Inventory;
