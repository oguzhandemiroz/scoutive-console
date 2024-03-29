import React, { Component } from "react";

const currencyType = {
	TRY: " ₺",
	USD: " $",
	EUR: " €",
	GBP: " £"
};

export class TotalAmount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			totalAmount: {
				TRY: null,
				USD: null,
				EUR: null,
				GBP: null
			}
		};
	}

	componentDidMount() {}

	componentWillReceiveProps(nextProps) {
		const { data } = nextProps;
		this.listBudgets(data);
	}

	listBudgets = data => {
		console.log(data);
		const { totalAmount } = this.state;
		var total = {
			TRY: 0,
			USD: 0,
			EUR: 0,
			GBP: 0
		};
		data.map(el => {
			if (el.balance) {
				total[el.currency] += el.balance;
			}
		});
		console.log(total);
		Object.keys(totalAmount).map(el => {
			this.setState(prevState => ({
				totalAmount: { ...prevState.totalAmount, [el]: total[el].format(2, 3, '.', ',') + currencyType[el] }
			}));
		});
	};
	render() {
		const { totalAmount } = this.state;
		return (
			<div className="card">
				<div className="card-body">
					<div className="card-value float-right text-muted">
						<i className={`fa fa-coins`}></i>
					</div>
					{totalAmount["TRY"] === null ? (
						<div className="loader" />
					) : (
						Object.keys(totalAmount).map((el, key) => {
							const fontSize = key === 0 ? "h3" : "h4";

							return (
								<div key={key.toString()} className={`mb-1 ${fontSize}`}>
									{totalAmount[el]}
								</div>
							);
						})
					)}
					<div className="text-muted">Nakit Toplamı</div>
				</div>
			</div>
		);
	}
}

export default TotalAmount;
