import React, { Component } from "react";
import Budget from "../../components/Dashboard/Budget";
import EmployeeRollcall from "../../components/Dashboard/EmployeeRollcall";
import DailyCreatedPlayer from "../../components/Dashboard/DailyCreatedPlayer";
import PlayerRollcall from "../../components/Dashboard/PlayerRollcall";
import Birthdays from "../../components/Dashboard/Birthdays";
import TrainingGroups from "../../components/Dashboard/TrainingGroups";
import UnpaidPlayers from "../../components/Dashboard/UnpaidPlayers";
import FastMenu from "../../components/Dashboard/FastMenu";
import DailyPlayer from "../../components/Dashboard/DailyPlayer";
import Accounting from "../../components/Dashboard/Accounting";
import AccountingChart from "../../components/Dashboard/AccountingChart";
import NotPermissions from "../../components/NotActivate/NotPermissions";
import { CheckPermissions } from "../../services/Others";

class Dashboard extends Component {
    render() {
        if (!CheckPermissions(["a_read", "p_read", "e_read", "r_read", "g_read"], "||")) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">Genel Durum</h1>
                    </div>
                    <NotPermissions
                        title="Üzgünüz 😣"
                        imageAlt="Yetkiniz Bulunmadı"
                        content={() => (
                            <p className="text-muted text-center">
                                Genel Durum'u görüntülemek için yetkiniz bulunmamaktadır.
                                <br />
                                Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                geçiniz...
                            </p>
                        )}
                    />
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">Genel Durum</h1>
                    </div>
                    <PlayerRollcall />
                    <div className="row row-cards">
                        <DailyPlayer />
                        <Accounting />
                        <AccountingChart />
                        <UnpaidPlayers />
                        <Birthdays />
                        <TrainingGroups />
                        {/* <FastMenu /> */}
                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;
