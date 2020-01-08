import React, { Component } from "react";
import { Link } from "react-router-dom";
import List from "./List";
import ExpenseItems from "./ExpenseItems";

export class Expense extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        <i className="fe fe-trending-down mr-2 text-red"></i>Gider
                    </h1>
                    <div className="input-group w-auto ml-auto">
                        <div className="input-group-append">
                            <Link to="/app/accountings/expense/fast" className="btn btn-sm btn-danger">
                                <i className="fa fa-minus-square mr-1"></i> Gider Oluştur
                            </Link>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm dropdown-toggle dropdown-toggle-split"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <div className="dropdown-menu">
                                <Link
                                    to="/app/accountings/expense/invoice"
                                    className="dropdown-item cursor-not-allowed disabled">
                                    <i className="dropdown-icon fa fa-receipt"></i> Fatura
                                    <span className="ml-2">
                                        (<i className="fe fe-lock mr-0" />)
                                    </span>
                                </Link>
                                <Link to="/app/players/payment/fee" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-money-bill-wave"></i> Maaş Ödemesi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row row-cards">
                    <div className="col-12">
                        <ExpenseItems />
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

export default Expense;
