import React, {Component} from "react";
import {Clubs} from "../../services/FillSelect";
import {Link} from "react-router-dom";
import Select from "react-select";

const socialMedia = ["Facebok", "Twitter", "Instagram", "LinkedIn"];

// eslint-disable-next-line
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
    club: null
};

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            formErrors: {},
            select: {
                clubs: null
            },
            onLoadedData: true
        };
    }

    componentDidMount() {
        const {select} = this.state;

        Clubs().then(response => {
            select.clubs = response;
            this.setState({select});
        });
    }

    render() {
        const {
            name,
            email,
            phone,
            image,
            group,
            select,
            formErrors,
            uploadedFile,
            to,
            onLoadedData
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Profil</h1>
                </div>

                <div className="row">
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
                                                        !uploadedFile ? "" : "btn-loading"
                                                    } avatar-xxxl cursor-pointer`}
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: ".875rem",
                                                        backgroundImage: `url(${image})`
                                                    }}>
                                                    {!image ? "Fotoğraf ekle" : ""}
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
                                                Email<span className="form-required">*</span>
                                            </label>
                                            <div className="form-control-plaintext" name="email">
                                                ...
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Vergi Numarası<span className="form-required">*</span>
                                            </label>
                                            <div className="form-control-plaintext" name="taxNo">
                                                ...
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Vergi Dairesi<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control state-valid"
                                                placeholder="Vergi Dairesi"
                                                name="taxOffice"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Okul Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Okul Adı"
                                                name="name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Bağlı olduğu kulüp</label>
                                            <Select
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
                                                        className="form-control"
                                                        name="phoneTel"
                                                        placeholder="İş Numarası"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">GSM Numarası</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phoneGSM"
                                                        placeholder="GSM Numarası"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Adresi</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="address"
                                                        rows="6"
                                                        placeholder="Adres"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Fax Numarası</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phoneFax"
                                                        placeholder="Fax Numarası"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Kurucu/Sahibi</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="owner"
                                                        placeholder="Kurucu/Sahibi"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Kuruluş Tarihi</label>
                                                    <div className="row gutters-xs">
                                                        <div className="col">d</div>
                                                        <div className="col">m</div>
                                                        <div className="col">y</div>
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
                                                            {socialMedia.map((el, key) => (
                                                                <tr key={key.toString()}>
                                                                    <td className="pl-0 pr-0">{el}</td>
                                                                    <td className="pr-0">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))}
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
                                    <div className="d-flex" style={{alignItems: "center"}}>
                                        <button type="submit" className="btn btn-primary ml-3">
                                            Kaydet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
