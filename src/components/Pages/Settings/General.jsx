import React, { Component } from "react";
import Area from "./General/Area";

export class General extends Component {
	constructor(props) {
		super(props);

		this.state = {
			areas: null,
			loadingButton: ""
		};
	}

	render() {
		return (
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">Genel</h3>
				</div>
				<div className="card-body">
					<Area />
				</div>
			</div>
		);
	}
}

export default General;
