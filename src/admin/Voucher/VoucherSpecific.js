import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { setHours, setMinutes } from 'date-fns';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getPageProduct, createdVoucher } from '../../store/action/adminThunks';
import 'bootstrap/scss/bootstrap.scss';
import 'react-datepicker/dist/react-datepicker.css';
import "./VoucherSpecific.scss";

registerLocale('vi', vi);
setDefaultLocale('vi');

const VoucherSpecific = () => {
    const dispatch = useDispatch();
    const allProducts = useSelector((state) => state.root.admin.allProduct);

    const [programName, setProgramName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState(1); // Mặc định theo số tiền
    const [minimumOrderValue, setMinimumOrderValue] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [totalUses, setTotalUses] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 0));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 59), 23));

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [productPerPage] = useState(5);

    const searchParams = useMemo(() => ({
        freeTextSearch: searchTerm,
        pageIndex: currentPage + 1,
        pageSize: productPerPage,
        isAscending: true,
        brandIds: [],
        categoryIds: [],
        productTypeIds: [],
    }), [searchTerm, currentPage, productPerPage]);

    // Hàm fetchProducts để thực thi tìm kiếm
    const fetchProducts = () => {
        dispatch(getPageProduct(searchParams));
    };


    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        fetchProducts();
    };

    // Gọi fetchProducts khi component được mount lần đầu tiên
    useEffect(() => {
        fetchProducts();  // Gọi fetchProducts ngay khi component được render
    }, [searchParams]);  // useEffect sẽ gọi lại khi searchParams thay đổi


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

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            programName,
            code,
            description,
            voucherType: 2, // Specific voucher
            discountType,
            minimumOrderValue,
            endTime: endDate,
            startTime: startDate,
            discountValue,
            totalUses,
            usesCount: 0,
            isActive,
            productVouchers: selectedProducts.map(product => ({
                id: product.id,
                productId: product.id
            }))
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
                setSelectedProducts([]);
            })
            .catch((error) => {
                console.error("Failed to create voucher:", error);
            });
    };


    return (
        <div className="voucher">
            <div className="top">
                <form onSubmit={handleSubmit}>
                    <h2 className="mb-4">Thông tin cơ bản</h2>
                    <div className="mb-3">
                        <label className="form-label">Loại mã</label>
                        <div>
                            <span className="badge bg-primary">Voucher cho sản phẩm cụ thể</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="programName" className="form-label">Tên chương trình giảm giá</label>
                        <input
                            type="text"
                            className="form-control"
                            id="programName"
                            maxLength={100}
                            value={programName}
                            onChange={(e) => setProgramName(e.target.value)}
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
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5 kí tự"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Thời gian sử dụng mã</label>
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

                    <h2 className="mb-4 mt-5">Thiết lập mã giảm giá</h2>
                    <div className="mb-3">
                        <label htmlFor="discountType" className="form-label">Loại giảm giá | Mức giảm</label>
                        <select
                            className="form-select"
                            id="discountType"
                            value={discountType}
                            onChange={(e) => setDiscountType(Number(e.target.value))}
                        >
                            <option value="1">Theo số tiền</option>
                            <option value="2">Theo phần trăm</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="minOrderValue" className="form-label">Giá trị đơn hàng tối thiểu</label>
                        <input
                            type="number"
                            className="form-control"
                            id="minOrderValue"
                            value={minimumOrderValue}
                            onChange={(e) => setMinimumOrderValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="discountValue" className="form-label">Giá trị giảm giá</label>
                        <input
                            type="number"
                            className="form-control"
                            id="discountValue"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="totalUses" className="form-label">Tổng lượt sử dụng tối đa</label>
                        <input
                            type="number"
                            className="form-control"
                            id="totalUses"
                            value={totalUses}
                            onChange={(e) => setTotalUses(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sản phẩm được áp dụng</label>
                        <Button variant="outline-primary" onClick={handleShowModal}>+ Thêm sản phẩm</Button>
                        {selectedProducts.length > 0 && (
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Sản Phẩm</th>
                                        <th>Mã</th>
                                        <th>Giá</th>
                                        <th>Kho hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                {product.images && (
                                                    <img
                                                        src={product.images[0]}
                                                        style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                        alt="Product"
                                                    />
                                                )}
                                            </td>
                                            <td>{product.productName}</td>
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
                                        <th>Hình ảnh</th>
                                        <th>Sản Phẩm</th>
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
                                            <td>
                                                {product.images && (
                                                    <img
                                                        src={product.images[0]}
                                                        style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                        alt="Product"
                                                    />
                                                )}
                                            </td>
                                            <td>{product.productName}</td>
                                            <td>
                                                <div className='col'>
                                                    <div className='row'>
                                                        {product.sales}
                                                    </div>
                                                    <div className='row'>
                                                        {product.salePrice}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{product.quantity}</td>
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
                </form>
            </div>
        </div>
    );
};

export default VoucherSpecific;
