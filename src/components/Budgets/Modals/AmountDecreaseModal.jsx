import React, { Component } from "react";
import Inputmask from "inputmask";
import { UpdateBudget } from "../../../services/Budget";
import { formValid } from "../../../assets/js/core";
import { clearMoney } from "../../../services/Others";
const $ = require("jquery");

Inputmask.extendDefaults({
	autoUnmask: true
});

Inputmask.extendAliases({
	try: {
		suffix: " ₺",
		radixPoint: ",",
		groupSeparator: ".",
		alias: "numeric",
		autoGroup: true,
		digits: 2,
		digitsOptional: false,
		clearMaskOnLostFocus: false,
		allowMinus: false,
		allowPlus: false,
		rightAlign: false
	}
});

const InputmaskDefaultOptions = {
	showMaskOnHover: false,
	showMaskOnFocus: false,
	placeholder: "0,00",
	autoUnmask: true
};

export class AmountIncreaseModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			amount: null,
			formErrors: {
				amount: ""
			},
			loadingButton: ""
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				amount: $("[name=amount]")
			};
			Inputmask({
				alias: "try",
				...InputmaskDefaultOptions
			}).mask(elemArray.amount);
		} catch (e) {}
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace("/app/reload");
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	componentDidMount() {
		this.fieldMasked();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, amount, note } = this.state;
		const { bid } = this.props;

		if (formValid(this.state)) {
			this.setState({ loadingButton: "btn-loading" });
			UpdateBudget({
				uid: uid,
				budget_id: bid,
				amount: clearMoney(amount) - 1,
				note: note
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) setTimeout(this.reload, 750);
				}
				this.setState({ loadingButton: "" });
			});
		} else {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					amount: amount ? "" : "is-invalid"
				}
			}));
		}
	};

	handleChange = e => {
		const { name, value } = e.target;
		if (name === "amount") {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					[name]: value ? (value === "0,00" ? "is-invalid" : "") : "is-invalid"
				}
			}));
		}
		this.setState({ [name]: value === "0,00" ? null : value });
	};

	existingBalance = () => {
		const { amount } = this.state;
		const { budget } = this.props;
		const checkAmount = amount ? parseFloat(amount) : 0;
		return (budget.balance - checkAmount).format() + " " + budget.currency;
	};

	render() {
		const { budget } = this.props;
		const { loadingButton, formErrors } = this.state;
		return (
			<div>
				<div className="modal fade" id="amountDecreaseModal" tabIndex="-1" role="dialog">
					<form className="modal-dialog" role="document" onSubmit={this.handleSubmit}>
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									<i className="fa fa-minus mr-2 text-danger" />
									Kasa/Banka &mdash; Para Çıkışı
								</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
							</div>
							<div className="alert alert-icon alert-warning border-radius-0">
								<i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
								Kasa/Banka bakiyesini düzenlemek için olan para çıkışlarını ekleyin. Bu işlem Gelir veya
								Gider'i etkilemez.
							</div>
							<div className="modal-body">
								<div className="row">
									<div className="form-group col-6">
										<label className="form-label">Kasa/Banka Bilgisi</label>
										<div className="form-control-plaintext">{budget.name}</div>
									</div>
									<div className="form-group col-6">
										<label className="form-label">Mevcut Bakiye</label>
										<div className="form-control-plaintext">
											{budget.balance.format() + " " + budget.currency}
										</div>
									</div>
									<div className="form-group col-12">
										<label className="form-label">
											Çıkarılacak Tutar <span className="form-required">*</span>
										</label>
										<input
											type="text"
											className={`form-control ${formErrors.amount}`}
											name="amount"
											onChange={this.handleChange}
										/>
									</div>
									<div className="col-12">
										<div className="alert alert-success p-3">
											<strong className="mr-1">Yeni Bakiye: </strong>
											{this.existingBalance()}
										</div>
									</div>
									<div className="form-group col-12">
										<label className="form-label">Not:</label>
										<textarea
											onChange={this.handleChange}
											className="form-control resize-none"
											name="note"
											placeholder="Not..."
											maxLength="100"></textarea>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className={`btn btn-danger ${loadingButton}`}>
									Çıkar
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default AmountIncreaseModal;
