import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { setHours, setMinutes } from 'date-fns';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import 'bootstrap/scss/bootstrap.scss';
import 'react-datepicker/dist/react-datepicker.css';
import './VoucherGlobal.scss';
import { useDispatch } from 'react-redux';
import { createdVoucher } from '../../store/action/adminThunks';

registerLocale('vi', vi);
setDefaultLocale('vi');

const VoucherGlobal = () => {
    const dispatch = useDispatch();
    const [programName, setProgramName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [minimumOrderValue, setMinimumOrderValue] = useState(0);
    const [discountType, setDiscountType] = useState(1); // Mặc định là AmountMoney
    const [discountValue, setDiscountValue] = useState(0); // Giá trị giảm giá
    const [totalUses, setTotalUses] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 0));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 59), 23));

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            programName,
            code,
            description,
            voucherType: 1, // Global voucher
            discountType, // Sử dụng discountType cho loại giảm giá
            minimumOrderValue,
            endTime: endDate,
            startTime: startDate,
            discountValue, // Giá trị giảm giá
            totalUses,
            usesCount: 0,
            isActive
        };

        dispatch(createdVoucher(data))
            .then(() => {
                setProgramName('');
                setCode('');
                setDescription('');
                setDiscountType(1);
                setMinimumOrderValue(0);
                setDiscountValue(0);
                setTotalUses(0);
                setIsActive(true);
                setStartDate(setHours(setMinutes(new Date(), 0), 0));
                setEndDate(setHours(setMinutes(new Date(), 59), 23));
            })
            .catch((error) => {
                console.error("Failed to create voucher:", error);
            });
    };

    return (
        <div className="voucher">
            <div className="mb-3">
                <div>
                    <div style={{ fontSize: "18px"}} className="badge bg-success">Mã giảm cho toàn Shop</div>
                </div>
            </div>
            <div className="">
                <form onSubmit={handleSubmit}>
                    <div className='top mb-3'>
                    <h2 className="mb-4">Thông tin cơ bản</h2>
                    
                    <div className="mb-3">
                        <label className="form-label">Tên chương trình giảm giá</label>
                        <input
                            type="text"
                            className="form-control"
                            maxLength={100}
                            value={programName}
                            onChange={(e) => setProgramName(e.target.value)}
                            placeholder="Tên Voucher"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mã voucher</label>
                        <input
                            type="text"
                            className="form-control"
                            maxLength={5}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Chỉ nhập các kí tự A-Z, 0-9; tối đa 5 kí tự"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về voucher"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Thời gian sử dụng mã</label>
                        <div className="d-flex me-3">
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

                    <div className='top'>
                    <h2 className="mb-4 mt-5">Thiết lập mã giảm giá</h2>

                    <div className="mb-3">
                        <label className="form-label">Loại giảm giá</label>
                        <select
                            className="form-select"
                            value={discountType}
                            onChange={(e) => setDiscountType(Number(e.target.value))}
                        >
                            <option value="1">Theo số tiền</option> {/* AmountMoney */}
                            <option value="2">Theo phần trăm</option> {/* Percentage */}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giá trị đơn hàng tối thiểu</label>
                        <input
                            type="number"
                            className="form-control"
                            value={minimumOrderValue}
                            onChange={(e) => setMinimumOrderValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giá trị giảm giá</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tổng lượt sử dụng tối đa</label>
                        <input
                            type="number"
                            className="form-control"
                            value={totalUses}
                            onChange={(e) => setTotalUses(Number(e.target.value))}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Tạo Voucher</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoucherGlobal;
