import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListBirthdays } from "../../services/Report";
import "../../assets/css/c3.min.css";
import moment from "moment";
import "moment/locale/tr";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
const $ = require("jquery");

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

export class Birthdays extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			list: null,
			count: 0
		};
	}

	componentDidMount() {
		this.listBirthdays();
	}

	componentDidUpdate() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	listBirthdays = () => {
		ListBirthdays().then(response => {
			const data = response.data;
			const status = response.status;
			if (status.code === 1020) {
				this.setState({
					list: data
				});
			}
		});
	};

	render() {
		const { list } = this.state;
		return (
			<div className="card">
				<div className="card-body py-4">
					<div className="card-value float-right text-muted">
						<i
							className={`fa fa-birthday-cake ${
								list ? (list.players.length > 0 || list.employees.length > 0 ? "text-orange" : "") : ""
							}`}
						/>
					</div>

					<h4 className="mb-1">Doğum Günü</h4>
					<div className="text-muted">Mutlu Yıllar</div>
				</div>
				<div className="card-body">
					{list ? (
						(list.players.length === 0) & (list.employees.length === 0) ? (
							noRow()
						) : (
							<div>
								{list.players.length > 0 ? (
									<div>
										<h5 className="text-muted font-weight-normal">Öğrenciler</h5>
										<div className={`pt-1 ${list.employees.length > 0 ? "pb-5" : ""}`}>
											{list.players
												.sort((a, b) => b.birthday.localeCompare(a.birthday))
												.map((el, key) => {
													const age = Math.round(
														moment().diff(moment(el.birthday, "YYYY-MM-DD"), "year", true)
													);
													return (
														<div className="row mb-3" key={key.toString()}>
															<div className="col-auto d-flex align-items-center">
																<span
																	className="avatar"
																	style={{
																		backgroundImage: `url(${el.image})`
																	}}>
																	{el.image
																		? ""
																		: avatarPlaceholder(el.name, el.surname)}
																</span>
															</div>
															<div className="col pl-1">
																<Link
																	to={"/app/players/detail/" + el.uid}
																	className="text-body font-weight-600 d-block">
																	{fullnameGenerator(el.name, el.surname)}
																</Link>
																<span className="small text-muted d-block">
																	{moment(el.birthday)
																		.year(moment().year())
																		.format("DD MMMM, dddd")}
																</span>
																<span className="small text-muted">
																	<i className="fa fa-gift text-instagram mr-2" />
																	{age}. Yaşını Kutlarız!
																</span>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								) : null}
								{list.employees.length > 0 ? (
									<div>
										<h5 className="text-muted font-weight-normal">Personeller</h5>
										<div className="pt-1">
											{list.employees
												.sort((a, b) => b.birthday.localeCompare(a.birthday))
												.map((el, key) => {
													const age = parseInt(
														moment().diff(moment(el.birthday, "YYYY-MM-DD"), "year", true)
													);
													return (
														<div className="row mb-3" key={key.toString()}>
															<div className="col-auto d-flex align-items-center">
																<span
																	className="avatar"
																	style={{ backgroundImage: `url(${el.image})` }}>
																	{el.image
																		? ""
																		: avatarPlaceholder(el.name, el.surname)}
																</span>
															</div>
															<div className="col pl-1">
																<Link
																	to={"/app/employees/detail/" + el.uid}
																	className="text-body font-weight-600 d-block">
																	{fullnameGenerator(el.name, el.surname)}
																</Link>
																<span className="small text-muted d-block">
																	{moment(el.birthday).format("DD MMMM, dddd")}
																</span>
																<span className="small text-muted">
																	<i className="fa fa-gift text-instagram mr-2" />
																	{age}. Yaşını Kutlarız!
																</span>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								) : null}
							</div>
						)
					) : (
						noRow(true)
					)}
				</div>
			</div>
		);
	}
}

export default Birthdays;
