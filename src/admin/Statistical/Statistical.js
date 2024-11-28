import React from 'react';
import DailyChart from './DailyChart';
import MonthlyChart from './MonthlyChart';
import YearlyChart from './YearlyChart';
import './Statistical.scss';

const Statistical = () => {
  return (
    <div className="statistical mt-4">
      <h2 className="text-danger mb-3">Thống kê</h2>
      <div className=''>

      <div className="row">
        <div className="col-6">
          <DailyChart />
        </div>
        
        <div className="col-6">
          <YearlyChart />
        </div>
      </div>
      <div className=" mt-4 col">
          <MonthlyChart />
        </div>
      </div>
     
    </div>
  );
};

export default Statistical;
