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
                        <label className="form-label">Saha Ayarları</label>
                        <div className="row gutters-xs mb-3">
                            <div className="col-6">
                                <input type="text" className="form-control" placeholder="Saha 1" />
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" placeholder="Saha 2" />
                            </div>
                        </div>
                        <div className="row gutters-xs">
                            <div className="col-6">
                                <input type="text" className="form-control" placeholder="Saha 3" />
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" placeholder="Saha 4" />
                            </div>
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
