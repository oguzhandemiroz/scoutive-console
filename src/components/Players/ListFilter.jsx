import React, { Component } from "react";

export class ListFilter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: {
				status: [],
				is_trial: [],
				fee: {
					value: 0,
					condition: ">="
				}
			}
		};
	}

	handleCondition = (e, name, value) => {
		e.preventDefault();
		const filter = { ...this.state.filter };
	};

	handleChange = e => {
		const { name, value } = e.target;
		const filter = { ...this.state.filter };
		console.log(name, value);
	};

	handleCheck = e => {
		const { name, checked, value } = e.target;
		const filter = { ...this.state.filter };

		if (checked) filter[name].push(parseInt(value));
		else filter[name].pop(parseInt(value));

		this.setState({ filter });
	};

	render() {
		const { filter } = this.state;
		return (
			<div
				className="modal fade bd-example-modal-xl"
				tabIndex="-1"
				role="dialog"
				id="playerListFilterMenu"
				aria-labelledby="playerListFilterMenu"
				aria-hidden="true">
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Öğrenci Listesi Filtre</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-12">
									<div className="form-group">
										<div className="form-label">Öğrenci Durumu</div>
										<div>
											<label className="custom-control custom-checkbox custom-control-inline">
												<input
													type="checkbox"
													className="custom-control-input"
													name="status"
													value="1"
													onChange={this.handleCheck}
												/>
												<span className="custom-control-label text-green">Aktif</span>
											</label>
											<label className="custom-control custom-checkbox custom-control-inline">
												<input
													type="checkbox"
													className="custom-control-input"
													name="status"
													value="0"
													onChange={this.handleCheck}
												/>
												<span className="custom-control-label text-red">Silinen</span>
											</label>
											<label className="custom-control custom-checkbox custom-control-inline">
												<input
													type="checkbox"
													className="custom-control-input"
													name="status"
													value="2"
													onChange={this.handleCheck}
												/>
												<span className="custom-control-label text-azure">Dondurulan</span>
											</label>
											<label className="custom-control custom-checkbox custom-control-inline">
												<input
													type="checkbox"
													className="custom-control-input"
													name="is_trial"
													value="3"
													onChange={this.handleCheck}
												/>
												<span className="custom-control-label text-purple">Deneme</span>
											</label>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">Aidat Tutarı</label>
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												name="fee"
												onChange={this.handleChange}
											/>
											<div className="input-group-append">
												<button
													type="button"
													className="btn btn-secondary dropdown-toggle"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false">
													Koşul
												</button>
												<div className="dropdown-menu">
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", ">")}
														href="javascript:void(0)">
														Büyük
													</a>
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", ">=")}
														href="javascript:void(0)">
														Büyük ve Eşit
													</a>
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", "<")}
														href="javascript:void(0)">
														Küçük
													</a>
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", "<=")}
														href="javascript:void(0)">
														Küçük ve Eşit
													</a>
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", "=")}
														href="javascript:void(0)">
														Eşit
													</a>
													<a
														className="dropdown-item"
														onClick={() => this.handleCondition(this, "fee", "!=")}
														href="javascript:void(0)">
														Eşit Değil
													</a>
												</div>
											</div>
										</div>
									</div>

									<div className="form-group">
										<label className="form-label">Yaş Aralığı</label>
										<div className="row gutters-xs">
											<div className="col-6">
												<input type="number" className="form-control" />
											</div>
											<div className="col-6">
												<input type="number" className="form-control" />
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">Genel Puan Oranı</label>
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												aria-label="Text input with dropdown button"
											/>
											<div className="input-group-append">
												<button
													type="button"
													className="btn btn-secondary dropdown-toggle"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false">
													Koşul
												</button>
												<div className="dropdown-menu">
													<a className="dropdown-item" href="javascript:void(0)">
														Büyük
													</a>
													<a className="dropdown-item" href="javascript:void(0)">
														Büyük ve Eşit
													</a>
													<a className="dropdown-item" href="javascript:void(0)">
														Küçük
													</a>
													<a className="dropdown-item" href="javascript:void(0)">
														Küçük ve Eşit
													</a>
													<a className="dropdown-item" href="javascript:void(0)">
														Eşit
													</a>
													<a className="dropdown-item" href="javascript:void(0)">
														Eşit Değil
													</a>
												</div>
											</div>
										</div>
									</div>

									<div className="form-group">
										<label className="form-label">Grup</label>
										<input type="text" className="form-control" />
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								className="btn btn-yellow"
								onClick={() =>
									this.props.filterState({
										status: []
										/*group: "TEST-GROUP-1",
										fee: { value: 200, condition: ">" },
										birthday: { value: 2007, condition: ">=" }*/
									})
								}>
								Uygula
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ListFilter;
