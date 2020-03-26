import React, { Component } from "react";
import { Link } from "react-router-dom";
import NotFound from "../../assets/images/illustrations/404.svg";

class _404 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dot: "."
        };
    }

    componentDidMount() {
        this.threeDots();
    }

    threeDots = () => {
        setInterval(() => {
            const { dot } = this.state;
            if (dot.length < 3) {
                this.setState({ dot: dot + "." });
            } else {
                this.setState({ dot: "." });
            }
        }, 1000);
    };

    render() {
        return (
            <div className="container pt-5 text-center">
                <div className="p-5">
                    <img src={NotFound} alt="Görünüşe bakılırsa kayboldun" />
                </div>
                <h1 className="h3 mb-5">Görünüşe bakılırsa kayboldun 🌵</h1>
                <Link className="btn btn-primary" to="/app/dashboard">
                    Güvenli Bölgeye Dön
                </Link>
            </div>
        );
        /*return (
            <div className="container pt-5">
                <div className="display-1 text-muted mb-3">
                    <i className="fa fa-hammer" />
                </div>
                <h1 className="h2 mb-5">Uyarı! Bu sayfa geliştiriliyor{this.state.dot}</h1>
                <button className="btn btn-primary mt-3" onClick={() => this.props.history.goBack()}>
                    <i className="fe fe-arrow-left mr-2" />
                    Geri Dön
                </button>
            </div>
        ); */
    }
}

export default _404;
