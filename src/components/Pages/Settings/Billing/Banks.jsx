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
    { id: "0", name: "Garanti BBVA", logo: garanti, active: true },
    { id: "1", name: "Türk Ekonomi Bankası", logo: teb, active: true },
    { id: "2", name: "Halkbank", logo: halkbank, active: false },
    { id: "3", name: "Türkiye İş Bankası", logo: is, active: false },
    { id: "4", name: "VakıfBank", logo: vakifbank, active: false },
    { id: "5", name: "Ziraat Bankası", logo: ziraat, active: false },
    { id: "6", name: "Kuveyt Türk Katılım Bankası", logo: kuveytturk, active: false },
    { id: "7", name: "QNB Finansbank", logo: qnb, active: false },
    { id: "8", name: "Yapı Kredi", logo: yapikredi, active: false },
    { id: "9", name: "Akbank", logo: akbank, active: false },
    { id: "10", name: "ING", logo: ing, active: false },
    { id: "11", name: "Albaraka Türk Katılım Bankası", logo: albaraka, active: false }
];

export class Banks extends Component {
    render() {
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
                                data-whatever={bank.name}
                                data-target="#exampleModal"
                                data-toggle="modal"
                                className={`col-sm-3 col-4 p-sm-5 p-4 border bank ${bank.active ? "bank-active" : ""}`}
                                key={bank.id}>
                                <img src={bank.logo} alt={bank.name} height="35" />
                            </div>
                        ))}
                        <BankModal />
                    </div>
                </div>
            </div>
        );
    }
}

export default Banks;
