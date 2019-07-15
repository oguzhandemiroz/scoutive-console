import React, {Component} from "react";

export class General extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: null,
            loadingButton: ""
        };
    }

    getLocation = () => {
        try {
            /*fetch("http://ipinfo.io/json")
                .then(res => res.json())
                .then(response => console.log(response));*/
            this.setState({loadingButton: "btn-loading"});
            setTimeout(() => {
                this.setState({location: "İstanbul", loadingButton: ""});
            }, 1500);
        } catch (e) {}
    };

    render() {
        const {location, loadingButton} = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Genel</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label className="form-label">Güvenli Bölge</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Konum Belirle..."
                                value={location || ""}
                            />
                            <span className="input-group-append">
                                <button
                                    className={`btn btn-indigo btn-icon ${loadingButton}`}
                                    type="button"
                                    onClick={this.getLocation}>
                                    <i className="fe fe-map-pin"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-right">
                    <button type="submit" className={`btn btn-primary`}>
                        Kaydet
                    </button>
                </div>
            </div>
        );
    }
}

export default General;
