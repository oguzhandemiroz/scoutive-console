import React, { Component } from "react";
import { formValid, selectCustomStyles } from "../../assets/js/core";
import Select from "react-select";

export class ParentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: false,
            kinship: { value: "Anne", label: "Anne" },
            select: {
                kinships: [
                    { value: "Anne", label: "Anne" },
                    { value: "Baba", label: "Baba" },
                    { value: "Diğer", label: "Diğer" }
                ]
            }
        };
    }

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    render() {
        const { select, kinship, search } = this.state;
        return (
            <div
                className="modal fade"
                id="parentModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="parentModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="parentModalLabel">
                                <i className={`mr-2 fa fa-user`} />
                                Veli Oluştur ve Ata
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>
                        {search ? (
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Veli Ara</label>
                                    <Select
                                        value={kinship}
                                        onChange={val => this.handleSelect(val, "kinship")}
                                        options={select.kinships}
                                        name="kinship"
                                        placeholder="Seç..."
                                        styles={selectCustomStyles}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">
                                        Yakınlık Durumu<span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={kinship}
                                        onChange={val => this.handleSelect(val, "kinship")}
                                        options={select.kinships}
                                        name="kinship"
                                        placeholder="Seç..."
                                        styles={selectCustomStyles}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="row gutters-xs">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Adı<span className="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">
                                                Soyadı<span className="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row gutters-xs">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Telefon<span className="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Eposta</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={() => this.setState({ search: true })}
                                className={`btn btn-${search ? "success" : "secondary"} btn-icon`}>
                                <i className="fe fe-search" /> Veli Ara
                            </button>
                            <button
                                type="button"
                                onClick={() => this.setState({ search: false })}
                                className={`btn btn-${search ? "secondary" : "success"} ml-auto`}>
                                Veli Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParentModal;
