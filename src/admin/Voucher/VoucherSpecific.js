import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { setHours, setMinutes } from 'date-fns';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { fetchAllProduct } from '../../store/action/adminThunks';
import 'bootstrap/scss/bootstrap.scss';
import 'react-datepicker/dist/react-datepicker.css';
import "./VoucherSpecific.scss";
registerLocale('vi', vi);
setDefaultLocale('vi');

const VoucherSpecific = () => {
    const dispatch = useDispatch();
    const allProducts = useSelector((state) => state.root.admin.allProduct);

    const [voucherType, setVoucherType] = useState('discount');
    const [smartCode, setSmartCode] = useState(false);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 0));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 59), 23));
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAllProduct());
    }, [dispatch]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleProductSelection = (product) => {
        const isSelected = selectedProducts.some(p => p.id === product.id);
        if (isSelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleConfirmSelection = () => {
        handleCloseModal();
    };

    const filteredProducts = allProducts.filter(product =>
        product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
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
                    <div className="mb-3">
                        <label className="form-label">Sản phẩm được á dụng</label>
                        <Button variant="outline-primary" onClick={handleShowModal}>+ Thêm sản phẩm</Button>
                        {selectedProducts.length > 0 && (
                            <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Sản Phẩm</th>
                                    <th>Mã</th>
                                    <th>Giá</th>
                                    <th>Kho hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.productName}</td> {/* Use productName instead of name */}
                                        <td>{product.sku}</td>
                                        <td>{product.salePrice}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                        )}
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Chọn Sản Phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm sản phẩm"
                                className="mb-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Sản Phẩm</th>
                                        <th>Doanh số</th>
                                        <th>Giá</th>
                                        <th>Kho hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={() => handleProductSelection(product)}
                                                    checked={selectedProducts.some(p => p.id === product.id)}
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.sales}</td>
                                            <td>{product.price}</td>
                                            <td>{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Hủy
                            </Button>
                            <Button variant="primary" onClick={handleConfirmSelection}>
                                Xác nhận
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <button type="submit" className="btn btn-primary">Tạo Voucher</button>
                </div>
            </div>
        </>

    );
};

export default VoucherSpecific;