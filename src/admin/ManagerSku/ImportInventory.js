import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./importInventory.scss";
import { getPageInventoryLog, } from '../../store/action/adminThunks';
import { setHours, setMinutes } from 'date-fns';
import { IoSearch } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import { MdOutlineDateRange } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ImportInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allInventoryLogs = useSelector((state) => state.root.admin.allInventoryLog);
    const totalRecord = useSelector((state) => state.root.admin.totalRecord);

    const [currentPage, setCurrentPage] = useState(0);

    const [input, setInput] = useState({
        freeTextSearch: '',
        pageIndex: currentPage + 1,
        pageSize: 5,
        actionType: 1,
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
            pageSize: 5,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        dispatch(getPageInventoryLog(searchParams));
    }, [dispatch, input, currentPage]);

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
        setCurrentPage(event.selected); // Cập nhật currentPage khi trang thay đổi
    };

    const handleClick = () => {
        navigate('/admin/import-product');
    };

    useEffect(() => {
        fetchInventory();
    }, [input, currentPage]);



    return (
        <div className='importInventory'>
            <h3 className='text-danger'>Nhập hàng</h3>

            <div className='row search'>
                <div className='search-bar col-7'>
                    <input
                        type='text'
                        placeholder='Nhập tên sản phẩm, sku để tìm kiếm đơn hàng'
                        value={input.freeTextSearch}
                        onChange={handleSearchChange}
                    />
                    <IoSearch className="search-icon" />
                </div>
                <div className="date">
                    <div className='title-date'>Lọc theo ngày nhập</div>
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
            <div className='bot'>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        marginBottom: '15px',
                        left: '1060px',
                        '&:hover': {
                            backgroundColor: '#b22b38',
                        }
                    }}
                    endIcon={<IoMdAdd />}
                    onClick={handleClick}
                >
                    Nhập hàng
                </Button>
                {allInventoryLogs && allInventoryLogs.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã Nhập</TableCell>
                                    <TableCell>Thông Tin Sản Phẩm</TableCell>
                                    <TableCell>Mã SKU</TableCell>
                                    <TableCell>Giá Nhập</TableCell>
                                    <TableCell>Số Lượng Nhập</TableCell>
                                    <TableCell>Nhà Cung Cấp</TableCell>
                                    <TableCell>Tổng Giá</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allInventoryLogs.map((log) => (
                                    <TableRow key={log.id} className="product-row">
                                        <TableCell>{log.codeInventory || "Không có mã nhập"}</TableCell>

                                        <TableCell>
                                            <div className="product-top">
                                                <img
                                                    src={log.productImage}
                                                    alt={log.productName}
                                                    className="product-image"
                                                    style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                />
                                                <div className="productName">{log.productName}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    {log.variantImage ? (
                                                        <img
                                                            src={log.variantImage}
                                                            alt={log.variantName || ""}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                </div>
                                                <div className="col variantName">{log.variantName || ""}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{log.productSKU || ""}</div>
                                            <div className="variant-row">
                                                <div className="col">
                                                    <div style={{ width: '40px', height: '18px', objectFit: 'cover' }} />
                                                </div>
                                                <div className="col variantsku">{log.variantSKU || ""}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{log.costPrice?.toLocaleString() || '0'} đ</div>
                                        </TableCell>
                                        <TableCell>{log.quantityChange}</TableCell>
                                        <TableCell>{log.supplierName || ""}</TableCell>
                                        <TableCell>{log.totalPrice?.toLocaleString() || '0'} đ</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <p>Không có dữ liệu phiếu nhập hàng.</p>
                )}
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

export default ImportInventory;
