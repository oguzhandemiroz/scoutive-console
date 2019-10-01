import React, { Component } from "react";
import { Areas } from "../../../../services/FillSelect";

export class Area extends Component {
	constructor(props) {
		super(props);

		this.state = {
			areas: null,
			show: false,
			loading: "active",
			loadingButton: ""
		};
	}

	handleChange = e => {
		const { value, name } = e.target;
		const { areas } = this.state;
		let changed = areas.find(x => x.value === parseInt(name));
		changed.label = value;
		console.log(value, name, changed);

		this.setState(prevState => ({
			areas: [...prevState.areas]
		}));
	};

	showAreaSettings = () => {
		this.setState({ show: true });
		this.getAreas();
	};

	getAreas = () => {
		Areas().then(response => {
			if (response) {
				this.setState({ areas: response, loading: "" });
			}
		});
	};

	render() {
		const { areas, show, loading, loadingButton } = this.state;
		return (
			<form className="row">
				<div className="col-2">
					<strong>Saha Ayarları</strong>
				</div>
				<div className="col-10">
					{show ? (
						<div className={`dimmer ${loading}`}>
							<div className="loader" />
							<div className="dimmer-content">
								<div>
									<div className="row gutters-xs mb-2">
										{areas
											? areas.map((el, key) => {
													return (
														<div
															className="col-lg-3 col-md-3 col-sm-6"
															key={key.toString()}>
															<input
																type="text"
																className="form-control"
																placeholder={el.label}
																value={el.label}
																name={el.value}
																onChange={this.handleChange}
															/>
														</div>
													);
											  })
											: null}
									</div>
								</div>
								<button type="submit" className={`btn btn-sm btn-primary ${loadingButton}`}>
									Değişiklikleri Kaydet
								</button>
							</div>
						</div>
					) : (
						<button onClick={this.showAreaSettings} className="btn btn-secondary text-left">
							Saha Ayarları
						</button>
					)}

					<p className="font-italic text-muted mt-2 mb-0">
						Sahalar, gruplarda kullanılır. Sahaları gruplarda <b>Antrenman Sahası</b> olarak
						tanımlayabilirsiniz.
						<br />
						Sistemde kayıtlı olan sahaların isimlerini değiştirebilirsiniz.
					</p>
				</div>
			</form>
		);
	}
}

export default Area;
