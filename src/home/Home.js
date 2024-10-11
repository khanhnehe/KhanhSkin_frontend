import React from 'react';
import Sidler from './Sidler/Sidler';
import TypeOutStanding from './main/TypeOutStanding';
import CategoryProducts from './main/OutStanding/CategoryProducts';

const Home = () => {
  return (
    <>
      <Sidler />
      <TypeOutStanding />
      <CategoryProducts
        categoryId="3fa85f64-5717-4562-b3fc-2c963f66afa6" // Chuyển categoryId thành chuỗi
        title="CHĂM SÓC DA"
      />
      <CategoryProducts
        categoryId="6bcb3454-4c77-4941-9575-08dce3c77d59" // Chuyển categoryId thành chuỗi
        title="TRANG ĐIỂM"
      />
      <CategoryProducts
        categoryId="8c200ce9-c5a0-44bc-c559-08dce5041ce5" // Chuyển categoryId thành chuỗi
        title="CHĂM SÓC TÓC"
      />
    </>
  );
};

export default Home;
