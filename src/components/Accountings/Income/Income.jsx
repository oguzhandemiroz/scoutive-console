import React, { Component } from "react";
import { Link } from "react-router-dom";
import List from "./List";
import IncomeItems from "./IncomeItems";
import { CheckPermissions } from "../../../services/Others";

export class Income extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        <i className="fe fe-trending-up mr-2 text-green"></i>Gelir
                    </h1>
                    {CheckPermissions(["a_write"]) && (
                        <div className="input-group w-auto ml-auto">
                            <div className="input-group-append">
                                <Link to="/app/accountings/income/fast" className="btn btn-sm btn-success">
                                    <i className="fa fa-plus-square mr-1"></i> Gelir Oluştur
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm dropdown-toggle dropdown-toggle-split"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu">
                                    <Link
                                        to="/app/accountings/income/invoice"
                                        className="dropdown-item cursor-not-allowed disabled">
                                        <i className="dropdown-icon fa fa-receipt"></i> Fatura
                                        <span className="ml-2">
                                            (<i className="fe fe-lock mr-0" />)
                                        </span>
                                    </Link>
                                    <Link to="/app/players/payment/fee" className="dropdown-item">
                                        <i className="dropdown-icon fa fa-hand-holding-usd"></i> Aidat Ödemesi
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="row row-cards">
                    <div className="col-12">
                        <IncomeItems />
                    </div>
                </div>

                <div className="row row-cards">
                    <div className="col-12">
                        <List />
                    </div>
                </div>
            </div>
        );
    }
}

export default Income;
