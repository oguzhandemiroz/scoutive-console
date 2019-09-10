import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListAccountingRecords } from "../../services/Accounting";
import moment from "moment";
import "moment/locale/tr";
const $ = require("jquery");

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="5" className="text-center text-muted font-italic">
			{loading ? (
				<div className={`dimmer active`}>
					<div className="loader" />
					<div className="dimmer-content" />
				</div>
			) : (
				"Kayıt bulunamadı..."
			)}
		</td>
	</tr>
);

export class Income extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			list: null
		};
	}

	componentDidMount() {
		this.listAccountingRecord();
	}

	listAccountingRecord = () => {
		const { uid } = this.state;
		ListAccountingRecords({
			uid: uid,
			filter: { type: 1 },
			count: 5
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ list: response.data });
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
		});
	};

	render() {
		const { list } = this.state;
		return (
			<div className="col-lg-6 col-sm-12">
				<div className="page-header">
					<h1 className="page-title">
						<i className="fe fe-trending-up mr-2 text-green"></i>Gelir
					</h1>
					<div className="input-group w-auto ml-auto">
						<div className="input-group-append">
							<Link to="/app/accountings/income/fast" className="btn btn-sm btn-success">
								<i className="fa fa-plus-square mr-1"></i> Gelir Oluştur
							</Link>
							<button
								type="button"
								className="btn btn-success btn-sm dropdown-toggle dropdown-toggle-split"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false">
								<span className="sr-only">Toggle Dropdown</span>
							</button>
							<div className="dropdown-menu">
								<Link
									to="/app/accountings/income/invoice"
									className="dropdown-item cursor-not-allowed disabled">
									<i className="dropdown-icon fa fa-receipt"></i> Fatura
									<span className="ml-2">
										(<i className="fe fe-lock mr-0" />)
									</span>
								</Link>
								<Link to="/app/players/payment" className="dropdown-item">
									<i className="dropdown-icon fa fa-hand-holding-usd"></i> Aidat Ödemesi
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">Son 5 İşlem</h3>
					</div>
					<div className="table-responsive">
						<table className="table card-table table-striped table-vcenter">
							<thead>
								<tr>
									<th>İşlem</th>
									<th>Tutar</th>
									<th>Tarih</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{list
									? list.map((el, key) => {
											return (
												<tr key={key.toString()}>
													<td>
														{el.accounting_type}
														<div className="small text-muted text-break">{el.note}</div>
													</td>
													<td>{el.amount.format() + " ₺"}</td>
													<td className="text-nowrap">
														{moment(el.payment_date).format("LL")}
													</td>
													<td className="w-1">
														<Link
															to={"/app/accountings/income/detail/" + el.accounting_id}
															className="icon">
															<i className="fe fe-eye"></i>
														</Link>
													</td>
												</tr>
											);
									  })
									: noRow(true)}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan="4" className="text-right font-italic">
										<Link to="#">
											Tümünü görüntüle <i className="fe fe-arrow-right"></i>
										</Link>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default Income;
