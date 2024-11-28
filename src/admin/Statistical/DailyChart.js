import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { getRevenueProfitDay } from '../../store/action/adminThunks';
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
  import "./chart.scss"

  ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
  
const DailyChart = () => {
  const dispatch = useDispatch();
  const dailyData = useSelector((state) =>state.root.admin.revenueProfitD|| []);

  useEffect(() => {
    dispatch(getRevenueProfitDay({ periodType: 1 })); // Fetch daily data
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
        label: 'Lợi nhuận gộp',
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
      title: { display: true, text: 'Doanh thu và lợi nhuận hàng ngày' },
    },
  };

  return (
    <div className="topchart">
      <h5 className="text-secondary">Thống kê theo ngày</h5>
      <Bar data={createChartData(dailyData)} options={options} />
    </div>
  );
};

export default DailyChart;
