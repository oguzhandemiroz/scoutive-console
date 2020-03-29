import React, { Component } from "react";
import BankModal from "./BankModal";
//bank logo
import garanti from "../../../../assets/images/banks/garanti.svg";
import teb from "../../../../assets/images/banks/teb.svg";
import halkbank from "../../../../assets/images/banks/halkbank.svg";
import vakifbank from "../../../../assets/images/banks/vakifbank.svg";
import akbank from "../../../../assets/images/banks/akbank.svg";
import ing from "../../../../assets/images/banks/ing.svg";
import yapikredi from "../../../../assets/images/banks/yapikredi.svg";
import qnb from "../../../../assets/images/banks/qnb.svg";
import ziraat from "../../../../assets/images/banks/ziraat.svg";
import albaraka from "../../../../assets/images/banks/albaraka.svg";
import kuveytturk from "../../../../assets/images/banks/kuveytturk.svg";
import is from "../../../../assets/images/banks/is.svg";

const banks = [
    {
        id: "0",
        name: "Garanti BBVA",
        logo: garanti,
        active: true,
        detail: {
            owner_name: "Oğuzhan DEMİRÖZ",
            account_no: "6295542",
            branch_no: "135",
            branch_name: "ORTAKÖY Şubesi",
            iban: "TR43 0006 2000 1350 0006 2955 42",
            currency: "TL"
        }
    },
    {
        id: "1",
        name: "TEB (Türk Ekonomi Bankası)",
        logo: teb,
        active: true,
        detail: {
            owner_name: "Oğuzhan DEMİRÖZ",
            account_no: "33477522",
            branch_no: "929",
            branch_name: "CEPTETEB",
            iban: "TR49 0003 2000 0000 0033 4775 22",
            currency: "TL"
        }
    },
    { id: "2", name: "Halkbank", logo: halkbank, active: false, detail: null },
    { id: "3", name: "Türkiye İş Bankası", logo: is, active: false, detail: null },
    { id: "4", name: "VakıfBank", logo: vakifbank, active: false, detail: null },
    { id: "5", name: "Ziraat Bankası", logo: ziraat, active: false, detail: null },
    { id: "6", name: "Kuveyt Türk Katılım Bankası", logo: kuveytturk, active: false, detail: null },
    { id: "7", name: "QNB Finansbank", logo: qnb, active: false, detail: null },
    { id: "8", name: "Yapı Kredi", logo: yapikredi, active: false, detail: null },
    { id: "9", name: "Akbank", logo: akbank, active: false, detail: null },
    { id: "10", name: "ING", logo: ing, active: false, detail: null },
    { id: "11", name: "Albaraka Türk Katılım Bankası", logo: albaraka, active: false, detail: null }
];

export class Banks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBank: { detail: { account_name: "" } }
        };
    }

    handleBank = bank => {
        this.setState({ selectedBank: bank });
    };

    render() {
        const { selectedBank } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fa fa-university mr-1"></i> Banka Hesaplarımız
                    </h3>
                </div>
                <div className="card-body p-0">
                    <div className="row gutters-0 bank-group">
                        {banks.map(bank => (
                            <div
                                onClick={() => this.handleBank(bank)}
                                data-target="#bankModal"
                                data-toggle="modal"
                                className={`col-sm-3 col-4 p-sm-5 p-4 border bank ${bank.active ? "bank-active" : ""}`}
                                key={bank.id}>
                                <img src={bank.logo} alt={bank.name} title={bank.name} height="35" />
                            </div>
                        ))}
                        <BankModal bank={selectedBank} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Banks;
