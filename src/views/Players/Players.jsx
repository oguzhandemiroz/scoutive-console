import React, { Component } from "react";
import Table from "../../components/Players/List";
import { ListPlayers } from "../../services/Player";
import { Link } from "react-router-dom";
import DailyPlayer from "../../components/Players/Charts/DailyPlayer";
import TotalFee from "../../components/Players/Charts/TotalFee";
import DailyCreatedPlayer from "../../components/Players/Charts/DailyCreatedPlayer";
import TotalPlayerCount from "../../components/Players/Charts/TotalPlayerCount";

class Players extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: []
		};
	}

	componentDidMount() {
		this.renderPlayerList();
	}

	renderPlayerList = () => {
		const { uid } = this.state;
		ListPlayers(uid).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) this.setState({ data: response.data });
			}
		});
	};

	render() {
		const { data } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenciler</h1>
					<Link
						to="/app/players/add"
						className="btn btn-icon btn-sm btn-success ml-auto dropdown-toggle"
						data-toggle="dropdown">
						Öğrenci Ekle
					</Link>

					<div className="dropdown-menu">
						<Link to="/app/players/add" className="dropdown-item">
							Normal Öğrenci Ekle
						</Link>
						<Link to="/app/players/add/trial" className="dropdown-item">
							Deneme Öğrenci Ekle
						</Link>
					</div>
				</div>

				<div className="row row-cards">
					<div className="col-sm-6 col-md-4">
						<DailyPlayer data={data.filter(x => x.status === 1)} />
					</div>
					<div className="col-sm-6 col-md-4">
						<TotalPlayerCount data={data} />
					</div>
					<div className="col-sm-6 col-md-4">
						<div className="card">
							<TotalFee data={data} />
							<DailyCreatedPlayer />
						</div>
					</div>
				</div>
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Tüm Öğrenciler</h3>
							</div>
							<div className="table-responsive player-list">
								<Table history={this.props.history} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Players;
