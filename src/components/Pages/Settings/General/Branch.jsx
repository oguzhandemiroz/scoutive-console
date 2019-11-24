import React, { Component } from "react";
import Select from "react-select";
import { Branchs } from "../../../../services/FillSelect";
import { selectCustomStyles } from "../../../../assets/js/core";

export class Branch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            show: false,
            loadingButton: "",
            select: {
                branchs: null
            }
        };
    }

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    showBranchSettings = () => {
        Branchs().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    branchs: response
                },
                branch: response.filter(x => x.value === "1"),
                show: true
            }));
        });
    };

    render() {
        const { show, select, branch, loadingButton } = this.state;
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
                        <button type="button" onClick={this.showBranchSettings} className="btn btn-secondary text-left">
                            Branş Ayarı
                        </button>
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
