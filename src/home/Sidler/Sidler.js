import React from 'react';
import './Sidler.scss';
import { Carousel } from 'react-bootstrap';
import poster1 from '../../assets/poster/poster4.webp';
import poster6 from '../../assets/poster/poster2.webp';
import poster2 from '../../assets/poster/poster3.webp';
import row1 from "../../assets/poster/bannermin1.webp"
import row2 from "../../assets/poster/bannermin2.webp"
// import row3 from "../../assets/banner-gaiam-gia.png"
import './Sidler.scss';

const Sidler = () => {
    return (
        <div className='Carousel-controller'>
            <div className='row'>
                <div className='col-9 edit-silde'>
                    <Carousel>
                        <Carousel.Item>
                            <img src={poster1} alt="First slide" className="carousel-img" />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={poster6} alt="Second slide" className="carousel-img" />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={poster2} alt="Third slide" className="carousel-img" />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
                <div className='col-3 left-side'>
                    <div className='row banner-row'>
                        <img src={row1} className="row-img" alt="Banner 1" />
                    </div>
                    <div className='row banner-row' style={{height: '240px'}}>
                        <img src={row2} className="row-img" alt="Banner 2" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Sidler;