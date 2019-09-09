import React, { Component } from "react";
import Select from "react-select";
import { Groups } from "../../services/FillSelect";

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

export class ListFilter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			feeConditionButtonText: "Koşul",
			pointConditionButtonText: "Koşul",
			filter: {
				status: null,
				is_trial: null,
				group: null,
				fee: null,
				point: null,
				birthday: null
			},
			options: null,
			isLoading: true
		};
	}

	componentDidMount() {
		Groups().then(response => {
			this.setState({ options: response, isLoading: false });
		});
	}

	handleSelect = (value, name) => {
		const filter = { ...this.state.filter };
		filter[name] = value ? value.label : "";
		this.setState({ filter });
	};

	handleChange = e => {
		const { name, value } = e.target;
		const filter = { ...this.state.filter };

		if (name.indexOf(".") > -1) {
			const splitName = name.split(".");
			filter[splitName[0]] = filter[splitName[0]] || {};
			filter[splitName[0]][splitName[1]] = value;

			if (filter[splitName[0]].value === "") filter[splitName[0]] = null;
		} else {
			filter[name] = filter[name] || {};
			filter[name].value = value;

			if (filter[name].value === "") filter[name] = null;
		}

		this.setState({ filter });
	};

	handleCheck = e => {
		const { name, checked, value } = e.target;
		const filter = { ...this.state.filter };
		filter[name] = filter[name] || [];

		if (checked) filter[name].push(parseInt(value));
		else filter[name] = filter[name].filter(x => x !== parseInt(value));

		if (filter[name].length === 0) filter[name] = null;

		this.setState({ filter });
	};

	handleCondition = (e, name, value, buttonText) => {
		e.preventDefault();
		const filter = { ...this.state.filter };
		console.log(name, value);

		if (value !== "clear") {
			filter[name] = filter[name] || {};
			filter[name].condition = value;
		} else {
			filter[name] = null;
		}
		if (name === "fee") this.setState({ feeConditionButtonText: buttonText });
		else if (name === "point") this.setState({ pointConditionButtonText: buttonText });
		this.setState({ filter });
	};

	render() {
		const { filter, feeConditionButtonText, pointConditionButtonText, options, isLoading } = this.state;
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
													value="1"
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
												type="number"
												className="form-control"
												name="fee"
												onChange={this.handleChange}
											/>
											<div className="input-group-append">
												<span className="input-group-text">,00</span>
												<button
													type="button"
													className="btn btn-secondary dropdown-toggle"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false">
													{feeConditionButtonText}
												</button>
												<div className="dropdown-menu">
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "fee", ">", "Büyük")}>
														Büyük
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "fee", ">=", "Büyük ve Eşit")
														}>
														Büyük ve Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "fee", "<", "Küçük")}>
														Küçük
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "fee", "<=", "Küçük ve Eşit")
														}>
														Küçük ve Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "fee", "===", "Eşit")}>
														Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "fee", "!==", "Eşit Değil")
														}>
														Eşit Değil
													</button>
													<div role="separator" className="dropdown-divider"></div>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "fee", "clear", "Koşul")}>
														Temizle
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className="form-group">
										<label className="form-label">Yaş Aralığı</label>
										<div className="row gutters-xs">
											<div className="col-6">
												<input
													type="number"
													name="birthday.first"
													onChange={this.handleChange}
													min="1960"
													max={filter.birthday ? filter.birthday.second : "2016"}
													className="form-control"
												/>
											</div>
											<div className="col-6">
												<input
													type="number"
													name="birthday.second"
													onChange={this.handleChange}
													min={filter.birthday ? filter.birthday.first : "1960"}
													max="2016"
													className="form-control"
												/>
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
												name="point"
												onChange={this.handleChange}
											/>
											<div className="input-group-append">
												<button
													type="button"
													className="btn btn-secondary dropdown-toggle"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false">
													{pointConditionButtonText}
												</button>
												<div className="dropdown-menu">
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "point", ">", "Büyük")}>
														Büyük
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "point", ">=", "Büyük ve Eşit")
														}>
														Büyük ve Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "point", "<", "Küçük")}>
														Küçük
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "point", "<=", "Küçük ve Eşit")
														}>
														Küçük ve Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "point", "===", "Eşit")}>
														Eşit
													</button>
													<button
														className="dropdown-item"
														onClick={e =>
															this.handleCondition(e, "point", "!==", "Eşit Değil")
														}>
														Eşit Değil
													</button>
													<div role="separator" className="dropdown-divider"></div>
													<button
														className="dropdown-item"
														onClick={e => this.handleCondition(e, "point", "clear", "Koşul")}>
														Temizle
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className="form-group">
										<label className="form-label">Grup</label>
										<Select
											onChange={val => this.handleSelect(val, "group")}
											options={options}
											name="group"
											placeholder="Seç..."
											styles={customStyles}
											isClearable={true}
											isSearchable={true}
											isDisabled={isLoading}
											isLoading={isLoading}
											noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button className="btn btn-yellow" onClick={() => this.props.filterState(filter)}>
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
