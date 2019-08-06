import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Groups } from "../../services/FillSelect";
import { UpdatePlayer } from "../../services/Player";
import { getSelectValue, AttributeDataChecker } from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import Select from "react-select";
const $ = require("jquery");

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const alertMessage = () => (
	<div className="alert alert-info mb-0" role="alert">
		Öğrenciyi gruptan çıkarmak için <span className="text-blue font-weight-600">Gruptan Çıkar</span> düğmesine
		tıklayın.
	</div>
);

export class GroupChange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: {},
			group: null,
			select: {
				groups: null
			},
			alert: false,
			loadingButton: true
		};
	}

	componentDidMount() {
		let select = { ...this.state.select };

		if (this.props.visible) {
			$("#groupChangeModal").modal({
				keyboard: false,
				backdrop: "static"
			});
			Groups().then(response => {
				select.groups = response;
				this.setState({ select, loadingButton: false });
			});
		}
		this.setState({ ...this.props });
	}

	componentWillReceiveProps(nextProps) {
		let select = { ...this.state.select };

		if (nextProps.visible) {
			$("#groupChangeModal").modal({
				keyboard: false,
				backdrop: "static"
			});
			Groups().then(response => {
				select.groups = response;
				this.setState({ select, loadingButton: false });
			});
		}
		this.setState({ ...nextProps });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, group } = this.state;
		const { data } = this.props;
		const attributesData = {};
		if (group) {
			if (AttributeDataChecker(data.group ? data.group : null, group ? group.label : null)) {
				attributesData.group_id = group.value.toString();
			}

			this.setState({ loadingButton: true });
			UpdatePlayer({
				uid: uid,
				to: data.uid,
				group_id: group ? group.value : 0,
				attributes: attributesData
			}).then(response => {
				this.setState({ loadingButton: false });
				setTimeout(() => this.reload(), 1000);
			});
		} else {
			this.setState({ alert: true });
		}
	};

	handleSelect = (value, name) => {
		this.setState({ [name]: value });
	};

	playerRemoveGroup = () => {
		const { uid } = this.state;
		const { data } = this.props;
		this.setState({ loadingButton: true });
		UpdatePlayer({
			uid: uid,
			to: data.uid,
			group_id: 0
		}).then(response => {
			this.setState({ loadingButton: false });
			setTimeout(() => this.reload(), 1000);
		});
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	render() {
		const { alert, group, data, loadingButton, select } = this.state;
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
								<i className="fa fa-user-cog mr-2" />
								Grup Değişikliği
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
						</div>
						<form onSubmit={this.handleSubmit}>
							<div className="modal-body">
								<div className={`dimmer ${loadingButton ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="form-group">
											<label className="form-label">Öğrenci Bilgisi:</label>
											<div className="form-control-plaintext">
												<Link to={`/app/players/detail/${data.uid}`}>{data.name}</Link>
											</div>
										</div>

										<div className="form-group">
											<label className="form-label">Mevcut Grup:</label>
											<div className="form-control-plaintext">
												<Link to={`/app/groups/detail/${data.group_id}`}>
													{data.group || "—"}
												</Link>
											</div>
										</div>

										<div className="form-group">
											<label className="form-label">Yeni Grup:</label>
											<Select
												value={group}
												onChange={val => this.handleSelect(val, "group")}
												options={select.groups}
												name="group"
												placeholder="Seç..."
												styles={customStyles}
												isClearable={true}
												isSearchable={true}
												isDisabled={select.groups ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											/>
										</div>
									</div>
								</div>
							</div>
							{alert ? alertMessage() : null}
							<div className="modal-footer">
								<a
									href="javascript:void(0)"
									onClick={() => {
										showSwal({
											type: "info",
											title: "Emin misiniz?",
											text: "Öğrenciyi gruptan çıkarmak istediğinize emin misiniz?",
											confirmButtonText: "Evet",
											cancelButtonText: "Hayır",
											cancelButtonColor: "#cd201f",
											showCancelButton: true,
											reverseButtons: true
										}).then(result => {
											if (result.value) this.playerRemoveGroup();
										});
									}}
									className="btn btn-link pl-0">
									Gruptan Çıkar
								</a>
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

export default GroupChange;
