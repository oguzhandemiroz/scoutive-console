import React, {Component} from "react";
import {
    Bloods,
    Branchs,
    Days,
    Months,
    Years,
    EmployeePositions,
    DateRange,
    Kinship
} from "../../services/FillSelect.jsx";
import {CreateEmployee} from "../../services/Employee.jsx";
import {showSwal} from "../../components/Alert.jsx";
import Select from "react-select";

const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const securityNoRegEx = /^\d+$/;

const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        console.log("rest: ", val);
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

const initialState = {
    image: null,
    name: null,
    surname: null,
    securityNo: null,
    email: null,
    phone: null,
    salary: null,
    position: null,
    branch: null,
    blood: null,
    day: null,
    month: null,
    year: null,
    schoolStartDate: null,
    schoolEndDate: null,
    kinship: null
};

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...initialState,
            select: {
                bloods: null,
                positions: null,
                days: null,
                months: null,
                years: null,
                branchs: null,
                schoolStartDates: null,
                schoolEndDates: null,
                kinships: null
            },
            formErrors: {
                image: "",
                name: "",
                surname: "",
                securityNo: "",
                email: "",
                position: "",
                branch: "",
                phone: "",
                salary: ""
            },
            loadingButton: "",
            addContinuously: false
        };
    }

    componentDidMount() {
        let select = {...this.state.select};
        Bloods().then(response => {
            console.log(response);
            select.bloods = response;
            this.setState({select});
        });

        EmployeePositions().then(response => {
            console.log(response);
            select.positions = response;
            this.setState({select});
        });

        Branchs().then(response => {
            console.log(response);
            select.branchs = response;
            this.setState({select});
        });

        select.days = Days();
        select.months = Months();
        select.years = Years();
        select.schoolStartDates = DateRange(1970, 2019);
        select.schoolEndDates = DateRange(1970, 2030);
        select.kinships = Kinship();

        this.setState({select});
        console.log(this.state.select);
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            name,
            surname,
            securityNo,
            email,
            position,
            branch,
            phone,
            salary,
            image,
            formErrors,
            addContinuously
        } = this.state;
        const requiredData = {};
        requiredData.name = name;
        requiredData.surname = surname;
        requiredData.securityNo = securityNo;
        requiredData.email = email;
        requiredData.position = position ? position.value : null;
        requiredData.branch = branch ? branch.value : null;
        requiredData.phone = phone;
        requiredData.salary = salary;
        requiredData.formErrors = formErrors;

        console.log(`
        ---SUBMITTING---
           name: ${name}
           surname: ${surname}
           securityNo: ${securityNo}
           email: ${email}
           position: ${position}
           branch: ${branch}
           phone: ${phone}
           salary: ${salary}
           image: ${image}
       `);

        console.log(requiredData);

        if (formValid(requiredData)) {
            console.log(`
             ---SUBMITTING---
                name: ${name}
                surname: ${surname}
                securityNo: ${securityNo}
                email: ${email}
                position: ${position}
                branch: ${branch}
                phone: ${phone}
                salary: ${salary}
                image: ${image}
			`);

            this.setState({loadingButton: "btn-loading"});

            CreateEmployee({
                uid: localStorage.getItem("UID"),
                name: name,
                surname: surname,
                password: "0000",
                security_id: securityNo,
                email: email,
                permission_id: position.value,
                phone_gsm: phone
            }).then(code => {
                this.setState({loadingButton: ""});
                setTimeout(() => {
                    if (code === 1020) {
                        if (addContinuously) {
                            console.log("devaaam");
                            this.setState({...initialState});
                        } else {
                            this.props.history.push("/app/employees");
                        }
                    }
                }, 1000);
            });
        } else {
            console.error("FORM INVALID - DISPLAY ERROR");
            const {value} = e.target;
            let formErrors = {...this.state.formErrors};
            const {
                name,
                surname,
                securityNo,
                email,
                position,
                branch,
                phone,
                salary,
                image
            } = this.state;

            formErrors.name = name ? (name.length < 3 ? "is-invalid" : "") : "is-invalid";
            formErrors.surname = surname ? (surname.length < 3 ? "is-invalid" : "") : "is-invalid";
            formErrors.securityNo = securityNo
                ? securityNo.length < 9
                    ? "is-invalid"
                    : !securityNoRegEx.test(securityNo)
                    ? "is-invalid"
                    : ""
                : "is-invalid";
            formErrors.email = email ? (!emailRegEx.test(email) ? "is-invalid" : "") : "is-invalid";
            formErrors.phone = phone ? (phone.length !== 11 ? "is-invalid" : "") : "is-invalid";
            formErrors.salary = salary ? "" : "is-invalid";
            //select
            formErrors.position = position ? "" : true;
            formErrors.branch = branch ? "" : true;

            this.setState({formErrors});
        }
    };

    handleChange = e => {
        e.preventDefault();
        const {value, name} = e.target;
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "name":
                formErrors.name = value.length < 3 ? "is-invalid" : "";
                break;
            case "surname":
                formErrors.surname = value.length < 3 ? "is-invalid" : "";
                break;
            case "securityNo":
                formErrors.securityNo =
                    value.length < 9
                        ? "is-invalid"
                        : !securityNoRegEx.test(value)
                        ? "is-invalid"
                        : "";
                break;
            case "email":
                formErrors.email =
                    value.length < 3 ? "is-invalid" : !emailRegEx.test(value) ? "is-invalid" : "";
                break;
            case "phone":
                formErrors.phone = value.length !== 11 ? "is-invalid" : "";
                break;
            case "salary":
                formErrors.salary = value ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: value});
    };

    handleImage = e => {
        try {
            e.preventDefault();

            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    image: reader.result
                });
            };

            reader.readAsDataURL(file);
        } catch (e) {}
    };

    handleSelect = (value, name) => {
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "position":
                formErrors.position = value ? false : true;
                break;
            case "branch":
                formErrors.branch = value ? false : true;
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: value});
        console.log(this.state);
    };

    handleCheck = e => {
        const {name, checked} = e.target;
        this.setState({[name]: checked});
        if (checked) console.log(checked);
    };

    render() {
        const {image, formErrors} = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personel Ekle</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-auto m-auto">
                                        <label
                                            htmlFor="image"
                                            className="avatar avatar-xxxl cursor-pointer"
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                fontSize: ".875rem",
                                                backgroundImage: `url(${this.state.image})`
                                            }}>
                                            {!this.state.image ? "Fotoğraf ekle" : ""}
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            id="image"
                                            hidden
                                            onChange={this.handleImage}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Adı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.name}`}
                                        onChange={this.handleChange}
                                        placeholder="Adı"
                                        name="name"
                                        value={this.state.name || ""}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Soyadı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.surname}`}
                                        onChange={this.handleChange}
                                        placeholder="Soyadı"
                                        name="surname"
                                        value={this.state.surname || ""}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        T.C. Kimlik No
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.securityNo}`}
                                        onChange={this.handleChange}
                                        placeholder="T.C. Kimlik No"
                                        name="securityNo"
                                        maxLength="11"
                                        value={this.state.securityNo || ""}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Pozisyonu
                                        <span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={this.state.position}
                                        onChange={val => this.handleSelect(val, "position")}
                                        options={this.state.select.positions}
                                        name="position"
                                        placeholder="Seç..."
                                        styles={
                                            this.state.formErrors.position === true
                                                ? customStylesError
                                                : customStyles
                                        }
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={this.state.select.positions ? false : true}
                                        noOptionsMessage={value =>
                                            `"${value.inputValue}" bulunamadı`
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Branşı
                                        <span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={this.state.branch}
                                        onChange={val => this.handleSelect(val, "branch")}
                                        options={this.state.select.branchs}
                                        name="branch"
                                        placeholder="Seç..."
                                        styles={
                                            this.state.formErrors.branch === true
                                                ? customStylesError
                                                : customStyles
                                        }
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={this.state.select.branchs ? false : true}
                                        noOptionsMessage={value =>
                                            `"${value.inputValue}" bulunamadı`
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Maaşı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.salary}`}
                                        onChange={this.handleChange}
                                        placeholder="Maaş"
                                        name="salary"
                                        value={this.state.salary || ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Email
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.email}`}
                                                onChange={this.handleChange}
                                                name="email"
                                                placeholder="Email"
                                                value={this.state.email || ""}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Telefonu
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.phone}`}
                                                onChange={this.handleChange}
                                                name="phone"
                                                placeholder="Telefon (05xx)"
                                                maxLength="11"
                                                value={this.state.phone || ""}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Doğum Tarihi</label>
                                            <div className="row gutters-xs">
                                                <div className="col-4">
                                                    <Select
                                                        value={this.state.day}
                                                        onChange={val =>
                                                            this.handleSelect(val, "day")
                                                        }
                                                        options={this.state.select.days}
                                                        name="day"
                                                        placeholder="Gün"
                                                        styles={customStyles}
                                                        isSearchable={true}
                                                        isDisabled={
                                                            this.state.select.days ? false : true
                                                        }
                                                        noOptionsMessage={value =>
                                                            `"${value.inputValue}" bulunamadı`
                                                        }
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        value={this.state.month}
                                                        onChange={val =>
                                                            this.handleSelect(val, "month")
                                                        }
                                                        options={this.state.select.months}
                                                        name="month"
                                                        placeholder="Ay"
                                                        styles={customStyles}
                                                        isSearchable={true}
                                                        isDisabled={
                                                            this.state.select.months ? false : true
                                                        }
                                                        noOptionsMessage={value =>
                                                            `"${value.inputValue}" bulunamadı`
                                                        }
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        value={this.state.year}
                                                        onChange={val =>
                                                            this.handleSelect(val, "year")
                                                        }
                                                        options={this.state.select.years}
                                                        name="year"
                                                        placeholder="Yıl"
                                                        styles={customStyles}
                                                        isSearchable={true}
                                                        isDisabled={
                                                            this.state.select.years ? false : true
                                                        }
                                                        noOptionsMessage={value =>
                                                            `"${value.inputValue}" bulunamadı`
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Adresi</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                rows={6}
                                                placeholder="Adres"
                                                defaultValue={""}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">Vücut Metrikleri</label>
                                            <div className="row gutters-xs">
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="height"
                                                        placeholder="Boy (cm)"
                                                        min={0}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="weight"
                                                        placeholder="Kilo (kg)"
                                                        id="weight"
                                                        min={0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Cinsiyeti</label>
                                            <div className="selectgroup w-100">
                                                <label className="selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue={0}
                                                        className="selectgroup-input"
                                                        defaultChecked
                                                    />
                                                    <span className="selectgroup-button">
                                                        Erkek
                                                    </span>
                                                </label>
                                                <label className="selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue={1}
                                                        className="selectgroup-input"
                                                    />
                                                    <span className="selectgroup-button">Kız</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Kan Grubu</label>
                                            <Select
                                                value={this.state.blood}
                                                onChange={val => this.handleSelect(val, "blood")}
                                                options={this.state.select.bloods}
                                                name="blood"
                                                placeholder="Seç..."
                                                styles={customStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={this.state.select.bloods ? false : true}
                                                noOptionsMessage={value =>
                                                    `"${value.inputValue}" bulunamadı`
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">
                                            Acil Durumda İletişim
                                            <span className="form-required">*</span>
                                        </label>
                                        <div id="parent">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0">Yakınlık</th>
                                                        <th>Adı ve Soyadı</th>
                                                        <th className="pl-0">Telefon</th>
                                                        <th
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0">
                                                            Ekle/Sil
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="pl-0 pr-0">
                                                            <Select
                                                                value={this.state.kinship}
                                                                onChange={val =>
                                                                    this.handleSelect(
                                                                        val,
                                                                        "kinship"
                                                                    )
                                                                }
                                                                options={this.state.select.kinships}
                                                                name="kinship"
                                                                placeholder="Seç..."
                                                                styles={customStyles}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={
                                                                    this.state.select.kinships
                                                                        ? false
                                                                        : true
                                                                }
                                                                noOptionsMessage={value =>
                                                                    `"${
                                                                        value.inputValue
                                                                    }" bulunamadı`
                                                                }
                                                                menuPlacement="top"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td className="pl-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0 pr-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon btn-success">
                                                                <i className="fe fe-plus" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon btn-danger">
                                                                <i className="fe fe-minus" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">
                                            Okul Bilgileri<span className="form-required">*</span>
                                        </label>
                                        <div id="school">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0">Başl. Yılı</th>
                                                        <th>Bitiş Yılı</th>
                                                        <th className="pl-0">Okul Adı</th>
                                                        <th
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0">
                                                            Ekle/Sil
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="pl-0 pr-0">
                                                            <Select
                                                                value={this.state.schoolStartDate}
                                                                onChange={val =>
                                                                    this.handleSelect(
                                                                        val,
                                                                        "schoolStartDate"
                                                                    )
                                                                }
                                                                options={
                                                                    this.state.select
                                                                        .schoolStartDates
                                                                }
                                                                name="schoolStartDate"
                                                                placeholder="Seç..."
                                                                styles={customStyles}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={
                                                                    this.state.select
                                                                        .schoolStartDates
                                                                        ? false
                                                                        : true
                                                                }
                                                                noOptionsMessage={value =>
                                                                    `"${
                                                                        value.inputValue
                                                                    }" bulunamadı`
                                                                }
                                                                menuPlacement="top"
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                value={this.state.schoolEndDate}
                                                                onChange={val =>
                                                                    this.handleSelect(
                                                                        val,
                                                                        "schoolEndDate"
                                                                    )
                                                                }
                                                                options={
                                                                    this.state.select.schoolEndDates
                                                                }
                                                                name="schoolEndDate"
                                                                placeholder="Seç..."
                                                                styles={customStyles}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={
                                                                    this.state.select.schoolEndDates
                                                                        ? false
                                                                        : true
                                                                }
                                                                noOptionsMessage={value =>
                                                                    `"${
                                                                        value.inputValue
                                                                    }" bulunamadı`
                                                                }
                                                                menuPlacement="top"
                                                            />
                                                        </td>
                                                        <td className="pl-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0 pr-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon btn-success">
                                                                <i
                                                                    className="fe fe-plus"
                                                                    id="addSchool"
                                                                />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon btn-danger">
                                                                <i className="fe fe-minus" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-right">
                                <div className="d-flex" style={{justifyContent: "space-between"}}>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                            showSwal({
                                                type: "info",
                                                title: "Emin misiniz?",
                                                text:
                                                    "İşlemi iptal etmek istediğinize emin misiniz?",
                                                confirmButtonText: "Evet",
                                                cancelButtonText: "Hayır",
                                                cancelButtonColor: "#cd201f",
                                                showCancelButton: true,
                                                reverseButtons: true
                                            }).then(result => {
                                                if (result.value)
                                                    this.props.history.push("/app/employees");
                                            });
                                        }}
                                        className="btn btn-link">
                                        İptal
                                    </a>
                                    <div className="d-flex" style={{alignItems: "center"}}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="addContinuously"
                                                className="custom-switch-input"
                                                checked={this.state.addContinuously}
                                                onChange={this.handleCheck}
                                            />
                                            <span className="custom-switch-indicator" />
                                            <span className="custom-switch-description">
                                                Sürekli ekle
                                            </span>
                                        </label>
                                        <span className="mx-2">
                                            <span
                                                className="form-help"
                                                data-toggle="popover"
                                                data-placement="top"
                                                data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Personeller"</b> sayfasına yönlendirilirsiniz.</p>'>
                                                ?
                                            </span>
                                        </span>
                                        <button
                                            style={{width: 100}}
                                            type="submit"
                                            className={`btn btn-primary ml-3 ${
                                                this.state.loadingButton
                                            }`}>
                                            {this.state.addContinuously ? "Ekle" : "Ekle ve Bitir"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Add;
