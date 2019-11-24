import React, { Component } from "react";
import Select from "react-select";
import { Days } from "../../../../services/FillSelect";
import { selectCustomStyles } from "../../../../assets/js/core";

export class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            select: { days: null },
            show: false,
            loadingButton: "",
            fee_reminder_type: 0,
            day: null
        };
    }

    componentDidMount() {}

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        this.setState({ [name]: parseInt(value) });
    };

    showPaymentSettings = () => {
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                days: Days()
            },
            show: true
        }));
    };

    render() {
        const { show, loading, loadingButton, fee_reminder_type, select, day } = this.state;
        return (
            <form className="row" onSubmit={this.handleSubmit}>
                <div className="col-2">
                    <strong>Ödeme Ayarları</strong>
                </div>
                <div className="col-10">
                    {show ? (
                        <>
                            <div className="row mb-2">
                                <div className="col-lg-4">
                                    <div className="selectgroup selectgroup-vertical w-100">
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="fee_reminder_type"
                                                value="0"
                                                className="selectgroup-input"
                                                checked={fee_reminder_type === 0 ? true : false}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button">Okula başlama tarihi</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="fee_reminder_type"
                                                value="1"
                                                className="selectgroup-input"
                                                checked={fee_reminder_type === 1 ? true : false}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button">Sabit gün</span>
                                        </label>
                                    </div>
                                </div>
                                {fee_reminder_type === 1 ? (
                                    <div className="col-lg-8">
                                        <div className="form-group">
                                            <label className="form-label">Sabit gün ayarla</label>
                                            <Select
                                                value={day}
                                                onChange={val => this.handleSelect(val, "day")}
                                                options={select.days}
                                                name="day"
                                                placeholder="Gün"
                                                styles={selectCustomStyles}
                                                isSearchable={true}
                                                isDisabled={select.days ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            {day ? (
                                <div className="alert alert-icon alert-warning mb-2" role="alert">
                                    <i className="fe fe-bell mr-2" aria-hidden="true"></i>
                                    Her ayın <strong>{parseInt(day.value)}. günü</strong> ödeme hatırlatıcısı devreye
                                    girecektir ve sistem aidat ödemelerini bu günde bekleyecektir.
                                    {parseInt(day.value) >= 29 ? (
                                        <>
                                            <br />
                                            <br />
                                            <span className="font-italic">
                                                Not: <strong>{parseInt(day.value)}. günü</strong> seçtiniz, Şubat'ın
                                                28'inde hatırlatma yapacaktır.
                                            </span>
                                        </>
                                    ) : null}
                                </div>
                            ) : null}
                            <button type="submit" className={`btn btn-sm btn-primary ${loadingButton}`}>
                                Değişiklikleri Kaydet
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={this.showPaymentSettings}
                            className="btn btn-secondary text-left">
                            Ödeme Ayarları
                        </button>
                    )}

                    <div className="font-italic text-muted mt-2 mb-0">
                        <p>
                            Ödeme ayarlarından, aidat gününü belirleyebilirsiniz. Ödeme hatırlatıcısı buradaki ayara
                            göre çalışır. Aidat gününü sabit bir gün veya <u>öğrencinin okula başlama tarihine</u> göre
                            ayarlayabilirsiniz.
                        </p>
                        <p>
                            <strong>Okula başlama tarihine göre ayarlandığında;</strong> her öğreciye özel olarak
                            öğrencinin okula başladığı gün baz alınır ve her ayın o günü hatırlatma yapılır.
                        </p>
                        <p>
                            <strong>Sabit gün ayarlandığında;</strong> öğrencilerin okula başlama tarihleri önemsenmeden
                            tüm öğrencilerin aidatları belirlenen güne göre hatırlatma yapılır.
                        </p>
                    </div>
                </div>
            </form>
        );
    }
}

export default Payment;
