import React, { Component } from 'react';
import Navbar from '../home/Navbar/Navbar';
import Sidebar from '../home/Sidebar/Sidebar';
import './HomeAdmin.scss'
// import Widget from '../../admin/Widget/Widget';
// import ChartWeek from "../../components/chart/ChartWeek";
// import Chart_Daily from "../../components/chart/Chart_Daily";
// import Chart_Month from "../../components/chart/Chart_Month";
// import TopSellingChart from '../../components/chart/TopSellingChart';
const HomeAdmin = () => {
    return (
        <>
            <div className='home'>
                {/* <Sidebar /> */}
                <div className='homeContainer'>
                    {/* <Navbar /> */}
                    {/* <div className='widgets'>
                        <Widget type='order' />
                        <Widget type='revenue' />
                        <Widget type='user' />
                        <Widget type='out_stock' />
                    </div> */}
                    <div className='charts'>
                        {/* <Chart_Daily />
                        <ChartWeek /> */}
                    </div>
                    <div className='list-container'>

                        <div></div>
                        {/* <Chart_Month />
                        <TopSellingChart/> */}
                    </div>
                </div>
            </div>
        </>
    )

}

export default HomeAdmin;
