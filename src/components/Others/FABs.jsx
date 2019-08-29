import React, { Component } from "react";
import { Link } from "react-router-dom";
const $ = require("jquery");

export class FABs extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dropdown: true
		};
	}

	componentDidMount() {
		$('[data-toggle="tooltip"]').tooltip({
			trigger: "hover",
			delay: { show: "500" }
		});

		$(".dropdown-menu").mouseover(function() {
			$('[data-toggle="tooltip"]').tooltip("hide");
		});

		$("#FABs").click(function() {
			$(".FABs-wrapper").toggleClass("fixed");
			$('[data-toggle="tooltip"]').tooltip("hide");
		});
	}

	render() {
		return (
			<div className="FABs-wrapper" data-toggle="tooltip" title="Hızlı Erişim Menüsü">
				<div className="dropup">
					<span className="FABs-pin">
						<i className="fa fa-thumbtack text-white"></i>
					</span>
					<button id="FABs" className="btn btn-secondary btn-lg" data-toggle="dropdown">
						<i className="fe fe-zap"></i>
					</button>
					<div className="dropdown-menu">
						<h6 className="dropdown-header">Hızlı Erişim Menüsü</h6>
						<div className="dropdown-divider"></div>
						<Link to="/app/players/add" className="dropdown-item">
							<i className="fa fa-user-plus mr-1"></i> Öğrenci Ekle
						</Link>
						<Link to="/app/players/payment" className="dropdown-item">
							<i className="fa fa-hand-holding-usd mr-1"></i> Ödeme Al
						</Link>
					</div>
				</div>

				{/* <div className={`FABs-dropdown ${dropdown ? "show" : ""}`}>
					<h5 className="dropdown-header">Hızlı Erişim Menüsü</h5>
					<div className="dropdown-divider"></div>
					<Link to="#" className="dropdown-item">
						<i className="fe fe-user mr-1"></i> Öğrenci Ekle
					</Link>
					<Link to="#" className="dropdown-item">
						<i className="fa fa-hand-holding-usd mr-1"></i> Ödeme Al
					</Link>
				</div> */}
			</div>
		);
	}
}

export default FABs;
