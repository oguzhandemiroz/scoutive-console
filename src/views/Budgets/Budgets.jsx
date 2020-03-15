import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import List from "../../components/Budgets/List";
import TotalCaseAmount from "../../components/Budgets/Charts/TotalCaseAmount";
import TotalBankAmount from "../../components/Budgets/Charts/TotalBankAmount";
import TotalAmount from "../../components/Budgets/Charts/TotalAmount";
import TransferModal from "../../components/Budgets/Modals/TransferModal";
import { ListBudgets } from "../../services/Budget";
import { CheckPermissions } from "../../services/Others";
import NotPermissions from "../../components/NotActivate/NotPermissions";

export class Budgets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: []
        };
    }

    componentDidMount() {
        this.renderBudgetList();
    }

    renderBudgetList = () => {
        const { uid } = this.state;
        ListBudgets(uid).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) this.setState({ data: response.data });
            }
        });
    };

    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Kasa ve Bankalar</h1>{" "}
                    <div className="ml-auto">
                        {CheckPermissions(["a_write", "a_read"]) && (
                            <>
                                <TransferModal bid={0} history={this.props.history} />
                                <button
                                    data-toggle="modal"
                                    data-target="#transferModal"
                                    className="btn btn-sm btn-icon btn-azure mr-2">
                                    <i className="fa fa-exchange-alt mr-1" />
                                    Hesaplar Arası Transfer
                                </button>{" "}
                            </>
                        )}
                        {CheckPermissions(["a_write"]) && (
                            <Link to="/app/budgets/add" className="btn btn-sm btn-success">
                                Yeni Oluştur
                            </Link>
                        )}
                    </div>
                </div>
                {CheckPermissions(["a_read"]) ? (
                    <>
                        <div className="row row-cards">
                            <div className="col-lg-4 col-sm-12">
                                <TotalCaseAmount data={data} />
                            </div>

                            <div className="col-lg-4 col-sm-12">
                                <TotalBankAmount data={data} />
                            </div>

                            <div className="col-lg-4 col-sm-12">
                                <TotalAmount data={data} />
                            </div>
                        </div>

                        <div className="row row-cards">
                            <div className="col">
                                <div className="card">
                                    <div className="table-responsive employee-list">
                                        <List history={this.props.history} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <NotPermissions
                        title="Üzgünüz 😣"
                        imageAlt="Yetersiz Yetki"
                        content={() => (
                            <p className="text-muted text-center">
                                Kasa ve Bankayı görüntülemek için yetkiniz bulunmamaktadır.
                                <br />
                                Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                geçiniz...
                            </p>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default withRouter(Budgets);
