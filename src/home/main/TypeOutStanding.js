import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchAllType } from '../../store/action/adminThunks';
import './TypeOutStanding.scss';
import { NavLink } from 'react-router-dom';

const TypeOutStanding = () => {
  const dispatch = useDispatch();
  const allTypes = useSelector((state) => state.root.admin.allType);
  const [limitedTypes, setLimitedTypes] = useState([]);

  useEffect(() => {
    dispatch(fetchAllType());
  }, [dispatch]);

  useEffect(() => {
    if (allTypes.length > 0) {
      setLimitedTypes(allTypes.slice(0, 14));
    }
  }, [allTypes]);

  const getImagePath = (index) => {
    return require(`../../assets/Type/home_category_${index + 1}_medium.webp`);
  };

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const rows = chunkArray(limitedTypes, 7);

  return (
    <Container className="type-outstanding">
      <h2 className="type-outstanding__title">DANH MỤC HOT</h2>
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex} className="justify-content-center">
          {row.map((type, index) => (
            <Col key={type.id} xs={6} sm={4} md={3} lg={2} xl={1} className="type-outstanding__item">
              <div className="type-outstanding__image-wrapper">
                <img
                  src={getImagePath(rowIndex * 7 + index)}
                  alt={type.typeName}
                  className="type-outstanding__image"
                />
              </div>
              <NavLink to={`/type/${type.id}`}>
                <span className="type-outstanding__name">{type.typeName}</span>
              </NavLink>

            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default TypeOutStanding;