import React, { Component } from "react";
import sms_activate_disabled from "../../assets/images/illustrations/sms_activate_disabled.svg";

export class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sid: localStorage.getItem("sID"),
            sname: localStorage.getItem("sName")
        };
    }

    render() {
        const { content } = this.props;
        const { sid, sname } = this.state;
        return (
            <div className="card">
                <div className="card-body text-center p-7">
                    <img src={sms_activate_disabled} alt="SMS Aktif Et" style={{ width: "370px" }} />
                    <h5 className="mt-5">Mesaj Servisi Aktif Değildir!</h5>
                    {content ? content() : null}
                    <a
                        href={`mailto:destek@scoutive.net?subject=[SMS Aktivasyonu] ${sname} (#${sid})&body=Sayın Yetkili,`}
                        className="btn btn-primary">
                        İletişime Geç ve Aktifleştir
                    </a>
                </div>
            </div>
        );
    }
}

export default Messages;
