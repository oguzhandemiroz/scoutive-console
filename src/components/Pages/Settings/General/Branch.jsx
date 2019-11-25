import React, { Component } from "react";
import Select from "react-select";
import { Branchs } from "../../../../services/FillSelect";
import { selectCustomStyles } from "../../../../assets/js/core";
import { GetSettings, SetSettings } from "../../../../services/School";
import { Start } from "../../../../services/Starts";

export class Branch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            show: false,
            loadingButton: "",
            select: {
                branchs: null
            },
            error: false
        };
    }

    componentDidMount() {
        GetSettings().then(resSettings =>
            this.setState({ error: resSettings.settings.branch_id === "-1" ? true : false })
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, branch } = this.state;
        this.setState({ loadingButton: "btn-loading" });
        SetSettings({
            uid: uid,
            branch_id: branch.value
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ show: false });
                }
            }
            this.setState({ loadingButton: "" });
        });
    };

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    showBranchSettings = () => {
        this.setState({ loadingButton: "btn-loading" });
        Branchs().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    branchs: response
                }
            }));
            GetSettings().then(resSettings =>
                this.setState({
                    branch: response.filter(x => x.value === resSettings.settings.branch_id),
                    show: true,
                    loadingButton: ""
                })
            );
        });
    };

    render() {
        const { show, error, select, branch, loadingButton } = this.state;
        return (
            <form className="row" onSubmit={this.handleSubmit}>
                <div className="col-2">
                    <strong>Branş Ayarı</strong>
                </div>
                <div className="col-10">
                    {show ? (
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Select
                                    value={branch}
                                    onChange={val => this.handleSelect(val, "branch")}
                                    options={select.branchs}
                                    name="branch"
                                    placeholder="Seç..."
                                    styles={selectCustomStyles}
                                    isSearchable={true}
                                    isDisabled={select.branchs ? false : true}
                                    isLoading={select.branchs ? false : true}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                            <div className="col-12">
                                <button type="submit" className={`btn btn-sm btn-primary ${loadingButton}`}>
                                    Değişiklikleri Kaydet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={this.showBranchSettings}
                                className={`btn btn-secondary text-left ${loadingButton}`}>
                                Branş Ayarı
                            </button>
                            {error === true ? (
                                <div className="alert alert-danger mt-2">Branş ayarı ayarlanmadı</div>
                            ) : null}
                        </>
                    )}
                    <div className="font-italic text-muted mt-2 mb-0">
                        <p>
                            Branş ayarından, okulun varsayılan branşını belirleyebilirsiniz. Hesap açılışında
                            belirlediğiniz branş seçili olarak gelecektir.
                        </p>
                        Varsayılan branş, öğrenci ve personel oluştururken seçili olarak gelir.
                    </div>
                </div>
            </form>
        );
    }
}

export default Branch;
