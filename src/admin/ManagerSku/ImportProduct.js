import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getPageProduct, importProduct, getPageSupplier } from '../../store/action/adminThunks';
import './ImportProduct.scss';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const ImportProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allProducts = useSelector((state) => state.root.admin.allProduct);
    const allSupplier = useSelector((state) => state.root.admin.allSupplier);
    const totalRecor = useSelector((state) => state.root.admin.totalRecord);

    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [productPerPage] = useState(4);
    const [note, setNote] = useState('');
    const [supplierId, setSupplierId] = useState('');

    const searchParams = useMemo(() => ({
        freeTextSearch: searchTerm,
        pageIndex: currentPage + 1,
        pageSize: productPerPage,
        isAscending: true,
        brandIds: [],
        categoryIds: [],
        productTypeIds: [],
    }), [searchTerm, currentPage, productPerPage]);

    const fetchProducts = () => {
        dispatch(getPageProduct(searchParams));
        dispatch(getPageSupplier());
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleProductSelection = (product, variant = null) => {
        const itemId = variant ? `${product.id}-${variant.id}` : product.id;
        const isSelected = selectedItems.some(item => item.id === itemId);

        if (isSelected) {
            setSelectedItems(selectedItems.filter(item => item.id !== itemId));
        } else {
            setSelectedItems([
                ...selectedItems,
                {
                    id: itemId,
                    productId: product.id,
                    productVariantId: variant ? variant.id : null,
                    productName: product.productName,
                    productSKU: product.sku,
                    variantName: variant ? variant.nameVariant : null,
                    variantSKU: variant ? variant.skuVariant : null,
                    quantity: 0,
                    costPrice: 0,
                    image: variant ? variant.imageUrl : product.images[0],
                    variantQuantity: variant ? variant.quantityVariant : product.quantity,
                    supplierName: product.supplierName || 'Không có nhà cung cấp'
                }
            ]);
        }
    };

    const handleFieldChange = (id, field, value) => {
        setSelectedItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'costPrice') {
                        updatedItem.itemPrice = updatedItem.quantity * updatedItem.costPrice;
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleConfirmSelection = () => {
        setShowModal(false);
    };

    const handleAddInventory = () => {
        const inventoryData = selectedItems.map(item => ({
            productId: item.productId,
            productVariantId: item.productVariantId || null,
            quantity: item.quantity,
            costPrice: item.costPrice,
            note,
            supplierId
        }));

        dispatch(importProduct(inventoryData));
        navigate('/admin/admin-inventory');

    };


    // tính tổng nhập

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        dispatch(getPageSupplier({ pageIndex: 1, pageSize: 15, isAscending: true }));
    }, [dispatch]);

    return (
        <div className='import-product'>
            <div className="top">
                <h3 className='text-danger'>Nhập Hàng</h3>
                <form>
                    <div className="mb-3">
                        <label className="form-label me-3">Sản phẩm cần nhập</label>
                        {/* Phần các sản phẩm được nhập */}

                        <Button variant="outline-primary" onClick={handleShowModal}>+ Thêm sản phẩm</Button>
                        {selectedItems.length > 0 && (
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Sản Phẩm</th>
                                        <th>SKU</th>
                                        <th>Giá nhập</th>
                                        <th>Số lượng nhập</th>
                                        <th>Đơn giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItems.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                        alt="Product"
                                                    />
                                                )}
                                            </td>
                                            <td>{item.variantName ? `${item.productName} (${item.variantName})` : item.productName}</td>
                                            <td>{item.variantSKU || item.productSKU}</td>

                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={item.costPrice}
                                                    onChange={(e) => handleFieldChange(item.id, 'costPrice', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleFieldChange(item.id, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td>{(item.itemPrice ?? 0).toLocaleString()} đ</td>
                                        </tr>
                                    ))}
                                    {/* <tr>
                                        <td colSpan="5" className="text-right"><strong>Tổng cộng:</strong></td>
                                        <td><strong>{totalPrice.toLocaleString()} đ</strong></td>
                                    </tr> */}
                                </tbody>
                            </Table>
                        )}
                    </div>

                    {/* Phần thông tin nhập hàng */}
                    {/* <div className="mb-3">
                        <label>Ghi chú</label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div> */}


                    <div className="mb-3">
                        <label>Nhà cung cấp</label>
                        <Form.Select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                        >
                            <option value="">Chọn nhà cung cấp</option>
                            {allSupplier.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.supplierName}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal} size="lg" style={{zIndex: 10000}}>
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
                                        <th>SKU</th>
                                        <th>Kho hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts.map(product => (
                                        <React.Fragment key={product.id}>
                                            {product.variants && product.variants.length > 0 ? (
                                                product.variants.map(variant => (
                                                    <tr key={variant.id}>
                                                        <td>
                                                            <Form.Check
                                                                type="checkbox"
                                                                onChange={() => handleProductSelection(product, variant)}
                                                                checked={selectedItems.some(item => item.id === `${product.id}-${variant.id}`)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {variant.imageUrl && (
                                                                <img
                                                                    src={variant.imageUrl}
                                                                    style={{ width: '60px', height: '65px', marginRight: '10px' }}
                                                                    alt="Variant"
                                                                />
                                                            )}
                                                        </td>
                                                        <td>{`${product.productName} (${variant.nameVariant})`}</td>
                                                        <td>{variant.skuVariant}</td>
                                                        <td>{variant.quantityVariant}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            onChange={() => handleProductSelection(product)}
                                                            checked={selectedItems.some(item => item.id === product.id)}
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
                                                    <td>{product.sku}</td>
                                                    <td>{product.quantity}</td>
                                                </tr>
                                            )}

                                        </React.Fragment>

                                    ))}

                                </tbody>

                            </Table>
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                pageCount={Math.ceil(totalRecor / productPerPage)} marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
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

                    <Button onClick={handleAddInventory} className="btn btn-primary">
                        Xác nhận nhập
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ImportProduct;
