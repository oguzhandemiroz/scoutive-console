import React, {Component} from "react";
import {DailyEmployee, GeneralEmployee, Table} from "../../components/Employees/employees";

class Employees extends Component {
    componentDidMount() {
        console.log(this.props.location.state);
    }
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personeller</h1>
                    <button className="btn btn-sm btn-success ml-3">Personel Ekle</button>
                </div>
                <div className="row row-cards">
                    <DailyEmployee />
                    <GeneralEmployee />
                    <div className="col-sm-6 col-md-4">
                        <div className="card">
                            <div className="card-body p-3 text-center">
                                <div className="h5">Toplam Maaş Gideri</div>
                                <div
                                    style={{fontSize: "2.35rem"}}
                                    className="display-4 font-weight-bold mb-3">
                                    9.652,75₺
                                </div>
                                <a className="text-muted">Detaylı görüntüle</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row row-cards">
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Tüm Personeller</h3>
                            </div>
                            <div className="table-responsive employee-list">
                                <Table />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Employees;
