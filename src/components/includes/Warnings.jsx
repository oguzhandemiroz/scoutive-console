import React, { Component } from "react";
import { Link } from "react-router-dom";
import { GetSettings } from "../../services/School";
import _ from "lodash";
import { isMobile, isChrome } from "../../services/Others";

export class Warnings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: {}
        };
    }

    componentDidMount() {
        GetSettings().then(resSettings => {
            if (resSettings) {
                this.setState({
                    uid: localStorage.getItem("UID"),
                    settings: resSettings.settings,
                    isdesktop: !isMobile(),
                    ischrome: isChrome()
                });
            }
        });
    }

    renderWarning = () => {
        const { uid, settings, ischrome, isdesktop } = this.state;
        const warning_list = [
            {
                title: "Ayarlarını Tamamla!",
                text: () => (
                    <Link to={"/account/settings/general/" + uid} className="text-inherit">
                        Sistemin sağlıklı ve sorunsuz çalışabilmesi için ayarlarınızı tamamlamanız gerekiyor.
                    </Link>
                ),
                element: {
                    className: "alert card-alert alert-warning m-0 start-warning shadow-sm"
                },
                condition:
                    _(settings)
                        .filter(x => x === "-1")
                        .value().length > 0
            },
            {
                text: () => (
                    <>
                        <button type="button" class="close" data-dismiss="alert"></button>
                        <a href="https://www.google.com/intl/tr_tr/chrome/" target="_blank" className="text-inherit">
                            Sistemin daha stabil ve sorunsuz çalışabilmesi adına <b>Google Chrome</b> tarayıcısını
                            öneriyoruz. <u>İndirmek için tıkla</u>
                        </a>
                    </>
                ),
                element: {
                    className: "alert card-alert alert-danger alert-dismissible m-0 text-center"
                },
                condition: isdesktop && !ischrome
            }
        ];

        return (
            <>
                {warning_list.map((el, key) => {
                    if (!el.condition) return null;
                    return (
                        <div {...el.element} key={key.toString()}>
                            <div className="container">
                                {el.title ? (
                                    <>
                                        <strong>{el.title}</strong>&nbsp;&mdash;&nbsp;
                                    </>
                                ) : null}
                                {el.text()}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };
    render() {
        return this.renderWarning();
    }
}

export default Warnings;
