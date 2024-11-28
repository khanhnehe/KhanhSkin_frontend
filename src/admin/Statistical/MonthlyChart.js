import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { getRevenueProfitMonth } from '../../store/action/adminThunks';
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

const MonthlyChart = () => {
  const dispatch = useDispatch();
  const monthlyData = useSelector((state) => state.root.admin.revenueProfitM);
  
  // Lấy tháng hiện tại
  const currentMonth = new Date().getMonth() + 1; // Tháng trong JavaScript tính từ 0-11
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Tháng mặc định

  useEffect(() => {
    // Fetch dữ liệu theo tháng hiện tại mặc định
    dispatch(getRevenueProfitMonth({ periodType: 2, selectedMonth }));
  }, [dispatch, selectedMonth]);

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
      title: { display: true, text: 'Doanh thu và lợi nhuận hàng tháng' },
    },
  };

  return (
    <div className="topchart">
      <h5 className="text-secondary">Thống kê theo tháng</h5>
      
      {/* Select tháng */}
      <div className=" col-4 mb-3">
        <label className="form-label">Chọn tháng</label>
        <select
          className="form-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {`Tháng ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Biểu đồ */}
      {monthlyData && monthlyData.length > 0 ? (
        <Bar data={createChartData(monthlyData)} options={options} />
      ) : (
        <p>No data available for the selected month.</p>
      )}
    </div>
  );
};

export default MonthlyChart;
