import React, { Component } from "react";
import { ListPermissions, UpdatePermissions } from "../../../services/School";
import { Toast } from "../../Alert";

const permissionTypeDescription = {
	text: {
		club: "Kulüp",
		school: "Okul",
		employee: "Personeller",
		player: "Öğrenciler",
		group: "Gruplar",
		vacation: "İzinler"
	},
	default: {
		club: ["list", "read", "write", "edit"],
		school: ["list", "read", "write", "edit"],
		employee: ["list", "read", "write", "edit", "delete", "rollcall"],
		player: ["list", "read", "write", "edit", "delete", "rollcall"],
		group: ["list", "read", "write", "edit", "delete"],
		vacation: ["edit", "write", "read"]
	}
};

export class Permission extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			permissionList: null,
			loadingData: "active p-3"
		};
	}

	componentDidMount() {
		this.getEmployeePosition();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, permissionList } = this.state;
		const arr = [];

		permissionList.map(el => arr.push(el.title));

		if (arr.indexOf("") === -1) {
			this.setState({ loadingData: "btn-loading" });
			UpdatePermissions({
				uid: uid,
				permissions: permissionList
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						Toast.fire({
							type: "success",
							title: "İşlem başarılı..."
						});
					}
				}
				this.setState({ loadingData: "" });
			});
		} else {
			Toast.fire({
				type: "error",
				title: "Pozisyon isimleri boş olamaz!"
			});
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { permissionList } = this.state;
		const { name, value } = e.target;
		const split_id = parseInt(name.split(".")[1]);
		const permissionElement = permissionList.find(x => x.permission_id === split_id);
		permissionElement.title = value;
		this.setState({ permissionList });
	};

	handleCheck = e => {
		const { permissionList } = this.state;
		const { name, checked } = e.target;
		const splitName = name.split(".");

		const permissionDetail = {
			permission_id: parseInt(splitName[0]),
			permission_category: splitName[1],
			permission_type: splitName[2]
		};

		const permissionElement = permissionList.find(x => x.permission_id === permissionDetail.permission_id);
		switch (checked) {
			case true:
				permissionElement.permission_value[permissionDetail.permission_category].push(
					permissionDetail.permission_type
				);
				break;
			case false:
				permissionElement.permission_value[
					permissionDetail.permission_category
				] = permissionElement.permission_value[permissionDetail.permission_category].filter(
					x => x !== permissionDetail.permission_type
				);
				break;
			default:
				break;
		}

		this.setState({ permissionList });
	};

	getEmployeePosition = () => {
		const { uid } = this.state;
		ListPermissions(uid).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ permissionList: response.data });
				}
			}
			this.setState({ loadingData: "" });
		});
	};

	switchCheck = check => {
		return check > -1 ? true : false;
	};

	render() {
		const { permissionList, loadingData } = this.state;
		return (
			<form className="card" onSubmit={this.handleSubmit}>
				<div className="card-header">
					<h3 className="card-title">Yetkilendirme</h3>
					<div className="card-options">
						<span className="form-required font-weight-600 mr-1">*</span>
						<span
							className="form-help bg-gray-dark text-white"
							data-toggle="popover"
							data-placement="bottom"
							data-content='<p>Harf Açıklamaları:</p><p> <div><span class="font-weight-600 text-red"> L</span>: Listeleme</div><div><span class="font-weight-600 text-red"> G</span>: Görüntüleme</div><div><span class="font-weight-600 text-red"> O</span>: Oluşturma</div><div><span class="font-weight-600 text-red"> D</span>: Düzenleme</div><div><span class="font-weight-600 text-red"> S</span>: Silme</div><div><span class="font-weight-600 text-red"> Y</span>: Yoklama</div></p><p><b>Ek:</b> Tablo üzerinde harflerin üzerine geldiğinizde de harfin açıklaması gözükür.</p>'>
							!
						</span>
					</div>
				</div>
				<div className="card-body">
					<div className={`dimmer ${loadingData}`}>
						<div className="loader" />
						<div className="dimmer-content">
							{permissionList
								? permissionList.map((el, key) => (
										<div className="example p-4 mb-5" key={key.toString()}>
											<div className="table-responsive">
												<table className="table card-table table-vcenter" key={key.toString()}>
													<thead>
														<tr>
															<th className="pl-0">
																<input
																	type="text"
																	className="form-control text-uppercase font-weight-600 text-dark"
																	name={`permission.${el.permission_id}`}
																	placeholder={el.title}
																	value={el.title}
																	onChange={this.handleChange}
																/>
															</th>
															<th className="w-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Listeleme">
																	L<span className="form-required">*</span>
																</span>
															</th>
															<th className="w-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Görüntüleme">
																	G<span className="form-required">*</span>
																</span>
															</th>
															<th className="w-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Oluşturma">
																	O<span className="form-required">*</span>
																</span>
															</th>
															<th className="w-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Düzenleme">
																	D<span className="form-required">*</span>
																</span>
															</th>
															<th className="w-2 pr-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Silme">
																	S<span className="form-required">*</span>
																</span>
															</th>
															<th className="w-2 pr-2 text-center">
																<span
																	className="font-weight-600"
																	data-toggle="tooltip"
																	title="Yoklama">
																	Y<span className="form-required">*</span>
																</span>
															</th>
														</tr>
													</thead>
													<tbody>
														{Object.keys(permissionTypeDescription.default).map(
															(elem, key) => {
																return (
																	<tr key={key.toString()}>
																		<td className="pl-2 text-muted">
																			{permissionTypeDescription.text[elem]}
																		</td>
																		<td>
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("list") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.list`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("list")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																		<td>
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("read") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.read`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("read")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																		<td>
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("write") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.write`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("write")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																		<td className="pr-2">
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("edit") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.edit`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("edit")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																		<td className="pr-2">
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("delete") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.delete`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("delete")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																		<td className="pr-2">
																			{permissionTypeDescription.default[
																				elem
																			].indexOf("rollcall") > -1 ? (
																				<label className="pl-0 custom-switch">
																					<input
																						type="checkbox"
																						name={`${el.permission_id}.${elem}.rollcall`}
																						className="custom-switch-input"
																						onChange={this.handleCheck}
																						checked={this.switchCheck(
																							el.permission_value[
																								elem
																							].indexOf("rollcall")
																						)}
																					/>
																					<span className="custom-switch-indicator"></span>
																				</label>
																			) : null}
																		</td>
																	</tr>
																);
															}
														)}
													</tbody>
												</table>
											</div>
										</div>
								  ))
								: null}
						</div>
					</div>
				</div>
				<div className="card-footer text-right">
					<button type="submit" className={`btn btn-primary ${loadingData}`}>
						Kaydet
					</button>
				</div>
			</form>
		);
	}
}

export default Permission;
