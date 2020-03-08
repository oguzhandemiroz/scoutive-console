import React, { Component } from "react";
import Table from "../../components/Employees/List.jsx";
import TotalSalary from "../../components/Employees/Charts/TotalSalary";
import DailyEmployee from "../../components/Employees/Charts/DailyEmployee";
import GeneralEmployee from "../../components/Employees/Charts/GeneralEmployee";
import { Link, withRouter } from "react-router-dom";
import { ListEmployees } from "../../services/Employee";
import { CheckPermissions } from "../../services/Others";
import NotPermissions from "../../components/NotActivate/NotPermissions";

class Employees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: []
        };
    }

    componentDidMount() {
        this.renderEmployeeList();
    }

    renderEmployeeList = () => {
        ListEmployees().then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) this.setState({ data: response.data });
                console.log(response.data);
            }
        });
    };

    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personeller</h1>
                    {CheckPermissions(["e_write"]) && (
                        <Link to="/app/persons/employees/add" className="btn btn-success ml-auto">
                            Personel Ekle
                        </Link>
                    )}
                </div>
                {CheckPermissions(["e_read"]) ? (
                    <>
                        <div className="row row-cards row-deck">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <DailyEmployee data={data.filter(x => x.status === 1)} />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <GeneralEmployee data={data.filter(x => x.status === 1)} />
                            </div>
                            {/* <div className="col-sm-6 col-md-4">
                                <TotalSalary data={data} />
                            </div> */}
                        </div>
                        <div className="row row-cards">
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Tüm Personeller</h3>
                                    </div>
                                    <div className="table-responsive employee-list">
                                        <Table history={this.props.history} />
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
                                Personelleri görüntülemek için yetkiniz bulunmamaktadır.
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

export default withRouter(Employees);
