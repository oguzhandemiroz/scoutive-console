import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UnpaidPlayers } from "../../services/Report";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import moment from "moment";

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

export class UnpaidPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			list: null
		};
	}

	componentDidMount() {
		this.getUnpaidPlayers();
	}

	componentDidUpdate() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	getUnpaidPlayers = () => {
		UnpaidPlayers().then(response => {
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
						<i className="fa fa-hand-holding-usd text-danger" />
					</div>
					<h4 className="mb-1">Aidat</h4>
					<div className="text-muted">Ödeme Yapmayanlar</div>
				</div>
				<div className="card-body">
					<div className="pb-5">
					{noRow()}
						{/* <div className="row mb-3">
							<div className="col-auto d-flex align-items-center">
								<span className="avatar" style={{ backgroundImage: `url(${null})` }}>
									HB
								</span>
							</div>
							<div className="col px-1">
								<div className="text-body font-weight-600">Keke Keko</div>
								<div className="text-body"><strong className="text-red"></strong></div>
								<span className="small text-muted" data-toggle="tooltip" title="">

								</span>
							</div>
							<div className="col-auto">
								<a
									href="javascript:void(0)"
									className="icon"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false">
									<i className="fe fe-more-vertical"></i>
								</a>
								<div className="item-action dropdown">
									<div className="dropdown-menu dropdown-menu-right">
										<Link to={"/app/players/payment/" + ""} className="dropdown-item">
											<i className="dropdown-icon fa fa-hand-holding-usd" /> Ödeme Al
										</Link>
										<Link
											to={"/app/players/detail/"}
											className="dropdown-item cursor-not-allowed disabled">
											<i className="dropdown-icon fa fa-exclamation-triangle"></i> Ödeme İkazı
											<span className="ml-1">
												(<i className="fe fe-lock mr-0" />)
											</span>
										</Link>
										<div role="separator" className="dropdown-divider" />
										<Link to={"/app/players/fee-detail/" + ""} className="dropdown-item">
											<i className="dropdown-icon fa fa-receipt" /> Tüm Aidat Bilgisi
										</Link>
										<Link to={"/app/players/detail/" + ""} className="dropdown-item">
											<i className="dropdown-icon fa fa-info-circle" /> Tüm Bilgileri
										</Link>
									</div>
								</div>
							</div>
						</div> */}
						{/*list
							? list.length > 0
								? list.map((el, key) => {
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
													<div className="text-body font-weight-600">
														{fullnameGenerator(el.name, el.surname)}
													</div>
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
								: noRow(true)*/}
					</div>
				</div>
			</div>
		);
	}
}

export default UnpaidPlayer;
