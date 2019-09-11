import React, { Component } from "react";

export class TotalSalary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			totalSalary: null,
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
			if (el.status === 1 && typeof el.salary === "number") {
				total += el.salary;
			}
		});
		this.setState({ totalSalary: total.format() + " ₺", totalCount: data.filter(x => x.status === 1).length });
	};

	render() {
		const { totalSalary, totalCount } = this.state;
		return (
			<div className="card">
				<div
					className="card-body p-3 text-center d-flex flex-column justify-content-center"
					style={{ height: 140 }}>
					<div className="h5">Toplam Aktif Pers. Maaş Gideri</div>
					<div style={{ fontSize: "2.35rem" }} className="display-4 font-weight-bold mb-3">
						{totalSalary ? (
							totalSalary
						) : (
							<div className="d-flex justify-content-center">
								<div className="loader"></div>
							</div>
						)}
					</div>
				</div>
				<div
					className="card-body p-3 text-center d-flex flex-column justify-content-center"
					style={{ height: 140 }}>
					<div className="h5">Toplam Aktif Personel Sayısı</div>
					<div style={{ fontSize: "2.35rem" }} className="display-4 font-weight-bold mb-3">
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

export default TotalSalary;
