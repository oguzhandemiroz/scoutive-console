import React, { Component } from "react";
import { formValid, selectCustomStyles, emailRegEx, selectCustomStylesError } from "../../assets/js/core";
import { Toast } from "../../components/Alert";
import { CreateParent } from "../../services/Parent";
import { GetParents } from "../../services/FillSelect";
import Select from "react-select";
import { Link } from "react-router-dom";
import Inputmask from "inputmask";
import { fullnameGenerator, formatPhone } from "../../services/Others";
const $ = require("jquery");

Inputmask.extendDefaults({
    autoUnmask: true
});

Inputmask.extendAliases({
    try: {
        suffix: " ₺",
        radixPoint: ",",
        groupSeparator: ".",
        alias: "numeric",
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false,
        allowMinus: false,
        allowPlus: false,
        rightAlign: false
    }
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: "0,00",
    autoUnmask: true
};

const initialState = {
    name: null,
    surname: null,
    phone: null,
    email: null,
    kinship: { value: "Anne", label: "Anne" },
    parent: null
};

export class ParentModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            search: false,
            parents: this.props.parents || [],
            formErrors: {
                name: "",
                surname: "",
                phone: "",
                email: "",
                parent: ""
            },
            select: {
                kinships: [
                    { value: "Anne", label: "Anne" },
                    { value: "Baba", label: "Baba" },
                    { value: "Diğer", label: "Diğer" }
                ],
                parents: null
            },
            loadingButton: ""
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                name: $("[name=name]"),
                surname: $("[name=surname]"),
                phone: $("[name=phone]")
            };
            const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
            Inputmask({ alias: "try", ...InputmaskDefaultOptions }).mask(elemArray.phone);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
            Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
        } catch (e) {}
    };

    componentDidMount() {
        this.fieldMasked();
        this.setState({ parents: this.props.parents || [] });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ parents: nextProps.parents || [] });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, name, surname, phone, email, parents, kinship } = this.state;
        if (parents.length >= 2) {
            Toast.fire({
                type: "error",
                title: "Daha fazla veli oluşturamazsınız!"
            });

            return null;
        }

        let require = { ...this.state };
        delete require.email;
        delete require.parents;
        delete require.parent;
        delete require.search;
        delete require.loadingButton;

        if (formValid(require)) {
            this.setState({ loadingButton: "btn-loading" });

            CreateParent({
                uid: uid,
                name: name,
                surname: surname,
                phone: phone,
                email: email === "" ? null : email,
                password: "151117"
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        this.setState(prevState => ({
                            ...initialState,
                            parents: [
                                ...prevState.parents,
                                {
                                    uid: response.data.uid,
                                    parent_id: response.data.parent_id,
                                    kinship: kinship.value,
                                    name: name,
                                    surname: surname,
                                    phone: phone,
                                    email: email
                                }
                            ]
                        }));
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    name: name ? "" : "is-invalid",
                    surname: surname ? "" : "is-invalid",
                    phone: phone ? (phone.length !== 10 ? "is-invalid" : "") : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "name":
                formErrors.name = value.length < 2 ? "is-invalid" : "";
                break;
            case "surname":
                formErrors.surname = value.length < 2 ? "is-invalid" : "";
                break;
            case "email":
                formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
                break;
            case "phone":
                formErrors.phone = value.length !== 10 ? "is-invalid" : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value });
    };

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    getParent = () => {
        const { kinship, parent, parents } = this.state;
        if (parent && parents.filter(x => x.uid === parent.uid).length === 0) {
            this.setState(prevState => ({
                ...initialState,
                parents: [
                    ...prevState.parents,
                    {
                        uid: parent.uid,
                        parent_id: parent.value,
                        kinship: kinship.value,
                        name: parent.name,
                        surname: parent.surname,
                        phone: parent.phone,
                        email: parent.email
                    }
                ],
                formErrors: {
                    ...prevState.formErrors,
                    parent: false
                }
            }));
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    parent: true
                }
            }));
        }
    };

    assignParents = () => {
        const { parents } = this.state;
        const { assignParents } = this.props;
        assignParents(parents);
    };

    listParents = () => {
        const { select } = this.state;
        if (!select.parents)
            GetParents().then(response => {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        parents: response
                    }
                }));
            });
    };

    toggleSearch = () => {
        const search = !this.state.search;
        this.setState({ search });
        this.listParents();
    };

    render() {
        const {
            name,
            surname,
            phone,
            email,
            kinship,
            parents,
            parent,
            select,
            search,
            formErrors,
            loadingButton
        } = this.state;
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
                                <i className={`mr-2 fa fa-user text-cyan`} />
                                Veli Oluştur ve Ata
                            </h5>
                            <button
                                type="button"
                                onClick={this.toggleSearch}
                                className={`btn btn-${search ? "success" : "primary"} btn-sm ml-auto`}>
                                {search ? "Veli Oluştur" : "Veli Ara"}
                            </button>
                            <button type="button" className="close ml-0" data-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Yakınlık Durumu</label>
                                <Select
                                    value={kinship}
                                    onChange={val => this.handleSelect(val, "kinship")}
                                    options={select.kinships}
                                    name="kinship"
                                    placeholder="Seç..."
                                    styles={selectCustomStyles}
                                />
                            </div>
                            <div className={`form-group ${search ? "d-block" : "d-none"}`}>
                                <label className="form-label">
                                    Veli Ara<span className="form-required">*</span>
                                </label>
                                <Select
                                    value={parent}
                                    onChange={val => this.handleSelect(val, "parent")}
                                    options={select.parents}
                                    name="parent"
                                    placeholder="Ara..."
                                    styles={formErrors.parent ? selectCustomStylesError : selectCustomStyles}
                                    isSearchable={true}
                                    isDisabled={select.parents ? false : true}
                                    isLoading={select.parents ? false : true}
                                />
                            </div>
                            <div className={search ? "d-none" : "d-block"}>
                                <div className="form-group">
                                    <div className="row gutters-xs">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.name}`}
                                                value={name || ""}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">
                                                Soyadı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="surname"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.surname}`}
                                                value={surname || ""}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row gutters-xs">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Telefon<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.phone}`}
                                                value={phone || ""}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                name="email"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.email}`}
                                                value={email || ""}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {parents.length > 0 ? (
                                <>
                                    <hr className="my-4" />
                                    <div className="row gutters-xs">
                                        {parents.map(el => (
                                            <div className="col-6" key={el.parent_id.toString()}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="text-dark font-weight-600">{el.kinship}</div>
                                                        <Link to={`/app/parents/detail/${el.uid}`} target="_blank">
                                                            {fullnameGenerator(el.name, el.surname)}
                                                        </Link>
                                                        <div className="text-muted">
                                                            Telefon: {formatPhone(el.phone)}
                                                        </div>
                                                        <div className="text-muted">Email: {el.email}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="modal-footer">
                            {parents.length > 0 ? (
                                <button
                                    type="button"
                                    className="btn btn-cyan"
                                    onClick={this.assignParents}
                                    data-dismiss="modal">
                                    Öğrenciye Ata ve Bitir
                                </button>
                            ) : null}
                            <button
                                type="button"
                                onClick={search ? this.getParent : this.handleSubmit}
                                disabled={parents.length >= 2 ? "disabled" : ""}
                                className={`btn btn-success ml-auto ${
                                    parents.length >= 2 ? "disabled" : ""
                                } ${loadingButton}`}>
                                {search ? "Bilgileri Getir" : "Veli Oluştur"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParentModal;
