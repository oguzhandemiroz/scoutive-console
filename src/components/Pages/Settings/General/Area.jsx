import React, { Component } from "react";
import { ListAreas, UpdateAreas } from "../../../../services/School";

export class Area extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            areas: null,
            show: false,
            loadingButton: ""
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, areas } = this.state;
        this.setState({ loadingButton: "btn-loading" });
        areas.map((el, key) => {
            if (el.name === "") return (areas[key].name = "Saha - " + (key + 1));
        });
        UpdateAreas({
            uid: uid,
            areas: areas
        }).then(response => this.setState({ loadingButton: "", show: false }));
    };

    handleChange = e => {
        const { value, name } = e.target;
        const { areas } = this.state;
        let changed = areas.find(x => x.area_id === parseInt(name));
        changed.name = value;

        this.setState(prevState => ({
            areas: [...prevState.areas]
        }));
    };

    showAreaSettings = () => {
        this.setState({ loadingButton: "btn-loading" });
        ListAreas().then(response => {
            if (response) {
                this.setState({ areas: response.data, loadingButton: "", show: true });
            }
        });
    };

    getAreas = () => {};

    render() {
        const { areas, show, loading, loadingButton } = this.state;
        return (
            <form className="row" onSubmit={this.handleSubmit}>
                <div className="col-2">
                    <strong>Saha Ayarları</strong>
                </div>
                <div className="col-10">
                    {show ? (
                        <div className={`dimmer ${loading}`}>
                            <div className="loader" />
                            <div className="dimmer-content">
                                <div>
                                    <div className="row gutters-xs mb-2">
                                        {areas
                                            ? areas.map((el, key) => {
                                                  return (
                                                      <div className="col-lg-3 col-md-3 col-sm-6" key={key.toString()}>
                                                          <input
                                                              type="text"
                                                              className="form-control"
                                                              placeholder={"Saha - " + (key + 1)}
                                                              value={el.name}
                                                              name={el.area_id}
                                                              onChange={this.handleChange}
                                                          />
                                                      </div>
                                                  );
                                              })
                                            : null}
                                    </div>
                                </div>
                                <button type="submit" className={`btn btn-sm btn-primary ${loadingButton}`}>
                                    Değişiklikleri Kaydet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={this.showAreaSettings}
                            className={`btn btn-secondary text-left ${loadingButton}`}>
                            Saha Ayarları
                        </button>
                    )}

                    <div className="font-italic text-muted mt-2 mb-0">
                        Sahalar, gruplarda kullanılır. Sahaları gruplarda <b>Antrenman Sahası</b> olarak
                        tanımlayabilirsiniz.
                        <br />
                        Sistemde kayıtlı olan sahaların isimlerini değiştirebilirsiniz.
                    </div>
                </div>
            </form>
        );
    }
}

export default Area;
