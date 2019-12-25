import React, { Component } from "react";
import Select, { components } from "react-select";
import { avatarPlaceholder } from "../../../services/Others";
import { selectCustomStyles } from "../../../assets/js/core";

const { Option } = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
    </Option>
);

export class Scholarship extends Component {
    render() {
        const { player, select, tab, image, name, surname } = this.props.state;
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
                            <div className="col-auto">
                                <span
                                    className="avatar avatar-xxl"
                                    style={{
                                        backgroundImage: `url(${image})`
                                    }}>
                                    {avatarPlaceholder(name, surname)}
                                </span>
                            </div>
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
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        components={{ Option: ImageOption }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="alert alert-icon alert-warning mb-0" role="alert">
                                    <i className="fa fa-graduation-cap mr-2" aria-hidden="true"></i>
                                    <strong className="d-block">Burslu öğrenci seçtiniz!</strong>
                                    Burslu öğrenciler aidat ödemelerinden muaf tutulur.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scholarship;
