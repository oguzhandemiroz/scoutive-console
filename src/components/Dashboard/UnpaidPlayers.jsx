import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UnpaidPlayers } from "../../services/Report";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import moment from "moment";

const $ = require("jquery");

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3 mb-5`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic pb-4">Kayıt bulunamadı...</div>
	);

export class UnpaidPlayer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			list: null,
			count: 0
		};
	}

	componentDidMount() {
		this.getUnpaidPlayers();
	}

	componentDidUpdate() {
		$('[data-toggle="popover"]').popover({
			html: true,
			trigger: "hover"
		});
	}

	getUnpaidPlayers = () => {
		UnpaidPlayers().then(response => {
			const data = response.data;
			const status = response.status;
			if (status.code === 1020) {
				this.setState({
					list: data.sort((a, b) => {
						return a.required_payment_date < b.required_payment_date ? -1 : 1;
					}),
					count: data.length
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
						<i className={`fa fa-hand-holding-usd ${count > 0 ? "text-danger" : ""}`} />
					</div>
					<h4 className="mb-1">Aidat</h4>
					<div className="text-muted">Ödeme Yapmayanlar</div>
				</div>
				<div className="card-body pb-1">
					{list
						? list.length > 0
							? list.map((el, key) => {
									if (key > 4) return null;
									const count = moment(new Date(), "YYYY-MM-DD").diff(
										moment(el.required_payment_date, "YYYY-MM-DD"),
										"days"
									);
									let badgeColor = "badge-secondary";
									switch (true) {
										case count <= 7:
											badgeColor = "bg-red-light";
											break;
										case count >= 7 && count <= 30:
											badgeColor = "bg-red";
											break;
										case count >= 30:
											badgeColor = "bg-red-dark";
											break;
										default:
											badgeColor = "badge-secondary";
											break;
									}
									return (
										<div className="row mb-4" key={key.toString()}>
											<div className="col-auto px-2">
												<span
													className="avatar avatar-xs"
													style={{ backgroundImage: `url(${el.image})` }}>
													{el.image ? "" : avatarPlaceholder(el.name, el.surname)}
												</span>
											</div>
											<div className="col px-1">
												<div className="text-body font-weight-600">
													{fullnameGenerator(el.name, el.surname)}
												</div>
												<span
													data-toggle="popover"
													data-placement="top"
													data-content={
														"<b>Ödemesi Gereken Tarih: </b>" +
														moment(el.required_payment_date).format("LL")
													}
													className={`badge mr-1 ${badgeColor} px-2 py-1`}
													style={{ fontSize: 12 }}>
													Ödemesi
													<strong className="font-weight-bolder" style={{ fontSize: 13 }}>
														&nbsp;{count}&nbsp;gün&nbsp;
													</strong>
													gecikmiş!
												</span>
												<div className="small text-muted mt-1">
													Tutar: <strong>{el.fee.format() + " ₺"}</strong>, Ödenen:{" "}
													<strong>{el.amount.format() + " ₺"}</strong>
												</div>

												<div className="small text-muted">
													Kalan tutar:{" "}
													<strong className="text-body">
														{(el.fee - el.amount).format() + " ₺"}
													</strong>
												</div>
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
														<Link
															to={"/app/players/payment/" + el.uid}
															className="dropdown-item">
															<i className="dropdown-icon fa fa-hand-holding-usd" /> Ödeme
															Al
														</Link>
														<Link
															to={"/app/players/detail/" + el.uid}
															className="dropdown-item cursor-not-allowed disabled">
															<i className="dropdown-icon fa fa-exclamation-triangle"></i>{" "}
															Ödeme İkazı
															<span className="ml-1">
																(<i className="fe fe-lock mr-0" />)
															</span>
														</Link>
														<div role="separator" className="dropdown-divider" />
														<Link
															to={"/app/players/fee-detail/" + el.uid}
															className="dropdown-item">
															<i className="dropdown-icon fa fa-receipt" /> Tüm Aidat
															Bilgisi
														</Link>
														<Link
															to={"/app/players/detail/" + el.uid}
															className="dropdown-item">
															<i className="dropdown-icon fa fa-info-circle" /> Tüm
															Bilgileri
														</Link>
													</div>
												</div>
											</div>
										</div>
									);
							  })
							: noRow()
						: noRow(true)}
				</div>
				{list ? (
					list.length >= 5 ? (
						<div className="card-footer text-right font-italic">
							<Link to="/app/reports/unpaid/players">
								Tümünü görüntüle <i className="fe fe-arrow-right"></i>
							</Link>
						</div>
					) : null
				) : null}
			</div>
		);
	}
}

export default UnpaidPlayer;
