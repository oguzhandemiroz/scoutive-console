import React, { Component } from "react";
import Select, { components } from "react-select";
import { selectCustomStyles } from "../../../assets/js/core";

const { Option } = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
    </Option>
);

export class UnSelected extends Component {
    render() {
        const { player, select, tab } = this.props.state;
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className={`fa ${tab.icon} mr-2`} /> {tab.title}
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col">
                                <div className="form-group">
                                    <label className="form-label">
                                        Öğrenci
                                        <span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={player}
                                        onChange={val => this.props.handleSelect(val, "player")}
                                        options={select.players}
                                        name="player"
                                        placeholder="Öğrenci Seç..."
                                        styles={selectCustomStyles}
                                        isSearchable={true}
                                        autoSize
                                        isDisabled={select.players ? false : true}
                                        isLoading={select.players ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        components={{ Option: ImageOption }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-icon alert-danger mb-0" role="alert">
                            <i className="fa fa-user-check mr-2" aria-hidden="true"></i>
                            <strong className="d-block">Öğrenci Seç!</strong>
                            İşlem yapabilmek için bir öğrenci seç...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UnSelected;
