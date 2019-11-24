import React, { Component } from "react";
import Select, { components } from "react-select";
import { withRouter, Link } from "react-router-dom";
import List from "./List";
import { CreateGroup, ChangeGroup } from "../../services/Group";
import { Areas, GetEmployees, GetPlayers } from "../../services/FillSelect";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../assets/js/core";
import { UpdatePlayers } from "../../services/Player";
import { UploadFile } from "../../services/Others";
import { Toast, showSwal } from "../../components/Alert";
import moment from "moment";
import "moment/locale/tr";

const { Option } = components;
const ImageOptionPlayer = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label} ({props.data.birthday ? moment(props.data.birthday).format("YYYY") : null})
        <div className="small text-muted mt-1">
            Mevcut Grup: <b className="text-blue">{props.data.group || "—"}</b>
        </div>
    </Option>
);

const ImageOptionEmployee = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
        <div className="small text-muted mt-1">
            Pozisyon: <b className="text-blue">{props.data.position}</b>
        </div>
    </Option>
);

const initialState = {
    name: null,
    start_time: null,
    end_time: null,
    start_age: null,
    end_age: null,
    area: null,
    employee: null,
    players: null,
    imagePreview: null
};

export class Add extends Component {
    constructor(props) {
        super(props);
        const now = Date.now();
        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            select: {
                employees: null,
                players: null,
                areas: null
            },
            formErrors: {
                name: "",
                start_time: "",
                end_time: "",
                start_age: "",
                end_age: "",
                employee: ""
            },
            loadingImage: "",
            loadingButton: "",
            players: [{ key: now, player_id: "" }],
            playerList: [
                {
                    id: now,
                    select: states => {
                        const { select } = states;
                        return (
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                isDisabled={select.players ? false : true}
                                onChange={val => this.handleSelect(val, "player", now, true)}
                                placeholder="Seç..."
                                name="player"
                                autosize
                                styles={selectCustomStyles}
                                options={select.players}
                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                components={{ Option: ImageOptionPlayer }}
                            />
                        );
                    },
                    buttons: (
                        <div>
                            <button type="button" className="btn btn-sm btn-success" onClick={this.addItemList}>
                                <i className="fe fe-plus" />
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-danger ml-2"
                                onClick={() => this.removeItemList(now)}>
                                <i className="fe fe-minus" />
                            </button>
                        </div>
                    )
                }
            ]
        };
    }

    addItemList = () => {
        try {
            const { playerList, players } = this.state;
            const now = Date.now();
            this.setState({
                playerList: [
                    ...playerList,
                    {
                        id: now,
                        select: states => {
                            const { select } = states;
                            return (
                                <Select
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={select.players ? false : true}
                                    onChange={val => this.handleSelect(val, "player", now, true)}
                                    placeholder="Seç..."
                                    name="player"
                                    autosize
                                    styles={selectCustomStyles}
                                    options={select.players}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    components={{ Option: ImageOptionPlayer }}
                                />
                            );
                        },
                        buttons: (
                            <div>
                                <button type="button" className="btn btn-sm btn-success" onClick={this.addItemList}>
                                    <i className="fe fe-plus" />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger ml-2"
                                    onClick={() => this.removeItemList(now)}>
                                    <i className="fe fe-minus" />
                                </button>
                            </div>
                        )
                    }
                ],
                players: [...players, { key: now, player_id: "" }]
            });
        } catch (e) {}
    };

    removeItemList = key => {
        try {
            const { playerList, players } = this.state;
            if (playerList.length > 1) {
                const filteredItems = playerList.filter(x => x.id !== key);
                const filteredPlayers = players.filter(x => x.key !== key);
                this.setState({ playerList: filteredItems, players: filteredPlayers });
            } else if (playerList.length === 1) {
                Toast.fire({
                    type: "warning",
                    title: "Daha fazla silme işlemi yapılamaz!",
                    timer: 2000
                });
            }
        } catch (e) {}
    };

    componentDidMount() {
        this.getFillSelect();
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                name,
                start_time,
                end_time,
                employee,
                start_age,
                end_age,
                file,
                area,
                imagePreview,
                players
            } = this.state;

            const require = { ...this.state };
            delete require.imagePreview;
            delete require.area;

            const playersArr = [];
            const formData = new FormData();

            console.log(players);

            if (
                moment(end_time, "HH:mm", true).isValid("HH:mm") &&
                moment(start_time, "HH:mm", true).isValid("HH:mm") &&
                !moment(end_time, "HH:mm").isAfter(moment(start_time, "HH:mm"))
            ) {
                Toast.fire({
                    type: "warning",
                    title: "Bitiş saati, Başlangıç saatinden büyük olmalı!",
                    timer: 3000
                });
            } else if (formValid(require)) {
                players.map(el => {
                    if (el.player_id && el.player_id !== "") playersArr.push(el.player_id);
                });

                this.setState({ loadingButton: "btn-loading" });
                CreateGroup({
                    uid: uid,
                    name: name.capitalize(),
                    start_time: start_time,
                    end_time: end_time,
                    employee_id: employee.value,
                    age: `${start_age}-${end_age}`,
                    area_id: area ? area.value : 1
                }).then(response => {
                    if (response) {
                        if (response.status.code === 1020) {
                            const group_id = response.group_id;

                            if (playersArr.length > 0) {
                                ChangeGroup({
                                    uid: uid,
                                    group_id: group_id,
                                    add: playersArr,
                                    remove: []
                                }).then(response => {
                                    if (response) {
                                        const status = response.status;
                                        if (status.code !== 1020) {
                                            Toast.fire({
                                                type: "error",
                                                title: "Öğrenciler eklenemedi..."
                                            });
                                        }
                                    }
                                });
                            }

                            if (imagePreview) {
                                formData.append("image", file);
                                formData.append("uid", uid);
                                formData.append("to", group_id);
                                formData.append("type", "group");
                                formData.append("update", true);
                                this.setState({ loadingImage: "btn-loading" });
                                UploadFile(formData).then(response => {
                                    if (response) {
                                        const status = response.status;
                                        if (status.code === 1020) {
                                            this.setState({ loadingImage: "" });
                                        } else {
                                            Toast.fire({
                                                type: "error",
                                                title: "Görsel yüklenemedi..."
                                            });
                                        }
                                    }
                                });
                            }

                            this.props.history.push("/app/groups/detail/" + group_id);
                        }
                    }
                    this.setState({ loadingButton: "" });
                });
            } else {
                this.setState(prevState => ({
                    formErrors: {
                        ...prevState.formErrors,
                        employee: employee ? false : true,
                        name: name ? "" : "is-invalid",
                        start_time: moment(start_time, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless",
                        end_time: moment(end_time, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless",
                        start_age: start_age ? "" : "is-invalid",
                        end_age: end_age ? "" : "is-invalid"
                    }
                }));
            }
        } catch (e) {}
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const { value, name } = e.target;
            let formErrors = { ...this.state.formErrors };
            console.log(moment(value, "HH:mm", true).isValid("HH:mm"));
            switch (name) {
                case "start_time":
                    formErrors[name] = moment(value, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless";
                    break;
                case "end_time":
                    formErrors[name] = moment(value, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless";
                    break;
                default:
                    formErrors[name] = value ? "" : "is-invalid";
                    break;
            }
            this.setState({ formErrors, [name]: value });
        } catch (e) {}
    };

    handleImage = e => {
        try {
            e.preventDefault();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if (reader.result !== null) {
                    this.setState({
                        imagePreview: reader.result,
                        file: file
                    });
                }
            };
            reader.readAsDataURL(file);
        } catch (e) {}
    };

    handleSelect = (value, name, extraData, arr) => {
        const { players } = this.state;
        let formErrors = { ...this.state.formErrors };

        if (arr) {
            const findPlayer = players.find(x => x.key === extraData);
            findPlayer.player_id = value ? value.id : "";
        } else {
            formErrors[name] = value ? false : true;
            this.setState({ formErrors, [name]: value });
        }
    };

    getFillSelect = () => {
        Areas().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    areas: response
                }
            }));
        });

        GetEmployees().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    employees: response
                }
            }));
        });

        GetPlayers().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    players: response
                }
            }));
        });
    };

    render() {
        const { select, start_age, loadingImage, imagePreview, playerList, loadingButton, formErrors } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar &mdash; Grup Oluştur</h1>
                </div>
                <div className="row">
                    <div className="col-12">
                        <form className="card" onSubmit={this.handleSubmit}>
                            <div className="card-header p-4">
                                <div className="card-status bg-blue" />
                                <h3 className="card-title">
                                    <input
                                        type="text"
                                        style={{ width: "13rem" }}
                                        className={`form-control ${formErrors.name}`}
                                        placeholder="Grup Adı *"
                                        name="name"
                                        onChange={this.handleChange}
                                    />
                                </h3>
                                <div className="card-options mr-0">
                                    <div style={{ width: "4rem" }}>
                                        <input
                                            type="text"
                                            name="start_time"
                                            className={`form-control ${formErrors.start_time} text-center`}
                                            placeholder="08:00"
                                            data-toggle="tooltip"
                                            title="Antrenman Başlangıç Saati"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <span
                                        className="mx-2 font-weight-bold d-flex align-items-center"
                                        style={{ fontSize: ".75rem", color: "#6e7687" }}>
                                        &mdash;
                                    </span>
                                    <div style={{ width: "4rem" }}>
                                        <input
                                            type="text"
                                            name="end_time"
                                            className={`form-control ${formErrors.end_time} text-center`}
                                            placeholder="08:30"
                                            data-toggle="tooltip"
                                            title="Antrenman Bitiş Saati"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-auto">
                                        <label
                                            htmlFor="image"
                                            className={`avatar ${loadingImage} avatar-xxxl cursor-pointer disabled`}
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                fontSize: ".875rem",
                                                backgroundImage: `url(${imagePreview})`
                                            }}>
                                            {!imagePreview ? "Fotoğraf ekle" : ""}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="image"
                                            id="image"
                                            hidden
                                            onChange={this.handleImage}
                                        />
                                    </div>
                                    <div className="col d-flex flex-column justify-content-center">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Grup Yaş Aralığı
                                                <span className="form-required">*</span>
                                            </label>
                                            <div className="row gutters-xs">
                                                <div className="col">
                                                    <input
                                                        placeholder="Başlangıç"
                                                        type="number"
                                                        min="1980"
                                                        max="2019"
                                                        className={`form-control ${formErrors.start_age}`}
                                                        name="start_age"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <span
                                                    className="mx-1 font-weight-bold d-flex align-items-center"
                                                    style={{ fontSize: ".75rem", color: "#6e7687" }}>
                                                    &mdash;
                                                </span>
                                                <div className="col">
                                                    <input
                                                        placeholder="Bitiş"
                                                        type="number"
                                                        min={start_age || "1981"}
                                                        max="2019"
                                                        className={`form-control ${formErrors.end_age}`}
                                                        name="end_age"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Antrenman Sahası</label>
                                            <Select
                                                options={select.areas}
                                                isSearchable={true}
                                                isDisabled={select.areas ? false : true}
                                                isLoading={select.areas ? false : true}
                                                placeholder="Seç..."
                                                onChange={val => this.handleSelect(val, "area")}
                                                name="area"
                                                autosize
                                                styles={
                                                    formErrors.areas === true
                                                        ? selectCustomStylesError
                                                        : selectCustomStyles
                                                }
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col d-flex flex-column justify-content-start">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Sorumlu Antrenör
                                                <span className="form-required">*</span>
                                            </label>
                                            <Select
                                                isSearchable={true}
                                                isDisabled={select.employees ? false : true}
                                                placeholder="Seç..."
                                                onChange={val => this.handleSelect(val, "employee")}
                                                name="employee"
                                                autosize
                                                styles={
                                                    formErrors.employee === true
                                                        ? selectCustomStylesError
                                                        : selectCustomStyles
                                                }
                                                options={select.employees}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                components={{ Option: ImageOptionEmployee }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <label className="form-label" style={{ fontSize: "1.15rem" }}>
                                            Öğrenci Ekle
                                        </label>
                                        <div>
                                            <table className="table table-vcenter text-nowrap table-outline mb-0">
                                                <tbody>
                                                    {Array.isArray(playerList)
                                                        ? playerList.map((el, key) => (
                                                              <tr key={el.id.toString()}>
                                                                  <td className="w-4 text-muted">#{key + 1}</td>
                                                                  <td>{el.select(this.state)}</td>
                                                                  <td className="w-1 pl-0">{el.buttons}</td>
                                                              </tr>
                                                          ))
                                                        : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                    <a
                                        onClick={() => {
                                            showSwal({
                                                type: "info",
                                                title: "Emin misiniz?",
                                                text: "İşlemi iptal etmek istediğinize emin misiniz?",
                                                confirmButtonText: "Evet",
                                                cancelButtonText: "Hayır",
                                                cancelButtonColor: "#cd201f",
                                                showCancelButton: true,
                                                reverseButtons: true
                                            }).then(result => {
                                                if (result.value) this.props.history.push("/app/groups");
                                            });
                                        }}
                                        className="btn btn-link">
                                        İptal
                                    </a>
                                    <div className="d-flex" style={{ alignItems: "center" }}>
                                        <button
                                            style={{ width: 100 }}
                                            type="submit"
                                            className={`btn btn-primary ml-3 ${loadingButton} ${loadingImage}`}>
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Add);
