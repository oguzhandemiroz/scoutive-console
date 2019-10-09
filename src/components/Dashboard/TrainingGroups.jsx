import React, { Component } from "react";
import { Link } from "react-router-dom";
import TrainingPlayers from "./TrainingPlayers";
import { TrainingGroups } from "../../services/Report";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import moment from "moment";
const $ = require("jquery");

const noRow = loading =>
	loading ? (
		<div className={`dimmer active`}>
			<div className="loader" />
			<div className="dimmer-content">
				<div className="card-body">
					<div className="card-value float-right text-muted">
						<i className="fa fa-running" />
					</div>
					<div className="text-muted d-flex align-items-center" style={{ height: "3.4rem" }}>
						Antrenmanda olan gruplar yükleniyor...
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="card-body">
			<div className="card-value float-right text-muted">
				<i className="fa fa-running" />
			</div>
			<div className="text-muted d-flex align-items-center" style={{ height: "3.4rem" }}>
				Şu an antrenmanda olan grup bulunamadı...
			</div>
		</div>
	);
export class TrainingGroupList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			trainings: null,
			data: {
				players: []
			},
			timer: "00:00:00"
		};
	}

	componentDidMount() {
		this.listGroups();
	}

	componentDidUpdate() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	listGroups = () => {
		TrainingGroups().then(response => this.setState({ trainings: response.data }));
	};

	timer = end_time => {
		if (end_time) {
			var eventTime = moment(moment().format("YYYY-MM-DD") + " " + end_time).unix();
			var currentTime = moment().unix();
			var diffTime = eventTime - currentTime;
			var duration = moment.duration(diffTime * 1000, "milliseconds");
			var interval = 1000;
			var hours, minutes, seconds;

			setInterval(() => {
				duration = moment.duration(duration - interval, "milliseconds");

				hours = duration.hours() < 10 ? "0" + duration.hours() : duration.hours();
				minutes = duration.minutes() < 10 ? "0" + duration.minutes() : duration.minutes();
				seconds = duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds();

				//this.setState({ timer: hours + ":" + minutes + ":" + seconds });
			}, interval);
		}
	};

	render() {
		const { trainings, data, timer } = this.state;
		return (
			<div className="card">
				{trainings
					? trainings.length > 0
						? trainings.map((el, key) => {
								return (
									<div className="card-body" key={key.toString()}>
										<div className="card-value float-right text-muted">
											<i className="fa fa-running text-green-light" />
										</div>
										<Link to={"/app/groups/detail/" + el.group_id} className="h4 mb-1">
											{el.name}
										</Link>
										<div className="text-muted">
											Grubu&nbsp;
											<strong className="text-body">
												{el.area ? el.area.name + "'de " : ""}
											</strong>
											antrenmanda
										</div>
										<div className="row clear-both pt-4">
											<div className="col-auto d-lg-flex align-items-center">
												<div
													className="avatar"
													style={{ backgroundImage: `url(${el.employee.image})` }}>
													{el.employee.image
														? ""
														: avatarPlaceholder(el.employee.name, el.employee.surname)}
												</div>
											</div>
											<div className="col pl-1">
												<Link
													to={"/app/employees/detail/" + el.employee.uid}
													className="text-body font-weight-600 d-block">
													{fullnameGenerator(el.employee.name, el.employee.surname)}
												</Link>
												<span
													className="small text-muted"
													data-toggle="tooltip"
													title={el.employee.permission}>
													Sorumlu Antrenör
												</span>
											</div>
											<div className="col-auto d-flex flex-column align-items-center">
												<span
													className="tag tag-gray-dark"
													data-original-title="Antrenman Saati"
													data-offset="-35"
													data-toggle="tooltip">
													{moment(el.start_time, "HH:mm").format("HH:mm")}&nbsp;&mdash;&nbsp;
													{moment(el.end_time, "HH:mm").format("HH:mm")}
												</span>
											</div>
										</div>
										<div className="row mt-5">
											<div className="col-12">
												{el.players.length === 0 ? (
													<div className="text-muted text-center">
														Gruba ait öğrenci bulunamadı...
													</div>
												) : (
													<button
														onClick={() =>
															this.setState({
																data: {
																	name: el.name,
																	players: el.players,
																	start_time: el.start_time,
																	end_time: el.end_time
																}
															})
														}
														className="btn btn-block btn-secondary"
														data-toggle="modal"
														data-target="#trainingPlayers">
														Antrenmanda Olan Öğrenciler
													</button>
												)}
											</div>
										</div>
									</div>
								);
						  })
						: noRow()
					: noRow(true)}
				<TrainingPlayers data={data} />
			</div>
		);
	}
}

export default TrainingGroupList;
