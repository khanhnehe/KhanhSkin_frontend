import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Rating from '@mui/material/Rating';
import { getProductCategory } from '../../../store/action/adminThunks'; 
import { Container } from 'react-bootstrap';
import './SkinOutStanding.scss';

const CategoryProducts = ({ categoryId, title }) => { // Accept single categoryId
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]); // Store products

  // Load products for the single categoryId
  const loadProducts = () => {
    if (categoryId) { // Only if there's a valid categoryId
      dispatch(getProductCategory(categoryId))
        .then((response) => {
          const productData = response.payload;
          if (Array.isArray(productData)) {
            setProducts(productData);
          } else {
            setProducts([]); // Reset if no valid data
          }
        })
        .catch(() => {
          setProducts([]); // Reset in case of error
        });
    }
  };

  // Fetch products when categoryId changes
  useEffect(() => {
    loadProducts();
  }, [categoryId, dispatch]);

  const handleReload = () => {
    loadProducts(); // Reload on click
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  return (
    <Container className="skin-container">
      <div className="top-skin">
        <h2 className="skin-title" onClick={handleReload}>
          {title}
        </h2>
        <div className="more">Xem thêm...</div>
      </div>
      <div className="skin-item">
        <Carousel responsive={responsive}>
          {products.length > 0 ? (
            products.map((product) => (
              <NavLink to={`/product/${product.id}`} key={product.id}>
                <div key={product.id} className="custom-item">
                  <div className="image-container">
                    <div className="discount">-{product.discount}%</div>
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="product-image"
                    />
                    <img
                      src={product.images[1]}
                      alt={product.productName}
                      className="product-image hover-image"
                    />
                  </div>
                  <div className="bottom">
                    <div className="product-name">{product.productName}</div>
                    <div className="price">
                      {product.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </div>
                    <div className="sale">
                      {product.salePrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </div>
                    <div className="bottom-two">
                      <div className="rating">
                        <Rating
                          name={`rating-${product.id}`}
                          value={product.averageRating || 0} // Ensure rating exists
                          precision={0.5}
                          readOnly
                        />
                      </div>
                      <div className="purchases">
                        {product.purchases} Đã bán
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div>Không có sản phẩm nào</div>
          )}
        </Carousel>
      </div>
    </Container>
  );
};

export default CategoryProducts;
