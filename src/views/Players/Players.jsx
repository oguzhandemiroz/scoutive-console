import React, {Component} from "react";
import {DailyEmployee, GeneralEmployee, Table} from "../../components/Players/List.jsx";
import {Link} from "react-router-dom";

class Players extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenciler</h1>
                    <Link
                        to="/app/players/add"
                        className="btn btn-icon btn-sm btn-success ml-auto dropdown-toggle"
                        data-toggle="dropdown">
                        Öğrenci Ekle
                    </Link>

                    <div className="dropdown-menu">
                        <Link to="/app/players/add" className="dropdown-item">Normal Öğrenci Ekle</Link>
                        <Link to="/app/players/add/trial" className="dropdown-item">Deneme Öğrenci Ekle</Link>
                    </div>
                </div>

                <div className="row row-cards">
                    <div className="col-sm-6 col-md-4" />
                </div>
                <div className="row row-cards">
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Tüm Öğrenciler</h3>
                            </div>
                            <div className="table-responsive employee-list">
                                <Table history={this.props.history} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Players;
