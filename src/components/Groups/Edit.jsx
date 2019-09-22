import React, { Component } from "react";
import Select, { components } from "react-select";
import { withRouter, Link } from "react-router-dom";
import { UpdateGroup, ListPlayers, DetailGroup } from "../../services/Group";
import { UpdatePlayers } from "../../services/Player";
import { Areas, GetEmployees, GetPlayers } from "../../services/FillSelect";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../assets/js/core";
import { getSelectValue, UploadFile, nullCheck, fullnameGenerator } from "../../services/Others";
import { Toast, showSwal } from "../../components/Alert";
import List from "./List";
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

export class Edit extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            select: {
                hours: null,
                minutes: null,
                employees: null,
                players: null
            },
            formErrors: {
                name: "",
                hours: "",
                minutes: "",
                start_age: "",
                end_age: "",
                employee: ""
            },
            uploadedFile: true,
            loadingButton: "",
            loadingImage: "",
            loading: "active",
            players: [],
            playerList: [],
            addGroup: [],
            removeGroup: []
        };
    }

    addItemList = security_id => {
        try {
            const { playerList, players, removeGroup } = this.state;
            const now = Date.now();
            this.setState(prevState => ({
                playerList: [
                    ...prevState.playerList,
                    {
                        id: now,
                        select: states => {
                            const { select } = states;
                            return (
                                <Select
                                    defaultValue={getSelectValue(select.players, security_id, "value")}
                                    isSearchable={true}
                                    isDisabled={select.players ? false : true}
                                    isClearable={true}
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
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={this.addItemList.bind(this, null)}>
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
                removeGroup: [...prevState.removeGroup, security_id],
                players: [...prevState.players, { key: now, security_id: security_id || "" }]
            }));
        } catch (e) {}
    };

    removeItemList = key => {
        try {
            const { playerList, players } = this.state;
            if (playerList.length > 1) {
                const filteredItems = playerList.filter(x => x.id !== key);
                const filteredPlayers = players.filter(x => x.key !== key);
                this.setState({
                    playerList: filteredItems,
                    players: filteredPlayers
                });
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
        this.getGroupDetail();
    }

    renderPlayerList = () => {
        const { uid } = this.state;
        const { gid } = this.props.match.params;
        this.setState({ loadingData: true });
        ListPlayers({
            uid: uid,
            filter: {
                "group.group_id": parseInt(gid)
            }
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    if (data.length > 0) {
                        data.map(el => {
                            this.addItemList(el.security_id);
                        });
                    } else this.addItemList();
                }
            }
            this.setState({ loadingData: false });
        });
    };

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                name,
                start_time,
                end_time,
                employee,
                image,
                players,
                area,
                start_age,
                end_age,
                removeGroup
            } = this.state;
            const { gid } = this.props.match.params;

            const require = { ...this.state };
            delete require.imagePreview;
            delete require.image;
            delete require.area;

            const playersArr = [];

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
                this.setState({ loadingButton: "btn-loading" });
                players.map(el => {
                    if (el.security_id && el.security_id !== "") playersArr.push(el.security_id);
                });

                const diffPlayers = removeGroup.diff(playersArr);

                Promise.all([
                    UpdateGroup({
                        group_id: gid,
                        uid: uid,
                        name: name.capitalize(),
                        start_time: start_time,
                        end_time: end_time,
                        employee_id: employee.value,
                        age: `${start_age}-${end_age}`,
                        image: image,
                        area_id: area ? area.value : 1
                    }),
                    UpdatePlayers({
                        uid: uid,
                        select: {
                            security_id__in: playersArr
                        },
                        update: {
                            group_id: gid
                        },
                        attributes: {
                            group_id: gid
                        }
                    }),
                    UpdatePlayers({
                        uid: uid,
                        select: {
                            security_id__in: diffPlayers
                        },
                        update: {
                            group_id: 1
                        }
                    })
                ]).then(([responseGroup, responsePlayers, responsePlayersRemove]) => {
                    if (responseGroup && responsePlayers && responsePlayersRemove) {
                        if (
                            responseGroup.status.code === 1020 &&
                            responsePlayers.status.code === 1020 &&
                            responsePlayersRemove.status.code === 1020
                        ) {
                            Toast.fire({
                                type: "success",
                                title: "Başarıyla güncellendi..."
                            });
                            this.setState({ loadingButton: "" });
                            this.props.history.push("/app/groups/detail/" + gid);
                        }
                    }
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
            const { uid } = this.state;
            const { gid } = this.props.match.params;
            const formData = new FormData();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if (reader.result !== null) {
                    this.setState({
                        imagePreview: reader.result
                    });
                    this.setState({ loadingImage: "btn-loading", loadingButton: "btn-loading" });
                }
                formData.append("image", file);
                formData.append("uid", uid);
                formData.append("to", gid);
                formData.append("type", "group");
                UploadFile(formData)
                    .then(response => {
                        if (response) {
                            if (response.status.code === 1020) this.setState({ image: response.data });
                            else
                                Toast.fire({
                                    type: "error",
                                    title: "Görsel yüklenemedi..."
                                });
                        }
                        this.setState({ loadingImage: "", loadingButton: "" });
                    })
                    .catch(e => this.setState({ loadingImage: "", loadingButton: "" }));
            };

            reader.readAsDataURL(file);
        } catch (e) {}
    };

    handleSelect = (value, name, extraData, arr) => {
        const { players } = this.state;
        let formErrors = { ...this.state.formErrors };

        if (arr) {
            const findPlayer = players.find(x => x.key === extraData);
            findPlayer.security_id = value ? value.value : "";
        } else {
            formErrors[name] = value ? false : true;
            this.setState({ formErrors, [name]: value });
        }
    };

    getGroupDetail = () => {
        const { uid } = this.state;
        const { gid } = this.props.match.params;
        DetailGroup({
            uid: uid,
            group_id: parseInt(gid)
        }).then(response => {
            if (response) {
                const status = response.status;
                const data = response.data;
                if (status.code === 1020) {
                    this.setState({
                        ...data,
                        start_time: moment(data.start_time, "HH:mm").format("HH:mm"),
                        end_time: moment(data.end_time, "HH:mm").format("HH:mm"),
                        start_age: data.age.split("-")[0],
                        end_age: data.age.split("-")[1],
                        area: data.area ? { label: data.area.name, value: data.area.area_id } : null,
                        employee: data.employee
                            ? {
                                  label: fullnameGenerator(data.employee.name, data.employee.surname),
                                  value: data.employee.security_id
                              }
                            : null,

                        loading: ""
                    });
                }
            }
        });
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
            this.setState(
                prevState => ({
                    select: {
                        ...prevState.select,
                        players: response
                    }
                }),
                () => this.renderPlayerList()
            );
        });
    };

    render() {
        const {
            name,
            start_time,
            end_time,
            area,
            employee,
            start_age,
            end_age,
            select,
            uploadedFile,
            imagePreview,
            playerList,
            loadingButton,
            loadingImage,
            formErrors,
            loading
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar</h1>
                </div>
                <div className="row">
                    <div className="col-lg-3 mb-4">
                        <Link to="/app/groups/add" className="btn btn-block btn-success btn-icon mb-6">
                            <i className="fe fe-plus-square mr-2" />
                            Grup Ekle
                        </Link>
                        <List match={this.props.match} />
                    </div>

                    <div className="col-lg-9">
                        <form className="card" onSubmit={this.handleSubmit}>
                            <div className="card-header p-4">
                                <div className="card-status bg-green" />
                                <h3 className="card-title">
                                    <input
                                        type="text"
                                        style={{ width: "13rem" }}
                                        className={`form-control ${formErrors.name}`}
                                        placeholder="Grup Adı *"
                                        name="name"
                                        onChange={this.handleChange}
                                        value={nullCheck(name, "—")}
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
                                            value={start_time}
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
                                            value={end_time}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
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
                                                                value={nullCheck(start_age)}
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
                                                                value={nullCheck(end_age)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Antrenman Sahası</label>
                                                    <Select
                                                        value={area}
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
                                                        value={employee}
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
                                                    Öğrenciler
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
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                    <a
                                        href="javascript:void(0)"
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
                                            disabled={!uploadedFile ? true : false}
                                            className={`btn btn-primary ml-3 ${loadingButton}`}>
                                            Kaydet
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

export default withRouter(Edit);
