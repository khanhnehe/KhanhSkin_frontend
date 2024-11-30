import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import { postFilteredProducts, getProductTypes } from '../../../store/action/adminThunks'; // Import các action
import '../CategoryPage/CategoryPage.scss';
import bia from "../../../assets/poster/showsliderimg1.png";
import { IoIosStar } from "react-icons/io";
import Rating from '@mui/material/Rating';

const TypePage = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); 

    const [selectBrand, setSelectBrand] = useState([]); // Hỗ trợ nhiều Brand
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000000 });
    const [filterOption, setFilterOption] = useState('createddate');
    const [isAscending, setIsAscending] = useState(false); 
    const [searchText, setSearchText] = useState(''); 

    // Lưu danh sách gốc
    const [originalBrands, setOriginalBrands] = useState([]);

    const products = useSelector(state => state.root.admin.getFilterProducts);

    const types = useSelector(state => state.root.admin.allType);
    const currentType = types.find(type => type.id === id);
    const typeName = currentType.typeName;



    useEffect(() => {
        if (id) {
            setSelectBrand([]);

            dispatch(getProductTypes(id)).then(response => {
                const typeData = response.payload;
                if (typeData && Array.isArray(typeData)) {
                    const products = typeData;

                    const brands = [];

                    products.forEach(product => {
                        if (product.brand && !brands.some(b => b.id === product.brand.id)) {
                            brands.push(product.brand);
                        }



                    });

                    setOriginalBrands(brands);
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
            brandIds: selectBrand,
            productTypeIds: [id],
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
    }, [id, selectBrand, filterOption, isAscending]);



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
                        Phân loại sản phẩm
                        <div className='title-page' onClick={loadFilteredProducts}>
                            {typeName}
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

export default TypePage;
