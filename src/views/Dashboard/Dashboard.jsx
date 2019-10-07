import React, { Component } from "react";
import Budget from "../../components/Dashboard/Budget";
import EmployeeRollcall from "../../components/Dashboard/EmployeeRollcall";
import PlayerRollcall from "../../components/Dashboard/PlayerRollcall";
import DailyCreatedPlayer from "../../components/Dashboard/DailyCreatedPlayer";
import Birthdays from "../../components/Dashboard/Birthdays";
import TrainingGroups from "../../components/Dashboard/TrainingGroups";
import UnpaidPlayers from "../../components/Dashboard/UnpaidPlayers";
import FastMenu from "../../components/Dashboard/FastMenu";

class Dashboard extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Genel Durum</h1>
                </div>
                <div className="row row-cards">
                    <div className="col-sm-12 col-lg-4 order-1">
                        <FastMenu />
                    </div>
                    <div className="col-sm-12 col-lg-4 order-1">
                        <UnpaidPlayers />
                    </div>
                    <div className="col-sm-12 col-lg-4 order-1">
                        <TrainingGroups />
                        <DailyCreatedPlayer />
                        <Birthdays />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
