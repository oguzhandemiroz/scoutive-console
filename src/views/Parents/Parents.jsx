import React, { Component } from "react";
import List from "../../components/Parents/List";
import { Link } from "react-router-dom";

export class Parents extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Veliler</h1>
                    <Link to="/app/persons/parents/add" className="btn btn-success ml-auto">
                        Veli Ekle
                    </Link>
                </div>
                <div className="row row-cards">
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Tüm Veliler</h3>
                            </div>
                            <List history={this.props.history} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Parents;
