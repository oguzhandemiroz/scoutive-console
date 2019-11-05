import React, { Component } from "react";
import { GetServices } from "../../services/FillSelect";
import { selectCustomStyles } from "../../assets/js/core";
import Select from "react-select";

const feedBackTitle = {
    bug: {
        icon: "fa fa-bug",
        title: "Hata Bildir",
        color: "text-red"
    },
    idea: {
        icon: "fa fa-comments",
        title: "Görüş ve Öneri Bildir",
        color: "text-dark"
    },
    none: {
        icon: "",
        title: "",
        color: ""
    }
};

export class FeedBack extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: "none",
            service: null,
            files: [],
            filesLength: 0,
            select: {
                services: null
            }
        };
    }

    componentDidMount() {
        const { type } = this.props;
        console.log("componentDidMount ", type);
    }

    componentWillReceiveProps(nextProps) {
        const { type } = nextProps;
        if (type !== "none" && this.props.type !== type) {
            this.getServices();
            this.setState({ type: type });
        }
        console.log("componentWillReceiveProps ", type);
    }

    handleUpload = e => {
        console.log("log");
        e.preventDefault();
        let file = e.target.files;
        this.setState({
            files: [...file]
        });
    };

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    getServices = () => {
        GetServices().then(response => {
            if (response) {
                console.log(response);
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        services: response
                    }
                }));
            }
        });
    };

    render() {
        const { type, select, service } = this.state;
        return (
            <div
                className="modal fade"
                id="feedBackModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="feedBackModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="feedBackModalLabel">
                                <i className={`mr-2 ${feedBackTitle[type].icon} ${feedBackTitle[type].color}`} />
                                {feedBackTitle[type].title}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Servisler</label>
                                <Select
                                    value={service}
                                    onChange={val => this.handleSelect(val, "service")}
                                    options={select.services}
                                    name="service"
                                    placeholder="Seç..."
                                    styles={selectCustomStyles}
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={select.services ? false : true}
                                    isLoading={select.services ? false : true}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Başlık</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Açıklama</label>
                                <textarea rows={4} className="resize-none form-control" type="text" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ek</label>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        multiple
                                        onChange={this.handleUpload}
                                    />
                                    <label class="custom-file-label">Ek(ler) Seç...</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FeedBack;
