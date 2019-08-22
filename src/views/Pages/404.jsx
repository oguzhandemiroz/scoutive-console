import React, { Component } from "react";

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
		/*return (
			<div className="container pt-5 text-center">
				<div className="display-1 text-muted mb-3">
					<i className="si si-exclamation" /> 404
				</div>
				<h1 className="h2 mb-5">Hata... Aradığınız sayfa bulunamadı...</h1>
				<button className="btn btn-primary" onClick={() => this.props.history.goBack()}>
					<i className="fe fe-arrow-left mr-2" />
					Geri Dön
				</button>
			</div>
		);*/
		return (
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
		);
	}
}

export default _404;
