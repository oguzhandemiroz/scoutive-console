import React, {Component} from "react";
import Select, {components} from "react-select";
import {withRouter, Link} from "react-router-dom";
import List from "./List";
import {CreateGroup} from "../../services/Group";
import {Hours, Minutes, DateRange, GetEmployees, GetPlayers} from "../../services/FillSelect";
import {UpdatePlayers} from "../../services/Player";
import {UploadFile} from "../../services/Others";
import {Toast, showSwal} from "../../components/Alert";

const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const customStyles = {
    control: styles => ({...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3})
};

const customStylesError = {
    control: styles => ({
        ...styles,
        borderColor: "#cd201f",
        borderRadius: 3,
        ":hover": {...styles[":hover"], borderColor: "#cd201f"}
    })
};

const {Option} = components;
const ImageOptionPlayer = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{backgroundImage: `url(${props.data.image})`}} />
        {props.data.label}
        <div className="small text-muted mt-1">
            Mevcut Grup: <b className="text-blue">{props.data.group || "—"}</b>
        </div>
    </Option>
);
const ImageOptionEmployee = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{backgroundImage: `url(${props.data.image})`}} />
        {props.data.label}
        <div className="small text-muted mt-1">
            Pozisyon: <b className="text-blue">{props.data.position}</b>
        </div>
    </Option>
);

const initialState = {
    name: null,
    hour: null,
    minute: null,
    start_age: null,
    end_age: null,
    age: null,
    employee: null,
    imagePreview: null,
    players: null
};

