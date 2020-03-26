import React, { Component } from "react";
import MaintenanceImg from "../assets/images/illustrations/Maintenance.svg";

export class Maintenance extends Component {
    render() {
        return (
            <div className="page">
                <div className="page-content">
                    <div className="container text-center">
                        <div className="px-5 pb-5">
                            <img src={MaintenanceImg} alt="Bakım" width="600" />
                        </div>
                        <h1 className="h3 mb-3">Servis şu an bakımda!</h1>
                        <p className="h5 text-muted font-weight-normal leading-tight mb-5">
                            Bu süreç içerisinde sizlere hizmet veremediğimiz için üzgünüz. <br />
                            Sabrınız için teşekkür ederiz...
                        </p>
                        <p className="h5 text-muted font-weight-normal leading-tight mb-7">
                            Dilerseniz bu süreçte bizi daha yakından tanıyabilir,
                            <br />
                            <a
                                className="text-gray"
                                href="https://scoutive.net"
                                style={{ textDecoration: "underline" }}
                                target="_blank">
                                harika özelliklerimize
                            </a>
                            &nbsp;göz atabilirsiniz! 😎
                        </p>

                        <div id="suggestions">
                            <a href="mailto:destek@scoutive.net">destek@scoutive.net</a>&nbsp;&mdash;&nbsp;
                            <a href="tel:+908508001234">0850 800 1234</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Maintenance;
