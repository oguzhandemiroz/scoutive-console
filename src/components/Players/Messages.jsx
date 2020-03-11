import React, { Component } from "react";
import Select, { components } from "react-select";
import { DetailPlayer } from "../../services/Player";
import { fullnameGenerator, nullCheck, formatPhone } from "../../services/Others";
import { selectCustomStyles } from "../../assets/js/core";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";
import { CreateRecipient } from "../../services/Messages";

const { Option } = components;
const OptionRecipient = props => (
    <Option {...props}>
        {props.data.label}{" "}
        {props.data.isDisabled ? <span className="font-italic text-gray">(İletişim bilgisi bulunmuyor)</span> : null}
    </Option>
);

export class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            attributes: {},
            data: {},
            groups: [],
            select: {
                recipients: null
            },
            loading: "active",
            loadingButton: ""
        };
    }

    componentDidMount() {
        this.detailPlayer();
    }

    handleSubmit = () => {
        const { uid, recipient } = this.state;
        if (recipient) {
            this.setState({ loadingButton: "btn-loading" }); /*  */
            CreateRecipient({
                uid: uid,
                recipients: [{ ...recipient }]
            }).then(response => this.reload());
        }
    };

    handleSelect = (value, name) => {
        this.setState({
            [name]: value
        });
    };

    detailPlayer = () => {
        const { uid, to } = this.state;
        DetailPlayer({ uid: uid, to: to, attribute_values: [] }).then(response => {
            if (response !== null) {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data;
                        const recipients = [
                            {
                                label: `Kendisi — ${fullnameGenerator(data.name, data.surname)}`,
                                fullname: fullnameGenerator(data.name, data.surname),
                                kinship: "Kendisi",
                                value: `player_${data.player_id}`,
                                player_id: data.player_id,
                                parent_id: 0,
                                phone: data.phone,
                                email: data.email,
                                isDisabled: !data.phone && !data.email ? true : false
                            }
                        ];

                        data.parents.map(el =>
                            recipients.push({
                                label: `Velisi (${el.kinship}) — ${fullnameGenerator(el.name, el.surname)}`,
                                fullname: fullnameGenerator(el.name, el.surname),
                                kinship: el.kinship,
                                player_id: data.player_id,
                                value: `parent_${el.parent_id}`,
                                parent_id: el.parent_id,
                                phone: el.phone,
                                email: el.email,
                                isDisabled: !el.phone && !el.email ? true : false
                            })
                        );

                        delete data.uid;
                        this.setState(prevState => ({
                            ...data,
                            recipient:
                                data.recipient_parent_id === -1
                                    ? null
                                    : data.recipient_parent_id === 0
                                    ? { ...recipients.filter(x => x.player_id === data.player_id)[0], isRegister: true }
                                    : {
                                          ...recipients.filter(x => x.parent_id === data.recipient_parent_id)[0],
                                          isRegister: true
                                      },
                            loading: "",
                            select: {
                                ...prevState.select,
                                recipients: recipients
                            }
                        }));
                    }
                }
            }
        });
    };

    reload = () => {
        setTimeout(() => {
            const current = this.props.history.location.pathname;
            this.props.history.replace("/app/reload");
            setTimeout(() => {
                this.props.history.replace(current);
            });
        }, 500);
    };

    render() {
        const { to, recipient, select, loadingButton } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay &mdash; İletişim Servisi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>

                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">İletişim Servisi</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">İletişime Geçilecek Kişi</label>
                                    <Select
                                        value={recipient}
                                        onChange={val => this.handleSelect(val, "recipient")}
                                        options={select.recipients}
                                        name="recipient"
                                        placeholder="Seç..."
                                        styles={selectCustomStyles}
                                        isSearchable={true}
                                        isDisabled={select.recipients ? false : true}
                                        isLoading={select.recipients ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        components={{ Option: OptionRecipient }}
                                    />
                                    {recipient ? (
                                        <div className="mt-3 mb-0">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row row-sm align-items-center">
                                                        <div className="col">
                                                            <h4 className="mb-0">{recipient.fullname}</h4>
                                                            <div className="text-muted text-h5">
                                                                {recipient.kinship}
                                                            </div>
                                                        </div>
                                                        {recipient.isRegister ? (
                                                            <div className="col-auto leading-none align-self-start">
                                                                <span className="badge badge-success">KAYITLI</span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="row row-sm align-items-center mt-3">
                                                        <div className="col-sm-6 col-lg-3 mb-2">
                                                            <label className="form-label">Telefon</label>
                                                            {formatPhone(recipient.phone)}
                                                        </div>
                                                        <div className="col-auto">
                                                            <label className="form-label">Email</label>
                                                            {nullCheck(recipient.email)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="font-italic text-muted mt-3 mb-0">
                                        <p>
                                            <strong>İletişime Geçilecek Kişi</strong> ayarlanmadığında bu öğrenciye veya
                                            velisine her hangi bir mesaj (SMS ve E-posta) gönderimi yapılmayacaktır.
                                        </p>
                                        Bilgilerin doğrululuğuna ve tam olmasına dikkat ediniz.
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={this.handleSubmit}
                                    disabled={recipient ? false : true}
                                    className={`btn btn-sm btn-primary ${loadingButton}`}>
                                    Değişiklikleri Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messages;
