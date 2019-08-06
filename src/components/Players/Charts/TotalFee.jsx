import React, { Component } from "react";

export class TotalFee extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			totalFee: null,
			totalCount: null
		};
	}

	componentDidMount() {}

	componentWillReceiveProps(nextProps) {
		const { data } = nextProps;
		this.listEmployees(data);
	}

	listEmployees = data => {
		var total = 0;
		data.map(el => {
			if (el.fee) {
				total += el.fee;
			}
		});
		this.setState({ totalFee: total.format() + " ₺", totalCount: data.length });
	};

	render() {
		const { totalFee, totalCount } = this.state;
		return (
			<div className="card">
				<div className="card-body p-3 text-center">
					<div className="h5">Toplam Aidat Geliri</div>
					<div style={{ fontSize: "2.35rem" }} className="display-4 font-weight-bold mb-3">
						{totalFee ? (
							totalFee
						) : (
							<div className="d-flex justify-content-center">
								<div className="loader"></div>
							</div>
						)}
					</div>
				</div>
				<div className="card-body p-3 text-center">
					<div className="h5">Toplam Öğrenci Sayısı</div>
					<div style={{ fontSize: "2rem" }} className="display-4 font-weight-bold mb-3">
						{totalCount !== null ? (
							totalCount
						) : (
							<div className="d-flex justify-content-center">
								<div className="loader"></div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default TotalFee;
