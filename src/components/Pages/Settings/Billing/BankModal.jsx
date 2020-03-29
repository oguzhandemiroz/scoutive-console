import React, { Component } from "react";

export class BankModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bank: { detail: { account_name: "" } }
        };
    }

    componentDidMount() {
        const { bank } = this.props;
        this.setState({ bank: bank });
    }

    componentWillReceiveProps(nextProps) {
        const { bank } = this.props;

        if (bank !== nextProps.bank) {
            this.setState({ bank: nextProps.bank });
        }
    }

    render() {
        const { bank } = this.state;

        return (
            <div
                className="modal fade"
                id="bankModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="bankModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fa fa-university mr-1"></i> {bank.name}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body pt-0">
                            <div className="d-flex justify-content-center align-items-center p-5">
                                <img src={bank.logo} alt={bank.name} title={bank.name} height="70" />
                            </div>
                            <table className="table table-vcenter table-bordered table-hover mb-0">
                                <tbody>
                                    <tr>
                                        <th>Hesap Sahibi</th>
                                        <td>{bank.detail.owner_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Şube Bilgisi</th>
                                        <td>
                                            {bank.detail.branch_no} &mdash; {bank.detail.branch_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Hesap Numarası</th>
                                        <td>{bank.detail.account_no}</td>
                                    </tr>
                                    <tr>
                                        <th>IBAN</th>
                                        <td>{bank.detail.iban}</td>
                                    </tr>
                                    <tr>
                                        <th>Para Birimi</th>
                                        <td>{bank.detail.currency}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="alert card-alert m-0 alert-info alert-icon">
                            <i className="fe fe-info mr-2"></i>
                            <p>
                                <strong>Havale/EFT Hakkında Bilgilendirme</strong>
                            </p>
                            <p>
                                Havale, aynı bankanın hesapları arasında yapılan para transferi işlemidir. 7 gün, 24
                                saat boyunca havale işlemini yapabilirsiniz. Bu işlemler en geç 30 dakika içinde hesaba
                                aktarılır.
                            </p>
                            <p>
                                EFT, farklı bankalar aracılığıyla da yapılabilmektedir. EFT, yalnızca hafta içi mesai
                                saatleri içinde yapılmaktadır. Bu işlem saatleri ise bankalar tarafından belirlenerek,
                                bankadan bankaya değişiklik gösterebilir. EFT saatinden sonra yaptığınız bir para
                                transferi mesait saatileri içerisinde 08:00’den sonra hesaba ulaşacaktır.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BankModal;
