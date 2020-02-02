import React, { Component } from "react";
import {} from "react-router-dom";

class Footer extends Component {
    render() {
        return (
            <div id="footer">
                <footer className="footer">
                    <div className="container">
                        <div className="row align-items-center flex-row-reverse">
                            <div className="col-lg-auto col-sm-12 ml-lg-auto text-center">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item">
                                        v1.0.0 {/* <span className="badge badge-secondary ml-1">Beta</span> */}
                                    </li>
                                    <li className="list-inline-item">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://scoutive.net/ScoutivePrivacyPolicy.pdf">
                                            Gizlilik Sözleşmesi
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a target="_blank" rel="noopener noreferrer" href="https://scoutive.net/#faq">
                                            S.S.S
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-lg-auto mt-3 mt-lg-0 text-center">
                                Copyright © 2019{" "}
                                <a target="_blank" rel="noopener noreferrer" href="https://scoutive.net">
                                    Scoutive
                                </a>
                                . Tüm hakları saklıdır.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footer;
