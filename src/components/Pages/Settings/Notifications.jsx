import React, {Component} from "react";

const list = [
    {
        text: "Sistem güncellemelerini bildir",
        description: `<p class='mb-0'>Sistem üzerindeki yenilikleri, gelişmeleri ve sorun gidermeleri haberdar eder.</p>`,
        sms: "update-sms",
        email: "update-email"
    },
    {
        text: "Şüpheli giriş bildir",
        description: `<p>Güvenli Bölge dışı giriş işlemleri yapıldığında uyarır.</p>
            <p>Bu ayarın çalışması için Güvenli Bölge<span class='text-red'>*</span> ayarı yapılmalıdır.</p>
            <p class='mb-0'><span class='text-red'>*</span>: Genel &mdash; "Güvenli Bölge" alanından ayarlanabilir. </p>`,
        sms: "doubt-sms",
        email: "doubt-email"
    }
];

export class Notifications extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Bildirimler</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table card-table table-vcenter">
                            <thead>
                                <tr>
                                    <th className="pl-2">Açıklama</th>
                                    <th className="w-2 text-center">Email</th>
                                    <th className="w-2 pr-2 text-center">SMS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((el, key) => {
                                    return (
                                        <tr key={key.toString()}>
                                            <td className="pl-2">
                                                {el.text}
                                                <span className="col-auto align-self-center">
                                                    <span
                                                        className="form-help"
                                                        data-toggle="popover"
                                                        data-content={el.description}>
                                                        ?
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="w-2 text-center">
                                                <label className="pl-0 custom-switch">
                                                    <input
                                                        type="checkbox"
                                                        name={el.email}
                                                        className="custom-switch-input"
                                                    />
                                                    <span className="custom-switch-indicator"></span>
                                                </label>
                                            </td>
                                            <td className="w-2 pr-2 text-center">
                                                <label className="pl-0 custom-switch">
                                                    <input
                                                        type="checkbox"
                                                        name={el.sms}
                                                        className="custom-switch-input"
                                                    />
                                                    <span className="custom-switch-indicator"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer text-right">
                    <button type="submit" className={`btn btn-primary`}>
                        Kaydet
                    </button>
                </div>
            </div>
        );
    }
}

export default Notifications;
