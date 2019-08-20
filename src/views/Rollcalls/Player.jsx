import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tabs from "../../components/Rollcalls/Tabs";
import List from "../../components/Rollcalls/Player/List";

export class Player extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Öğrenciler</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<Tabs />
					</div>
				</div>

				<div className="row">
					<div className="col-lg-12">
						<List />
					</div>
				</div>
			</div>
		);
	}
}

export default Player;
