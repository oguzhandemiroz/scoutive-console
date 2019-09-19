import React, { Component } from "react";
import { Link } from "react-router-dom";

const tabList = [
	{
		text: "Detay",
		path: "detail",
		icon: "fa fa-info-circle"
	},
	{
		text: "Maaş Geçmişi",
		path: "salary-detail",
		icon: "fa fa-money-bill-wave"
	},
	{
		text: "İzin Geçmişi",
		path: "vacation",
		icon: "fa fa-coffee"
	},
	{
		text: "Yoklama Geçmişi",
		path: "rollcall",
		icon: "fa fa-check-square"
	}
];

export class Tabs extends Component {
	render() {
		const { match, to } = this.props;
		const splitPath = match.path.replace("/app/employees/", "").split("/")[0];

		return (
			<div className="btn-group" role="group" aria-label="Employee Tabs">
				{tabList.map((el, key) => (
					<Link
						key={key.toString()}
						to={`/app/employees/${el.path}/${to}`}
						className={`btn btn-secondary ${splitPath === el.path ? "active" : ""}`}>
						<i className={`${el.icon} mr-2`}></i>
						{el.text}
					</Link>
				))}
			</div>
		);
	}
}

export default Tabs;
