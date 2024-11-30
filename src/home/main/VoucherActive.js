import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiDiscount1 } from "react-icons/ci";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container } from 'react-bootstrap';
import { getVouchersActive } from '../../store/action/userThunks';
import './VoucherActive.scss';

const VoucherActive = () => {
    const dispatch = useDispatch();
    const vouchers = useSelector((state) => state.root.user.voucherActive);

    useEffect(() => {
        dispatch(getVouchersActive());
    }, [dispatch]);

    return (
        <Container className="voucher-container">
            <h2 className="type-outstanding__title">MÃ GIẢM GIÁ</h2>
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlaySpeed={3000}
                centerMode={false}
                className=""
                containerClass="carousel-container"
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                pauseOnHover
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                    superLargeDesktop: {
                        breakpoint: { max: 4000, min: 1024 },
                        items: 4,
                    },
                    desktop: {
                        breakpoint: { max: 1024, min: 768 },
                        items: 3,
                    },
                    tablet: {
                        breakpoint: { max: 768, min: 464 },
                        items: 2,
                    },
                    mobile: {
                        breakpoint: { max: 464, min: 0 },
                        items: 1,
                    },
                }}
                showDots={false}
                sliderClass=""
                slidesToSlide={1}
                swipeable
            >
                {vouchers.map((voucher) => (
                    <div key={voucher.id} className="voucher-card me-1 ms-1">
                        <div className="card shadow-lg rounded-lg overflow-hidden">
                            <div className="ticket-perforations top">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="circle" />
                                ))}
                            </div>

                            <div className="ticket-perforations bottom">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="circle" />
                                ))}
                            </div>

                            <div className="voucher">
                                <div className="icon-container">
                                    <div className="icon-wrapper">
                                        <CiDiscount1 className="icon" />
                                    </div>
                                </div>
                                <div className="voucher-content ">
                                    <div className="">
                                        <div className="text-voucher">{voucher.programName}</div>
                                        <div className="text-child">
                                            {voucher.discountType === 1
                                                ? `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}₫`
                                                : `Giảm ${voucher.discountValue}%`}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-child">
                                            {voucher.minimumOrderValue &&
                                                `Đơn tối thiểu: ${voucher.minimumOrderValue.toLocaleString('vi-VN')}₫`}
                                        </div>
                                        <div className="text-child">Mã: {voucher.code} </div>
                                        <div className='text-child' >
                                            HSD: {new Date(voucher.endTime).toLocaleString('vi-VN')}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </Container>
    );
};

export default VoucherActive;
