import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListBirthdays } from "../../services/Report";
import "../../assets/css/c3.min.css";
import moment from "moment";
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
					list: data,
					count: data.employees.length + data.players.length
				});
			}
		});
	};

	render() {
		const { list, count } = this.state;
		return (
			<div className="card">
				<div className="card-body py-4">
					<div className="card-value float-right text-muted">
						<i className="fa fa-birthday-cake text-orange" />
					</div>
					<h3 className="mb-1">{count}</h3>
					<div className="text-muted">Bugün Doğdu</div>
				</div>
				<div className="card-body">
					<h5 className="text-muted font-weight-normal">Öğrenciler</h5>
					<div className="pt-1 pb-5">
						{list
							? list.players.length > 0
								? list.players.map((el, key) => {
										const age = parseInt(
											moment().diff(moment(el.birthday, "YYYY-MM-DD"), "year", true)
										);
										return (
											<div className="row mb-3" key={key.toString()}>
												<div className="col-auto d-flex align-items-center">
													<span
														className="avatar"
														style={{ backgroundImage: `url(${el.image})` }}>
														{el.image ? "" : avatarPlaceholder(el.name, el.surname)}
													</span>
												</div>
												<div className="col pl-1">
													<Link
														to={"/app/players/detail/" + el.uid}
														className="text-body font-weight-600 d-block">
														{fullnameGenerator(el.name, el.surname)}
													</Link>
													<span
														className="small text-muted"
														data-toggle="tooltip"
														title={moment(el.birthday).format("LL")}>
														{age} Yaşına Girdi
													</span>
												</div>
											</div>
										);
								  })
								: noRow()
							: noRow(true)}
					</div>
					<h5 className="text-muted font-weight-normal">Personeller</h5>
					<div className="pt-1">
						{list
							? list.employees.length > 0
								? list.employees.map((el, key) => {
										const age = parseInt(
											moment().diff(moment(el.birthday, "YYYY-MM-DD"), "year", true)
										);
										return (
											<div className="row mb-3" key={key.toString()}>
												<div className="col-auto d-flex align-items-center">
													<span
														className="avatar"
														style={{ backgroundImage: `url(${el.image})` }}>
														{el.image ? "" : avatarPlaceholder(el.name, el.surname)}
													</span>
												</div>
												<div className="col pl-1">
													<Link
														to={"/app/employees/detail/" + el.uid}
														className="text-body font-weight-600 d-block">
														{fullnameGenerator(el.name, el.surname)}
													</Link>
													<span
														className="small text-muted"
														data-toggle="tooltip"
														title={moment(el.birthday).format("LL")}>
														{age} Yaşına Girdi
													</span>
												</div>
											</div>
										);
								  })
								: noRow()
							: null}
					</div>
				</div>
			</div>
		);
	}
}

export default Birthdays;
