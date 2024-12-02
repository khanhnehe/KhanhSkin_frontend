import React, { useEffect } from 'react';
import "./Widget.scss";
import { MdKeyboardArrowUp } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { PiNotepadDuotone } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { getRevenueProfitDay } from '../../store/action/adminThunks';
import { useDispatch, useSelector } from 'react-redux';

const Widget = () => {

    const dispatch = useDispatch();
    const dailyData = useSelector((state) => state.root.admin.revenueProfitD || []);


    useEffect(() => {
        dispatch(getRevenueProfitDay({ periodType: 1 })); // Fetch daily data
    }, [dispatch]);


    //doanh thu và lợi nhuận
    // Lấy dữ liệu doanh thu và lợi nhuận từ dailyData
    const revenue = dailyData[0]?.revenue || 0;
    const grossProfit = dailyData[0]?.grossProfit || 0;





    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };




    // danh sách các widget với giá trị cụ thể
    const widgetsData = [
        {
            title: "ĐƠN HÀNG",
            value: 1,
            isMoney: false,
            icon: (
                <PiNotepadDuotone
                    className="icon"
                    style={{
                        fontSize: "33px",
                        color: "goldenrod",
                        backgroundColor: "#daa52033",
                        borderRadius: "5px",
                    }}
                />
            ),
        },
        {
            title: "DOANH THU",
            value: revenue,
            isMoney: true,
            icon: (
                <IoWalletOutline
                    className="icon"
                    style={{
                        fontSize: "33px",
                        color: "green",
                        backgroundColor: "#00800033",
                        borderRadius: "5px",
                    }}
                />
            ),
        },
        {
            title: "NGƯỜI DÙNG",
            value: 0,
            isMoney: false,
            icon: (
                <IoPersonOutline
                    className="icon"
                    style={{
                        fontSize: "33px",
                        color: "purple",
                        backgroundColor: "#80008033",
                        borderRadius: "5px",
                    }}
                />
            ),
        },
        {
            title: "LỢI NHUẬN",
            value: grossProfit,
            isMoney: true,
            icon: (
                <IoIosInformationCircleOutline
                    className="icon"
                    style={{
                        fontSize: "33px",
                        color: "red",
                        backgroundColor: "#ff000033",
                        borderRadius: "5px",
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <div className="widget-layout">
                {widgetsData.map((widget, index) => (
                    <div className="widget" key={index}>
                        <div className="left">
                            <span className="title">{widget.title}</span>
                            <span className="counter">
                                {widget.isMoney
                                    ? formatCurrency(widget.value)
                                    : widget.value}
                            </span>
                            <span className="link">
                                {`Ngày: ${new Date().toLocaleDateString()}`}
                            </span>
                        </div>
                        <div className="right">{widget.icon}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Widget;
