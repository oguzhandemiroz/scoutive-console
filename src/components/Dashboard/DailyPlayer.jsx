import React, { Component } from "react";
import { CreatedPlayers } from "../../services/Report";
import moment from "moment";

export class DailyPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			count: null
		};
	}

	componentDidMount() {
		this.listPlayerRecord();
	}

	listPlayerRecord = () => {
		const { uid } = this.state;
		CreatedPlayers({
			uid: uid,
			start_date: moment()
				.startOf("day")
				.format("YYYY-MM-DD HH:mm:ss"),
			end_date: moment()
				.endOf("day")
				.format("YYYY-MM-DD HH:mm:ss")
		}).then(response => {
			const data = response.data;
			const status = response.status;
			if (status.code === 1020) {
				this.setState({
					count: data.length
				});
			}
		});
	};

	render() {
		const { count } = this.state;
		return (
			<div className="col-md-6 col-sm-6 col-lg-3">
				<div className="card">
					<div className="card-body p-3 text-center">
						{count !== null ? (
							<div className="h1 m-0 mt-2" data-toggle="tooltip" title="Bugün Kayıt Olan Öğrenci">
								{count}
							</div>
						) : (
							<div className="loader m-auto" />
						)}
						<div className="text-muted mb-2">Öğrenci</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DailyPlayer;
