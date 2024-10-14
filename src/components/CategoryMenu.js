import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategory, fetchAllType, fetchAllBrand } from '../store/action/adminThunks';
import './CategoryMenu.scss';
import { NavLink } from 'react-router-dom';

const CategoryMenu = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.root.admin.allCategory);
  const allTypes = useSelector((state) => state.root.admin.allType);
  const allBrands = useSelector((state) => state.root.admin.allBrand);
  const [activeBigCategory, setActiveBigCategory] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const loadData = useCallback(() => {
    dispatch(fetchAllCategory());
    dispatch(fetchAllType());
    dispatch(fetchAllBrand());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const bigCategoryMappings = {
    "Hàng mới về": ["ed67aee0-f9d1-417b-957a-08dce3c77d59"],
    "Chăm sóc da": [
      "effdd819-d362-417c-b3d2-08dcd7f0a942",
      "7b3e636b-b48c-4b8b-b3d3-08dcd7f0a942",
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ],
    "Trang điểm": [
      "6bcb3454-4c77-4941-9575-08dce3c77d59",
      "270cba15-650a-4d08-9576-08dce3c77d59",
      "7f016681-b422-4fa3-9577-08dce3c77d59"
    ],
    "Chăm sóc tóc": [
      "d45a7cff-3d93-40f0-c55a-08dce5041ce5",
      "8c200ce9-c5a0-44bc-c559-08dce5041ce5"
    ],
    "Chăm sóc sức khỏe": [
      "33660f92-8441-490c-c55b-08dce5041ce5",
      "8d35e6c0-ef7c-47c0-c55c-08dce5041ce5"
    ],
    "Tổng hợp": []
  };

  const getProductTypesForCategory = (category) => {
    if (!category.productTypeIds || !allTypes) return [];
    return category.productTypeIds.map((typeId) =>
      allTypes.find((type) => type.id === typeId)
    ).filter(Boolean);
  };

  // Memoize the result of categorizing categories by big categories
  const bigCategories = useMemo(() => {
    const categorizedItems = Object.entries(bigCategoryMappings).reduce((acc, [bigCategoryName, categoryIds]) => {
      acc[bigCategoryName] = allCategories.filter((cat) => categoryIds.includes(cat.id));
      return acc;
    }, {});

    const assignedCategoryIds = Object.values(bigCategoryMappings).flat();
    const remainingCategories = allCategories.filter(cat => !assignedCategoryIds.includes(cat.id));

    categorizedItems["Tổng hợp"] = remainingCategories;

    return categorizedItems;
  }, [allCategories]);

  // Memoize the result of generating brand rows
  const brandRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < allBrands.length; i += 3) {
      rows.push(allBrands.slice(i, i + 3));
    }
    return rows;
  }, [allBrands]);

  const handleBigCategoryHover = (bigCategoryName) => {
    setActiveBigCategory(bigCategoryName);
    setShowBrandDropdown(false);
  };

  const handleBigCategoryLeave = () => {
    setActiveBigCategory(null);
  };

  const handleBrandHover = () => {
    setShowBrandDropdown(true);
    setActiveBigCategory(null);
  };

  const handleBrandLeave = () => {
    setShowBrandDropdown(false);
  };

  const renderDropdownContent = (category) => {
    const productTypes = getProductTypesForCategory(category);

    return (
      <div className="category-content" key={category.id}>
        <NavLink to={`/category/${category.id}`}>
          {category.categoryName}
        </NavLink>
        <ul>
        {productTypes.map((type) => (
          <li className='a-type' key={type.id}>
            <NavLink to={`/type/${type.id}`}>
              {type?.typeName}
            </NavLink>
          </li>
        ))}
      </ul>
      </div>
    );
  };

  const renderBrandDropdown = () => {
    return (
      <div className="brand-dropdown">
        {brandRows.map((row, rowIndex) => (
          <div key={rowIndex} className="brand-row">
            {row.map((brand) => (
              <div key={brand.id} className="brand-item">
                <NavLink to={`/brand/${brand.id}`}>
                  <span>{brand.brandName}</span>
                </NavLink>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="category-menu">
      <nav className="specific">
        <ul className="specific-nav">
          {Object.entries(bigCategories).map(([bigCategoryName, categories]) => (
            <li
              key={bigCategoryName}
              className="nav-item"
              onMouseEnter={() => handleBigCategoryHover(bigCategoryName)}
              onMouseLeave={handleBigCategoryLeave}
            >
              <a className="nav-link" href="#!">{bigCategoryName}</a>
              {activeBigCategory === bigCategoryName && (
                <div className="dropdown-content">
                  {categories.map((category) => renderDropdownContent(category))}
                </div>
              )}
            </li>
          ))}
          <li
            className="nav-item"
            onMouseEnter={handleBrandHover}
            onMouseLeave={handleBrandLeave}
          >
            <a className="nav-link" href="#!">Thương hiệu</a>
            {showBrandDropdown && renderBrandDropdown()}
          </li>
          <li onClick={loadData}
            style={{ cursor: 'pointer', color: '#c31829' }}
          >
            oke
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default CategoryMenu;
