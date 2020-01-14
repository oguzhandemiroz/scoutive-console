import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ListPlayers } from "../../services/Player";
import { ListParents } from "../../services/Parent";
import { selectCustomStyles } from "../../assets/js/core";
import { fullnameGenerator } from "../../services/Others";

export class SingleAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: this.props.match.params.uid,
            personType: this.props.match.params.ptype || null,
            select: {
                players: null
            },
            player: null
        };

        console.log(this.props.match.params);
    }

    componentDidMount() {
        const { uid, to, personType } = this.state;
        console.log(to);
        switch (personType) {
            case "player":
                this.listPlayers();
                break;
            default:
                break;
        }
    }

    handleSelect = (value, name) => {
        try {
            switch (value) {
                default:
                    this.setState({
                        [name]: value,
                        to: value.value
                    });
                    break;
            }
        } catch (e) {}
    };

    handlePersonType = e => {
        const { name, value } = e.target;
        const { to } = this.state;
        switch (value) {
            case "player":
                this.listPlayers();
                break;

            default:
                break;
        }
        if (to) this.props.history.push(`/app/messages/single/add`);
        this.setState({ [name]: value });
    };

    listPlayers = () => {
        try {
            const { to } = this.state;
            ListPlayers().then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data.filter(x => x.is_trial === 0);
                        const players = [];

                        data.map(el => {
                            let playerdata = { ...el };
                            delete playerdata.uid;

                            players.push({
                                value: el.uid,
                                label: fullnameGenerator(el.name, el.surname),
                                ...playerdata
                            });
                        });

                        const thisplayer = players.filter(x => x.value === to) || {};

                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                players: players
                            },
                            player: thisplayer[0]
                        }));
                    }
                }
            });
        } catch (e) {}
    };

    render() {
        const { uid, to, personType, select, player } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Tekli Mesaj Oluştur</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Tekli Mesaj Oluştur</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="hr-text mt-0">Kişi Türü Seç</div>
                                        <div className="selectgroup w-100">
                                            <label className="selectgroup-item">
                                                <input
                                                    className="selectgroup-input"
                                                    type="radio"
                                                    name="personType"
                                                    value="player"
                                                    checked={personType === "player"}
                                                    onChange={this.handlePersonType}
                                                />
                                                <span className="selectgroup-button">Öğrenci</span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    className="selectgroup-input"
                                                    type="radio"
                                                    name="personType"
                                                    value="parent"
                                                    checked={personType === "parent"}
                                                    onChange={this.handlePersonType}
                                                />
                                                <span className="selectgroup-button">Veli</span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    className="selectgroup-input"
                                                    type="radio"
                                                    name="personType"
                                                    value="employee"
                                                    checked={personType === "employee"}
                                                    onChange={this.handlePersonType}
                                                />
                                                <span className="selectgroup-button">Personel</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="hr-text">Kişi Seç</div>
                                        <Select
                                            value={player}
                                            onChange={val => this.handleSelect(val, "player")}
                                            options={select.players}
                                            name="player"
                                            placeholder="Öğrenci Seç..."
                                            styles={selectCustomStyles}
                                            autoSize
                                            isSearchable={true}
                                            isDisabled={select.players ? false : true}
                                            isLoading={select.players ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        />
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

export default SingleAdd;
