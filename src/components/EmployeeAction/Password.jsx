import React, { Component } from "react";
import { ChangeEmployee } from "../../services/Password";
import { Link } from "react-router-dom";
const $ = require("jquery");

export class Password extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			password: null,
			data: {},
			loadingButton: false
		};
	}

	componentDidMount() {
		if (this.props.visible)
			$("#groupChangeModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...this.props });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible)
			$("#groupChangeModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...nextProps });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, password, data } = this.state;
	};

	render() {
		const { password, loadingButton, data } = this.state;
		return (
			<div
				className="modal fade"
				id="groupChangeModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								<i className="fa fa-key mr-2" />
								Şifre Değişikliği
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
						</div>
						<form onSubmit={this.handleSubmit}>
							<div className="modal-body">
								<div className="form-group">
									<label className="form-label">Personel Bilgisi:</label>
									<div className="form-control-plaintext">
										<Link to={`/app/employees/detail/${data.uid}`}>{data.name}</Link>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">Yeni Şifre:</label>
									<input
										type="text"
										className="form-control"
										name="password"
										placeholder="Yeni Şifre"
										onChange={this.handleChange}
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="submit"
									className={`ml-auto btn btn-success ${
										loadingButton ? "btn-loading disabled" : ""
									}`}>
									Güncelle
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Password;
