import React, { Component } from "react";

class _404 extends Component {
	render() {
		return (
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
		);
	}
}

export default _404;
