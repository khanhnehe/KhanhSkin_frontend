import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { postFilteredProducts, getProductCategory } from '../../../store/action/adminThunks'; // Import các action
import './CategoryPage.scss';
import bia from "../../../assets/poster/poster1.webp";
import { IoIosStar } from "react-icons/io";
import Rating from '@mui/material/Rating';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); // ID của category

    const [selectBrand, setSelectBrand] = useState([]); // Hỗ trợ nhiều Brand
    const [selectType, setSelectType] = useState([]); // Hỗ trợ nhiều ProductType
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000000 });
    const [filterOption, setFilterOption] = useState('createddate'); // Default sort option
    const [isAscending, setIsAscending] = useState(false); // Boolean for sorting order
    const [searchText, setSearchText] = useState(''); // Text tìm kiếm tự do

    // Lưu danh sách gốc của Brands và ProductTypes
    const [originalBrands, setOriginalBrands] = useState([]);
    const [originalTypes, setOriginalTypes] = useState([]);

    // Dữ liệu sản phẩm từ getFilterProducts
    const products = useSelector(state => state.root.admin.getFilterProducts);

    const categories = useSelector(state => state.root.admin.allCategory);
    const currentCategory = categories.find(category => category.id === id);
    const categoryName = currentCategory.categoryName;

    // Lấy danh sách sản phẩm và loại từ API
    useEffect(() => {
        if (id) {
            // Reset selected brands and types when switching category
            setSelectBrand([]);
            setSelectType([]);

            dispatch(getProductCategory(id)).then(response => {
                const categoryData = response.payload;
                if (categoryData && Array.isArray(categoryData)) {
                    const products = categoryData;

                    const brands = [];
                    const types = [];

                    products.forEach(product => {
                        if (product.brand && !brands.some(b => b.id === product.brand.id)) {
                            brands.push(product.brand);
                        }

                        if (Array.isArray(product.productTypes)) {
                            product.productTypes.forEach(type => {
                                if (!types.some(t => t.id === type.id)) {
                                    types.push(type);
                                }
                            });
                        }
                    });

                    setOriginalBrands(brands);
                    setOriginalTypes(types);
                } else {
                    console.error("API response is invalid or does not contain products.");
                }
            });
        }
    }, [id, dispatch]);

    // Thực hiện lọc sản phẩm khi người dùng chọn bộ lọc
    const loadFilteredProducts = () => {
        const filterData = {
            freeTextSearch: searchText || '',
            categoryIds: [id],
            productTypeIds: selectType,
            brandIds: selectBrand,
            minPrice: priceRange.minPrice,
            maxPrice: priceRange.maxPrice,
            sortBy: filterOption,
            isAscending: isAscending
        };

        dispatch(postFilteredProducts(filterData));
    };

    // Thực hiện lọc khi thay đổi filterOption
    useEffect(() => {
        if (id) {
            loadFilteredProducts();
        }
    }, [id, selectBrand, selectType, filterOption, isAscending]);

    // Xử lý thay đổi loại sản phẩm
    const handleTypeChange = (event) => {
        const { value } = event.target;
        setSelectType(prev =>
            prev.includes(value)
                ? prev.filter(t => t !== value)
                : [...prev, value]
        );
    };

    // Xử lý thay đổi thương hiệu
    const handleBrandChange = (event) => {
        const { value } = event.target;
        setSelectBrand(prev =>
            prev.includes(value)
                ? prev.filter(b => b !== value)
                : [...prev, value]
        );
    };

    const handlePriceChange = (e, field) => {
        setPriceRange({ ...priceRange, [field]: e.target.value });
    };

    const handleFilterOptionChange = (option) => {
        setFilterOption(option);
    };

    const handleSortAscending = () => {
        setIsAscending(true); // Sắp xếp tăng dần
        setFilterOption('price'); // Sắp xếp theo giá
    };

    const handleSortDescending = () => {
        setIsAscending(false); // Sắp xếp giảm dần
        setFilterOption('price'); // Sắp xếp theo giá
    };

    // Nút áp dụng để lọc sản phẩm theo khoảng giá
    const applyPriceFilter = () => {
        loadFilteredProducts();
    };

    return (
        <div className='container'>
            <div className='page-row row'>
                <div className='left col-3'>
                    <div className='top-left p-4'>
                        Danh mục
                        <div className='title-page' onClick={loadFilteredProducts}>
                            {categoryName}
                        </div>
                    </div>

                    {/* Lọc theo loại sản phẩm */}
                    <div className='bottom-left p-4'>
                        <p className='page-p'>Phân loại sản phẩm</p>
                        <div className='type-of-category'>
                            {originalTypes.length > 0 && originalTypes.map(type => (
                                <label key={type.id}>
                                    <input
                                        type="checkbox"
                                        value={type.id}
                                        onChange={handleTypeChange}
                                        checked={selectType.includes(type.id)}
                                    />
                                    <span>{type.typeName}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Lọc theo giá */}
                    <div className='option-price p-4'>
                        <div className='min'>
                            Giá tối thiểu (vnd)
                            <input
                                type="text"
                                value={priceRange.minPrice}
                                placeholder="Tối thiểu"
                                className="min-price"
                                onChange={(e) => handlePriceChange(e, 'minPrice')}
                            />
                        </div>
                        <div>
                            <div className="lineprice"></div>
                        </div>
                        <div className='max'>
                            Giá tối đa (vnd)
                            <input
                                type="text"
                                value={priceRange.maxPrice}
                                placeholder="Tối đa"
                                className="min-price"
                                onChange={(e) => handlePriceChange(e, 'maxPrice')}
                            />
                        </div>
                        <button onClick={applyPriceFilter} className="apply-button">ÁP DỤNG</button>
                    </div>

                    {/* Lọc theo thương hiệu */}
                    <div className='option-brand p-4'>
                        <p className='page-p'>Thương hiệu</p>
                        <div className='type-of-category'>
                            {originalBrands.length > 0 && originalBrands.map(brand => (
                                <label key={brand.id}>
                                    <input
                                        type="checkbox"
                                        value={brand.id}
                                        onChange={handleBrandChange}
                                        checked={selectBrand.includes(brand.id)} // Kiểm tra nếu đã chọn
                                    />
                                    <span>{brand.brandName}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                </div>

                <div className='right col-9'>
                    <div className='col'>
                        <div className='top row'>
                            <img src={bia} className='img-page' alt="Bia quảng cáo" />
                        </div>

                        {/* Tùy chọn sắp xếp sản phẩm */}
                        <div className='bottom-down row mt-0 p-0'>
                            <li className='option'>
                                <div
                                    className={filterOption === 'createddate' ? 'active' : ''}
                                    onClick={() => handleFilterOptionChange('createddate')}
                                >
                                    Mới nhất
                                </div>
                                <div
                                    className={filterOption === 'averagerating' ? 'active' : ''}
                                    onClick={() => handleFilterOptionChange('averagerating')}
                                >
                                    Đánh giá cao
                                </div>
                                <div
                                    className={filterOption === 'purchases' ? 'active' : ''}
                                    onClick={() => handleFilterOptionChange('purchases')}
                                >
                                    Bán chạy
                                </div>

                                <div
                                    className={filterOption === 'price' && isAscending ? 'active' : ''}
                                    onClick={handleSortAscending}
                                >
                                    Giá thấp
                                </div>
                                <div
                                    className={filterOption === 'price' && !isAscending ? 'active' : ''}
                                    onClick={handleSortDescending}
                                >
                                    Giá cao
                                </div>
                            </li>

                            {/* Hiển thị sản phẩm */}
                            <div className='grid-product'>
                                {products && products.length > 0 ? (
                                    products.map(product => (
                                        <NavLink to={`/product/${product.id}`} key={product.id}>
                                            <div className='custom-item'>
                                                <div className="image-container">
                                                    <div className='discount'>-{product.discount}%</div>
                                                    <img src={product.images[0]} className="product-image" alt="Product" />
                                                    <img src={product.images[1]} className="product-image hover-image" alt="Product" />
                                                </div>
                                                <div className='bottom'>
                                                    <div className="product-name">{product.productName}</div>
                                                    <div className='price'>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                                    <div className='sale'>{product.salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                                    <div className='bottom-two'>
                                                        <div className="rating">
                                                            <Rating
                                                                name={`rating-${product.id}`}
                                                                value={product.averageRating || 0} // Ensure rating exists
                                                                precision={0.5}
                                                                readOnly
                                                            />
                                                        </div>                                                        <div className='purchases'>{product.purchases} Đã bán </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    ))
                                ) : (
                                    <div>Không có sản phẩm nào</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
