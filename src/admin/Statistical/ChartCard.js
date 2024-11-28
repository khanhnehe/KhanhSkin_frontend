import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const ChartCard = ({ title, chartType, data, options }) => {
  return (
    <div className="chart-card mb-4">
      <h5 className="text-secondary">{title}</h5>
      {chartType === 'Bar' && <Bar data={data} options={options} />}
      {chartType === 'Line' && <Line data={data} options={options} />}
    </div>
  );
};

export default ChartCard;
