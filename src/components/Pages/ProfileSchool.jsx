import React, {Component} from "react";
import {Clubs, Days, Months, DateRange} from "../../services/FillSelect";
import {getSelectValue, SplitBirthday, UploadFile} from "../../services/Others";
import {GetSchool, UpdateSchool} from "../../services/School";
import {Link, withRouter} from "react-router-dom";
import Select from "react-select";

const socialMedia = ["Facebook", "Twitter", "Instagram", "LinkedIn"];

// eslint-disable-next-line
const securityNoRegEx = /^\d+$/;

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

const initialState = {
    name: null,
    club: null,
    address: null,
    club: null,
    email: null,
    founded_date: null,
    image: null,
    name: null,
    owner_name: null,
    phone_fax: null,
    phone_gsm: null,
    phone_tel: null,
    social_media: null,
    tax_no: null,
    tax_office: null,
    day: null,
    month: null,
    year: null
};

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: localStorage.getItem("UID"),
            ...initialState,
            formErrors: {},
            select: {
                clubs: null,
                days: null,
                months: null,
                years: null
            },
            onLoadedData: false,
            uploadedFile: false,
            loadingButton: ""
        };
    }

    componentDidMount() {
        const {uid, to, select} = this.state;

        Clubs().then(response => {
            select.clubs = response;
            this.setState({select});
        });

        select.days = Days();
        select.months = Months();
        select.years = DateRange(1890, 2019, true);

        GetSchool({
            uid: uid,
            to: to
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    const dataState = {};
                    console.log(data);
                    const getSplitBirthday = SplitBirthday(data.founded_date);
                    dataState.day = getSplitBirthday.day;
                    dataState.month = getSplitBirthday.month;
                    dataState.year = getSplitBirthday.year;
                    dataState.imagePreview = data.image;
                    if (data.social_media === null) {
                        dataState.social_media = {Facebook: "", Twitter: "", LinkedIn: "", Instagram: ""};
                    }
                    this.setState({...data, ...dataState, onLoadedData: true});
                }
            }
        });
    }

    reload = () => {
        const current = this.props.props.location.pathname;
        this.props.props.history.replace(`/`);
        /*setTimeout(() => {
			this.props.props.history.replace(current);
		});*/
    };

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                to,
                name,
                tax_office,
                tax_no,
                image,
                phone_gsm,
                phone_tel,
                phone_fax,
                email,
                address,
                club,
                social_media,
                owner_name,
                day,
                month,
                year,
                formErrors,
                select,
                uploadedFile,
                onLoadedData
            } = this.state;

            const requiredData = {};
            const checkDate = year && month && day ? `${year}-${month}-${day}` : null;

            requiredData.name = name;
            requiredData.tax_no = tax_no;
            requiredData.tax_office = tax_office;
            requiredData.phone_tel = phone_tel;
            requiredData.formErrors = formErrors;

            console.log(`
                ---SUBMITTING---
                name: ${name}
                tax_office: ${tax_office}
                tax_no: ${tax_no}
                phone_gsm: ${phone_gsm}
                phone_tel: ${phone_tel}
                phone_fax: ${phone_fax}
                social_media: ${JSON.stringify(social_media)}
                club: ${JSON.stringify(club)}
                email: ${email}
                address: ${address}
                image: ${image}
                owner_name: ${owner_name}
                birthday: ${checkDate}
            `);
            if (formValid(requiredData)) {
                this.setState({loadingButton: "btn-loading"});

                UpdateSchool({
                    uid: uid,
                    to: to,
                    name: name,
                    tax_no: tax_no,
                    tax_office: tax_office,
                    club_id: getSelectValue(select.clubs, club, "label", "value"),
                    address: address,
                    email: email,
                    phone_gsm: phone_gsm,
                    phone_tel: phone_tel,
                    phone_fax: phone_fax,
                    owner_name: owner_name,
                    image: image,
                    founded_date: checkDate,
                    social_media: JSON.stringify(social_media)
                }).then(response => {
                    if (response) {
                        const status = response.status;
                        if (status.code === 1020) {
                            localStorage.setItem("sImage", image);
                            localStorage.setItem("sName", name);
                            this.reload();
                        }
                    }
                    this.setState({loadingButton: ""});
                });
            } else {
                console.error("FORM INVALID - DISPLAY ERROR");
                let formErrors = {...this.state.formErrors};

                formErrors.name = name ? (name.length < 3 ? "is-invalid" : "") : "is-invalid";
                formErrors.tax_office = tax_office
                    ? tax_office.length < 3
                        ? "is-invalid"
                        : ""
                    : "is-invalid";
                formErrors.tax_no = tax_no
                    ? tax_no.length < 9
                        ? "is-invalid"
                        : !securityNoRegEx.test(tax_no)
                        ? "is-invalid"
                        : ""
                    : "is-invalid";
                formErrors.phone_tel = phone_tel
                    ? phone_tel.length !== 10
                        ? "is-invalid"
                        : ""
                    : "is-invalid";

                this.setState({formErrors});
            }
        } catch (e) {}
    };

    handleChange = e => {
        e.preventDefault();
        const {value, name} = e.target;
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "name":
                formErrors.name = value.length < 3 ? "is-invalid" : "";
                break;
            case "tax_office":
                formErrors.tax_office = value.length < 3 ? "is-invalid" : "";
                break;
            case "tax_no":
                formErrors.tax_no =
                    value.length < 9 ? "is-invalid" : !securityNoRegEx.test(value) ? "is-invalid" : "";
                break;
            case "phone_tel":
                formErrors.phone_tel = value.length !== 10 ? "is-invalid" : "";
                break;
            default:
                break;
        }
        if (name.indexOf(".") === -1) this.setState({formErrors, [name]: value});
        else {
            const splitName = name.split(".");
            this.setState(prevState => {
                return (prevState[splitName[0]][splitName[1]] = value);
            });
        }
    };

    handleSelect = (value, name, extraData, arr) => {
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "club":
                this.setState({formErrors, [name]: value ? value.label : null});
                break;
            default:
                this.setState({formErrors, [name]: value ? value.value : null});
                break;
        }
    };

    handleImage = e => {
        try {
            e.preventDefault();
            const formData = new FormData();
            const {uid, to} = this.state;
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if (reader.result !== null) {
                    this.setState({
                        imagePreview: reader.result
                    });
                }
                formData.append("image", file);
                formData.append("uid", uid);
                formData.append("to", to);
                formData.append("type", "school");
                this.setState({uploadedFile: true});
                UploadFile(formData).then(response => {
                    if (response) if (response.status.code === 1020) this.setState({image: response.data});
                    this.setState({uploadedFile: false});
                });
            };

            reader.readAsDataURL(file);
        } catch (e) {}
    };

    render() {
        const {
            name,
            tax_office,
            tax_no,
            image,
            phone_gsm,
            phone_tel,
            phone_fax,
            email,
            address,
            club,
            social_media,
            owner_name,
            day,
            month,
            year,
            select,
            formErrors,
            loadingButton,
            imagePreview,
            uploadedFile,
            onLoadedData
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Profil</h1>
                </div>

                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row mb-1">
                                            <div className="col-auto m-auto">
                                                <label
                                                    htmlFor="image"
                                                    className={`avatar ${
                                                        uploadedFile ? "btn-loading" : ""
                                                    } avatar-xxxl cursor-pointer`}
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
                                                    id="image"
                                                    name="image"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={this.handleImage}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Okul Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.name}`}
                                                placeholder="Okul Adı"
                                                name="name"
                                                value={name || ""}
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Vergi Numarası<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.tax_no}`}
                                                placeholder="Vergi Dairesi"
                                                name="tax_no"
                                                value={tax_no || ""}
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Vergi Dairesi<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.tax_office}`}
                                                placeholder="Vergi Dairesi"
                                                name="tax_office"
                                                value={tax_office || ""}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <div className="form-plaintextform-control-plaintext">
                                                {email || ""}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Bağlı olduğu kulüp</label>
                                            <Select
                                                value={getSelectValue(select.clubs, club, "label")}
                                                onChange={val => this.handleSelect(val, "club")}
                                                options={select.clubs}
                                                name="club"
                                                placeholder="Seç..."
                                                styles={
                                                    formErrors.clubs === true
                                                        ? customStylesError
                                                        : customStyles
                                                }
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={select.clubs ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-center">
                                    <Link to="/account/password/change" className="btn btn-link btn-block">
                                        Şifre Değişikliği
                                    </Link>
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
                                <div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        İş Yeri Numarası
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErrors.phone_tel}`}
                                                        name="phone_tel"
                                                        placeholder="İş Numarası"
                                                        value={phone_tel || ""}
                                                        maxLength="10"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">GSM Numarası</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone_gsm"
                                                        placeholder="GSM Numarası"
                                                        value={phone_gsm || ""}
                                                        maxLength="10"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Adresi</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="address"
                                                        rows="6"
                                                        maxLength="1000"
                                                        placeholder="Adres"
                                                        value={address || ""}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Fax Numarası</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone_fax"
                                                        placeholder="Fax Numarası"
                                                        value={phone_fax || ""}
                                                        maxLength="10"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Kurucu/Sahibi</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="owner_name"
                                                        placeholder="Kurucu/Sahibi"
                                                        value={owner_name || ""}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Kuruluş Tarihi</label>
                                                    <div className="row gutters-xs">
                                                        <div className="col">
                                                            <Select
                                                                value={getSelectValue(
                                                                    select.days,
                                                                    day,
                                                                    "value"
                                                                )}
                                                                onChange={val =>
                                                                    this.handleSelect(val, "day")
                                                                }
                                                                options={select.days}
                                                                name="day"
                                                                placeholder="Seç..."
                                                                styles={
                                                                    formErrors.days === true
                                                                        ? customStylesError
                                                                        : customStyles
                                                                }
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={select.days ? false : true}
                                                                noOptionsMessage={value =>
                                                                    `"${value.inputValue}" bulunamadı`
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Select
                                                                value={getSelectValue(
                                                                    select.months,
                                                                    month,
                                                                    "value"
                                                                )}
                                                                onChange={val =>
                                                                    this.handleSelect(val, "month")
                                                                }
                                                                options={select.months}
                                                                name="month"
                                                                placeholder="Seç..."
                                                                styles={
                                                                    formErrors.months === true
                                                                        ? customStylesError
                                                                        : customStyles
                                                                }
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={select.months ? false : true}
                                                                noOptionsMessage={value =>
                                                                    `"${value.inputValue}" bulunamadı`
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Select
                                                                value={getSelectValue(
                                                                    select.years,
                                                                    year,
                                                                    "value"
                                                                )}
                                                                onChange={val =>
                                                                    this.handleSelect(val, "year")
                                                                }
                                                                options={select.years}
                                                                name="year"
                                                                placeholder="Seç..."
                                                                styles={
                                                                    formErrors.years === true
                                                                        ? customStylesError
                                                                        : customStyles
                                                                }
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                isDisabled={select.years ? false : true}
                                                                noOptionsMessage={value =>
                                                                    `"${value.inputValue}" bulunamadı`
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <label className="form-label">Sosyal Medya Hesapları</label>
                                                <div>
                                                    <table className="table table-vcenter mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="pl-0">Platform</th>
                                                                <th>URL</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {social_media
                                                                ? socialMedia.map((el, key) => (
                                                                      <tr key={key.toString()}>
                                                                          <td className="pl-0 pr-0">{el}</td>
                                                                          <td className="pr-0">
                                                                              <input
                                                                                  type="text"
                                                                                  className="form-control"
                                                                                  name={`social_media.${el}`}
                                                                                  value={
                                                                                      social_media[el] || ""
                                                                                  }
                                                                                  onChange={this.handleChange}
                                                                              />
                                                                          </td>
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

                            <div className="card-footer text-right">
                                <div className="d-flex" style={{justifyContent: "space-between"}}>
                                    <a href="javascript:void(0)" className="btn btn-link">
                                        İptal
                                    </a>
                                    <button
                                        style={{width: 100}}
                                        type="submit"
                                        disabled={uploadedFile ? true : !onLoadedData ? true : false}
                                        className={`btn btn-primary ml-3 ${loadingButton}`}>
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Profile);
