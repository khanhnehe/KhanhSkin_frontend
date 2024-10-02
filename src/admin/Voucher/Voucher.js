import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { setHours, setMinutes } from 'date-fns';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import 'bootstrap/scss/bootstrap.scss';
import 'react-datepicker/dist/react-datepicker.css';

import './Voucher.scss';


registerLocale('vi', vi);
setDefaultLocale('vi');


const Voucher = () => {
    const [voucherType, setVoucherType] = useState('discount');
    const [smartCode, setSmartCode] = useState(false);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 0));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 59), 23));


    return (
        <>
            <div className="voucher">
                <div className='top'>
                    <h2 className="mb-4">Thông tin cơ bản</h2>

                    <div className="mb-3">
                        <label className="form-label">Loại mã</label>
                        <div>
                            <span className="badge bg-primary">Voucher toàn Shop</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="programName" className="form-label">Tên chương trình giảm giá</label>
                        <input
                            type="text"
                            className="form-control"
                            id="programName"
                            maxLength={100}
                            placeholder="Tên Voucher sẽ không được hiển thị cho Người mua"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="voucherCode" className="form-label">Mã voucher</label>
                        <input
                            type="text"
                            className="form-control"
                            id="voucherCode"
                            maxLength={5}
                            placeholder="Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5 kí tự"
                        />
                    </div>

                    <div className="mb-3">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <label className="form-label">Thời gian sử dụng mã</label>
                            </div>
                            <div className="col ">
                                <div className="d-flex">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Giờ"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        className="form-control me-4"
                                        locale="vi"
                                    />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Giờ"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        className="form-control"
                                        locale="vi"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                

                    <h2 className="mb-4 mt-5">Thiết lập mã giảm giá</h2>
                    <div className="mb-3">
                        <label htmlFor="discountType" className="form-label">Loại giảm giá | Mức giảm</label>
                        <select className="form-select" id="discountType">
                            <option>Theo số tiền</option>
                            <option>Theo phần trăm</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="minOrderValue" className="form-label">Giá trị đơn hàng tối thiểu</label>
                        <input type="number" className="form-control" id="minOrderValue" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="maxUsage" className="form-label">Tổng lượt sử dụng tối đa</label>
                        <input type="number" className="form-control" id="maxUsage" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="maxPerUser" className="form-label">Lượt sử dụng tối đa/Người mua</label>
                        <input type="number" className="form-control" id="maxPerUser" value="1" readOnly />
                    </div>

                    <button type="submit" className="btn btn-primary">Tạo Voucher</button>
                </div>
            </div>
        </>

    );
};

export default Voucher;