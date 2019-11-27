import React, { Component } from "react";

export class Maintenance extends Component {
    componentDidMount() {
        const localeStorageList = ["sImage", "sName", "UID", "sID", "sType", "sPosition", "sBranch"];
        localeStorageList.map(el => localStorage.removeItem(el));
    }

    render() {
        return (
            <div className="page">
                <div className="page-content">
                    <div className="container text-center">
                        <div className="display-1 text-muted mb-5">
                            <i className="fa fa-server"></i>
                        </div>
                        <h1 className="h2 mb-3">Bakımdayız!</h1>
                        <p className="h4 text-muted font-weight-normal mb-7">
                            Köklü bir değişiklik ile geliyoruz. <br />
                            Bu süreç içerisinde sizlere hizmet veremeyeceğimiz için üzgünüz. <br />
                            Sabrınız için teşekkürler...
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
