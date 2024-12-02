import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellingProducts } from '../../store/action/adminThunks';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Margin } from '@mui/icons-material';
import "../Statistical/chart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const SellingProducts = () => {
    const dispatch = useDispatch();

    const sellingProducts = useSelector((state) => state.root.admin.sellingProducts);

    useEffect(() => {
        dispatch(getSellingProducts());
    }, [dispatch]);

    const chartData = {
        labels: sellingProducts.map((product) => 
            product.productName.length > 20 
                ? product.productName.substring(0, 20) + '...' 
                : product.productName
        ), // Tên sản phẩm rút gọn
        datasets: [
            {
                label: 'Số lượng bán',
                data: sellingProducts.map((product) => product.purchases), // Số lượng bán
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FFCD56',
                    '#4D5360',
                    '#94D82D',
                    '#FFA07A',
                ],
                hoverOffset: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                // display: true,
                display: true,
                maxWidth: 10,
                position: 'bottom',
                // Marg: 3
                margin: {
                    top: 100,
                    // bottom: 10,
                },
                labels: {
                    // align: 'start', // Căn trái
                    // usePointStyle: false,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const productName = sellingProducts[context.dataIndex]?.productName;
                        return `${productName}: ${context.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div className="topchart">
                  <h5 className="text-secondary">Top 10 sản phẩm bán chạy nhất</h5>
            <div style={{ height: '476px', width: '372px',}}>
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SellingProducts;
