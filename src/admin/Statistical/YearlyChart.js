import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { getRevenueProfitY } from '../../store/action/adminThunks';
import "./chart.scss"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

  
const YearlyChart = () => {
  const dispatch = useDispatch();
  const yearlyData = useSelector((state) => state.root.admin.revenueProfitY);

  useEffect(() => {
    dispatch(getRevenueProfitY({ periodType: 3 })); // Fetch yearly data
  }, [dispatch]);

  const createChartData = (data) => ({
    labels: data.map((item) => item.timePeriod),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((item) => item.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Lơi nhuận gộp',
        data: data.map((item) => item.grossProfit),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu và lợi nhuận của năm' },
    },
  };

  return (
    <div className="topchart">
      <h5 className="text-secondary">Thống kê theo năm</h5>
      <Line data={createChartData(yearlyData)} options={options} />
    </div>
  );
};

export default YearlyChart;