export class Add extends Component {
    constructor(props) {
        super(props);
        const now = Date.now();
        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
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
            group_id: null,
            uploadedFile: true,
            loadingButton: "",
            players: [{key: now, security_id: ""}],
            playerList: [
                {
                    id: now,
                    select: states => {
                        const {select} = states;
                        return (
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                isDisabled={select.players ? false : true}
                                onChange={val => this.handleSelect(val, "player", now, true)}
                                placeholder="Seç..."
                                name="player"
                                autosize
                                styles={customStyles}
                                options={select.players}
                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                components={{Option: ImageOptionPlayer}}
                            />
                        );
                    },
                    buttons: (
                        <div>
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={this.addItemList}>
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
            const {playerList, players} = this.state;
            console.log(this.state.playerList);
            const now = Date.now();
            this.setState({
                playerList: [
                    ...playerList,
                    {
                        id: now,
                        select: states => {
                            const {select} = states;
                            return (
                                <Select
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={select.players ? false : true}
                                    onChange={val => this.handleSelect(val, "player", now, true)}
                                    placeholder="Seç..."
                                    name="player"
                                    autosize
                                    styles={customStyles}
                                    options={select.players}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    components={{Option: ImageOptionPlayer}}
                                />
                            );
                        },
                        buttons: (
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={this.addItemList}>
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
                players: [...players, {key: now, security_id: ""}]
            });
        } catch (e) {}
    };

    removeItemList = key => {
        try {
            const {playerList, players} = this.state;
            if (playerList.length > 1) {
                const filteredItems = playerList.filter(x => x.id !== key);
                const filteredPlayers = players.filter(x => x.key !== key);
                this.setState({playerList: filteredItems, players: filteredPlayers});
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
        const {select} = this.state;
        GetEmployees().then(response => {
            console.log(response);
            select.employees = response;
            this.setState({select});
        });

        GetPlayers().then(response => {
            console.log(response);
            select.players = response;
            this.setState({select});
        });

        select.hours = Hours();
        select.minutes = Minutes();

        this.setState({select});
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                name,
                hour,
                minute,
                employee,
                start_age,
                end_age,
                file,
                imagePreview,
                players,
                formErrors
            } = this.state;

            const requiredData = {};
            const playersArr = [];
            const formData = new FormData();

            //required data
            requiredData.name = name;
            requiredData.hour = hour;
            requiredData.minute = minute;
            requiredData.employee = employee;
            requiredData.start_age = start_age;
            requiredData.end_age = end_age;
            requiredData.formErrors = formErrors;

            console.log(`
            ---SUBMITTING---
               name: ${name}
               hour: ${hour}
               minute: ${minute}
               employee: ${employee}
               age: ${start_age}-${end_age}
           `);

            if (formValid(requiredData)) {
                players.map(el => {
                    if (el.security_id && el.security_id !== "") playersArr.push(el.security_id);
                });

                this.setState({loadingButton: "btn-loading"});
                CreateGroup({
                    uid: uid,
                    name: name,
                    time: `${hour.value}:${minute.value}`,
                    employee_id: employee.value,
                    age: `${start_age}-${end_age}`
                }).then(response => {
                    if (response) {
                        if (response.status.code === 1020) {
                            const group_id = response.group_id;
                            if (imagePreview) {
                                formData.append("image", file);
                                formData.append("uid", uid);
                                formData.append("to", group_id);
                                formData.append("type", "group");
                                formData.append("update", true);
                                this.setState({uploadedFile: false});
                                Promise.all([
                                    UpdatePlayers({
                                        uid: uid,
                                        select: {
                                            security_id__in: playersArr
                                        },
                                        update: {
                                            group_id: group_id
                                        },
                                        attributes: {
                                            group_id: group_id
                                        }
                                    }),
                                    UploadFile(formData)
                                ])
                                    .then(([responsePlayers, responseFile]) => {
                                        if (
                                            responsePlayers.status.code === 1020 &&
                                            responseFile.status.code === 1020
                                        ) {
                                            Toast.fire({
                                                type: "success",
                                                title: "Başarıyla oluşturuldu..."
                                            });
                                            this.props.history.push("/app/groups/detail/" + group_id);
                                        } else if (responsePlayers.status.code !== 1020) {
                                            Toast.fire({
                                                type: "error",
                                                title: "Öğrenciler eklenemedi..."
                                            });
                                        } else if (responseFile.status.code === 1020) {
                                            Toast.fire({
                                                type: "error",
                                                title: "Görsel yüklenemedi..."
                                            });
                                        }
                                        this.setState({uploadedFile: true, loadingButton: ""});
                                    })
                                    .catch(e => this.setState({uploadedFile: true, loadingButton: ""}));
                            } else {
                                UpdatePlayers({
                                    uid: uid,
                                    select: {
                                        security_id__in: playersArr
                                    },
                                    update: {
                                        group_id: group_id
                                    },
                                    attributes: {
                                        group_id: group_id
                                    }
                                })
                                    .then(response => {
                                        if (response.status.code === 1020) {
                                            Toast.fire({
                                                type: "success",
                                                title: "Başarıyla oluşturuldu..."
                                            });
                                            this.props.history.push("/app/groups/detail/" + group_id);
                                        }
                                    })
                                    .catch(e => this.setState({uploadedFile: true, loadingButton: ""}));
                            }
                        }
                    }
                    this.setState({loadingButton: ""});
                });
            } else {
                console.error("FORM INVALID - DISPLAY ERROR");
                let formErrors = {...this.state.formErrors};

                formErrors.name = !name ? "is-invalid" : "";
                formErrors.hour = hour ? "" : true;
                formErrors.minute = minute ? "" : true;
                formErrors.employee = employee ? "" : true;
                formErrors.start_age = start_age ? "" : "is-invalid";
                formErrors.end_age = end_age ? "" : "is-invalid";

                this.setState({formErrors});
            }
        } catch (e) {}
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const {value, name} = e.target;
            const formErrors = {...this.state.formErrors};

            switch (name) {
                case "name":
                    formErrors.name = !value ? "is-invalid" : "";
                    break;
                default:
                    break;
            }
            this.setState({formErrors, [name]: value});
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
        const {players} = this.state;
        let formErrors = {...this.state.formErrors};

        if (arr) {
            /*this.setState(prevState => {
				return (prevState[name][extraData].kinship = value.label);
            });*/
            const findPlayer = players.find(x => x.key === extraData);
            findPlayer.security_id = value ? value.value : "";
        } else {
            formErrors[name] = value ? false : true;
            this.setState({formErrors, [name]: value});
        }
    };

    render() {
        const {
            select,
            start_age,
            uploadedFile,
            imagePreview,
            playerList,
            loadingButton,
            formErrors
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
                        <div className="d-none d-lg-block mt-6">
                            <Link to="/app/groups" className="text-muted float-right">
                                Başa dön
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <form className="card" onSubmit={this.handleSubmit}>
                            <div className="card-header p-4">
                                <div className="card-status bg-blue" />
                                <h3 className="card-title">
                                    <input
                                        type="text"
                                        style={{width: "13rem"}}
                                        className={`form-control ${formErrors.name}`}
                                        placeholder="Grup Adı *"
                                        name="name"
                                        onChange={this.handleChange}
                                    />
                                </h3>
                                <div className="card-options mr-0">
                                    <div style={{width: "5rem"}}>
                                        <Select
                                            isSearchable={true}
                                            isDisabled={select.hours ? false : true}
                                            onChange={val => this.handleSelect(val, "hour")}
                                            placeholder="Sa."
                                            name="hour"
                                            autosize
                                            styles={
                                                formErrors.hour === true ? customStylesError : customStyles
                                            }
                                            options={select.hours}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        />
                                    </div>
                                    <span
                                        className="mx-2 font-weight-bold d-flex align-items-center"
                                        style={{fontSize: "1.3rem"}}>
                                        :
                                    </span>
                                    <div style={{width: "5rem"}}>
                                        <Select
                                            isSearchable={true}
                                            isDisabled={select.minutes ? false : true}
                                            onChange={val => this.handleSelect(val, "minute")}
                                            placeholder="Dk."
                                            name="minute"
                                            autosize
                                            styles={
                                                formErrors.minute === true ? customStylesError : customStyles
                                            }
                                            options={select.minutes}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-auto">
                                        <label
                                            htmlFor="image"
                                            className={`avatar ${
                                                uploadedFile ? "" : "btn-loading"
                                            } avatar-xxxl cursor-pointer disabled`}
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
                                                Grup Yaş Aralığı:
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
                                                    style={{fontSize: ".75rem", color: "#6e7687"}}>
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
                                    </div>
                                    <div className="col d-flex flex-column justify-content-center">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Sorumlu Antrenör:
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
                                                        ? customStylesError
                                                        : customStyles
                                                }
                                                options={select.employees}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                components={{Option: ImageOptionEmployee}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-5">
                                        <label className="form-label" style={{fontSize: "1.15rem"}}>
                                            Öğrenci Ekle
                                        </label>
                                        <div>
                                            <table className="table table-vcenter text-nowrap table-outline mb-0">
                                                <tbody>
                                                    {Array.isArray(playerList)
                                                        ? playerList.map((el, key) => (
                                                              <tr key={el.id.toString()}>
                                                                  <td className="w-4 text-muted">
                                                                      #{key + 1}
                                                                  </td>
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
                                <div className="d-flex" style={{justifyContent: "space-between"}}>
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
                                    <div className="d-flex" style={{alignItems: "center"}}>
                                        <button
                                            style={{width: 100}}
                                            type="submit"
                                            disabled={!uploadedFile ? true : false}
                                            className={`btn btn-primary ml-3 ${loadingButton}`}>
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
