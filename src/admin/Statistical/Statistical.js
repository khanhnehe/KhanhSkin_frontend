import React from 'react';
import DailyChart from './DailyChart';
import MonthlyChart from './MonthlyChart';
import YearlyChart from './YearlyChart';
import './Statistical.scss';
import Widget from '../Widget/Widget';
import SellingProducts from '../Widget/SellingProducts';
const Statistical = () => {
  return (
    <div className="statistical mt-2">
      {/* <h2 className="text-danger mb-3">Thống kê</h2> */}
      <div className=''>
        <Widget />

        <div className="row">
          <div className="col-6">
            <DailyChart />
          </div>

          <div className="col-6">
            <YearlyChart />
          </div>
        </div>
        <div className='row mt-4'>
          <div className=" col-8">
            <MonthlyChart />
          </div>
          <div className="col-4">

            <SellingProducts />
            </div>

          </div>

        </div>

      </div>
      );
};

      export default Statistical;
