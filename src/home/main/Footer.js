import React, { Component } from 'react';
import './Footer.scss';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false,
        };
    }

    componentDidMount() { }



    render() {
        return (
            <>
                <footer className="footer bg-body-tertiary text-center mt-4">
                    <div className="container text-center text-md-start">
                        <div className="row">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto my-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    KHANH-SKIN
                                </h6>
                                <p>
                                    Here you can use rows and columns to organize your footer content. Lorem ipsum
                                    dolor sit amet, consectetur adipisicing elit.
                                </p>
                            </div>

                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 my-4">
                                <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                                <p><FaMapMarkerAlt /> 3/2, Ninh Kiều, Cần Thơ</p>
                                <p><MdEmail />  khanhpop@example.com
                                </p>
                                <p><FaPhoneVolume /> 0348 144 669</p>
                            </div>

                            <div className="social-media col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 my-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Theo dõi
                                </h6>
                                <p className="btn m-1  text-white facebook" >
                                    <FaFacebookF />
                                </p>

                                <p className="btn m-1  text-white twitter"  >
                                    <FaTwitter />
                                </p>

                                <p className="btn m-1  text-white google"  >
                                    <FaGoogle />
                                </p>

                                <p className="btn m-1  text-white instagram"  >
                                    <FaInstagram />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="copyright text-center p-3">
                        © 2023 Copyright: KHANH-SKIN
                    </div>
                </footer>
            </>


        );
    }
}

export default Footer;
