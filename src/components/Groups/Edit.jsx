import React, { Component } from "react";
import Select, { components } from "react-select";
import { UpdateGroup, ListPlayers } from "../../services/Group";
import { UpdatePlayers } from "../../services/Player";
import { Hours, Minutes, DateRange, GetEmployees, GetPlayers } from "../../services/FillSelect";
import { getSelectValue, UploadFile } from "../../services/Others";
import { Toast, showSwal } from "../../components/Alert";
import { withRouter } from "react-router-dom";

const formValid = ({ formErrors, ...rest }) => {
	let valid = true;

	Object.values(formErrors).forEach(val => {
		val.length > 0 && (valid = false);
	});

	Object.values(rest).forEach(val => {
		val === null && (valid = false);
	});

	return valid;
};

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const customStylesError = {
	control: styles => ({
		...styles,
		borderColor: "#cd201f",
		borderRadius: 3,
		":hover": { ...styles[":hover"], borderColor: "#cd201f" }
	})
};

const { Option } = components;
const ImageOption = props => (
	<Option {...props}>
		<span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
		{props.data.label}
	</Option>
);

const initialState = {
	name: null,
	hour: null,
	minute: null,
	age: null,
	employee: null,
	imagePreview: null,
	players: null
};

export class Edit extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			select: {
				hours: null,
				minutes: null,
				ages: null,
				employees: null,
				players: null
			},
			formErrors: {
				name: "",
				hours: "",
				minutes: "",
				age: "",
				employee: ""
			},
			group_id: null,
			uploadedFile: true,
			loadingButton: "",
			onLoadedData: false,
			players: [],
			playerList: [],
			addGroup: [],
			removeGroup: []
		};
	}

	addItemList = security_id => {
		try {
			const { playerList, players, removeGroup } = this.state;
			const now = Date.now();
			this.setState({
				playerList: [
					...playerList,
					{
						id: now,
						select: states => {
							const { select } = states;
							return (
								<Select
									defaultValue={getSelectValue(select.players, security_id, "value")}
									isSearchable={true}
									isDisabled={select.players ? false : true}
									isClearable={true}
									onChange={val => this.handleSelect(val, "player", now, true)}
									placeholder="Seç..."
									name="player"
									autosize
									styles={customStyles}
									options={select.players}
									noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
									components={{ Option: ImageOption }}
								/>
							);
						},
						buttons: (
							<div>
								<button
									type="button"
									className="btn btn-sm btn-success"
									onClick={this.addItemList.bind(this, null)}>
									<i className="fe fe-plus" />
								</button>
								<button
									type="button"
									className="btn btn-sm btn-danger ml-2"
									onClick={() => this.removeItemList(now)}>
									<i className="fe fe-minus" />
								</button>
							</div>
						)
					}
				],
				players: [...players, { key: now, security_id: security_id || "" }]
			});
			if (security_id) {
				this.setState({ removeGroup: [...removeGroup, security_id] });
			}
		} catch (e) {}
	};

	removeItemList = key => {
		try {
			const { playerList, players } = this.state;
			if (playerList.length > 1) {
				const filteredItems = playerList.filter(x => x.id !== key);
				const filteredPlayers = players.filter(x => x.key !== key);
				this.setState({
					playerList: filteredItems,
					players: filteredPlayers
				});
			} else if (playerList.length === 1) {
				Toast.fire({
					type: "warning",
					title: "Daha fazla silme işlemi yapılamaz!",
					timer: 2000
				});
			}
		} catch (e) {}
	};

	componentDidMount() {
		const { select } = this.state;
		const { detail, gid } = this.props;
		const stateData = {};

		GetEmployees().then(response => {
			select.employees = response;
			this.setState({ select });
		});

		GetPlayers().then(response => {
			select.players = response;
			this.setState({ select });
		});

		select.hours = Hours();
		select.minutes = Minutes();
		select.ages = DateRange(1985, 2017, "reverse");

		this.setState({ select });

		setTimeout(() => {
			stateData.name = detail.name;
			stateData.hour = getSelectValue(select.hours, detail.time.slice(0, 2), "label");
			stateData.minute = getSelectValue(select.minutes, detail.time.slice(3, -3), "label");
			stateData.employee = getSelectValue(select.employees, detail.employee.employee_id, "value");
			stateData.age = getSelectValue(select.ages, detail.age, "label");
			stateData.imagePreview = detail.image ? detail.image : null;

			this.setState({ ...stateData, onLoadedData: true });
			this.renderFetch(gid);
		}, 500);
	}

	renderFetch(gid) {
		this.setState({ loadingData: true });
		ListPlayers({
			uid: localStorage.getItem("UID"),
			filter: {
				group_id: parseInt(gid)
			}
		}).then(response => {
			if (response) {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						if (data.length > 0) {
							data.map(el => {
								this.addItemList(el.security_id);
							});
						} else this.addItemList();
					}
				}

				this.setState({ loadingData: false });
			}
		});
	}

	handleSubmit = e => {
		try {
			e.preventDefault();
			const {
				uid,
				name,
				hour,
				minute,
				employee,
				age,
				image,
				players,
				addGroup,
				removeGroup,
				formErrors
			} = this.state;
			const { gid } = this.props;

			const requiredData = {};
			const playersArr = [];

			//required data
			requiredData.name = name;
			requiredData.hour = hour;
			requiredData.minute = minute;
			requiredData.employee = employee;
			requiredData.age = age;
			requiredData.formErrors = formErrors;

			console.log(`
            ---SUBMITTING---
               name: ${name}
               hour: ${hour}
               minute: ${minute}
               employee: ${employee}
               age: ${age}
           `);

			if (formValid(requiredData)) {
				this.setState({ loadingButton: "btn-loading" });
				players.map(el => {
					if (el.security_id && el.security_id !== "") playersArr.push(el.security_id);
				});

				const diffPlayers = removeGroup.diff(playersArr);

				Promise.all([
					UpdateGroup({
						group_id: gid,
						uid: uid,
						name: name,
						time: `${hour.value}:${minute.value}`,
						employee_id: employee.value,
						age: age.value,
						image: image
					}),
					UpdatePlayers({
						uid: uid,
						select: {
							security_id__in: playersArr
						},
						update: {
							group_id: gid
						}
					}),
					UpdatePlayers({
						uid: uid,
						select: {
							security_id__in: diffPlayers
						},
						update: {
							group_id: null
						}
					})
				]).then(([responseGroup, responsePlayers, responsePlayersRemove]) => {
					console.log(responseGroup);
					console.log(responsePlayers);
					console.log(responsePlayersRemove);
					if (responseGroup && responsePlayers && responsePlayersRemove) {
						if (
							responseGroup.status.code === 1020 &&
							responsePlayers.status.code === 1020 &&
							responsePlayersRemove.status.code === 1020
						) {
							Toast.fire({
								type: "success",
								title: "Başarıyla güncellendi..."
							});
							this.setState({ loadingButton: "" });
							this.props.history.push("/app/groups/all");
						}
					}
				});
			} else {
				console.error("FORM INVALID - DISPLAY ERROR");
				let formErrors = { ...this.state.formErrors };

				formErrors.name = !name ? "is-invalid" : "";
				formErrors.hour = hour ? "" : true;
				formErrors.minute = minute ? "" : true;
				formErrors.employee = employee ? "" : true;
				formErrors.age = age ? "" : true;

				this.setState({ formErrors });
			}
		} catch (e) {}
	};

	handleChange = e => {
		try {
			e.preventDefault();
			const { value, name } = e.target;
			const formErrors = { ...this.state.formErrors };

			switch (name) {
				case "name":
					formErrors.name = !value ? "is-invalid" : "";
					break;
				default:
					break;
			}
			this.setState({ formErrors, [name]: value });
		} catch (e) {}
	};

	handleImage = e => {
		try {
			const { uid } = this.state;
			e.preventDefault();
			const formData = new FormData();
			let reader = new FileReader();
			let file = e.target.files[0];
			reader.onloadend = () => {
				if (reader.result !== null) {
					this.setState({
						imagePreview: reader.result
					});
				}
				formData.append("image", file);
				formData.append("uid", uid);
				formData.append("to", this.props.gid);
				formData.append("type", "group");
				this.setState({ uploadedFile: false });
				UploadFile(formData)
					.then(response => {
						if (response) {
							if (response.status.code === 1020) {
								this.setState({ image: response.data });
							} else {
								Toast.fire({
									type: "error",
									title: "Görsel yüklenemedi..."
								});
							}
							this.setState({ uploadedFile: true });
						}
					})
					.catch(e => this.setState({ uploadedFile: true }));
			};

			reader.readAsDataURL(file);
		} catch (e) {}
	};

	handleSelect = (value, name, extraData, arr) => {
		const { players } = this.state;
		let formErrors = { ...this.state.formErrors };

		if (arr) {
			const findPlayer = players.find(x => x.key === extraData);
			findPlayer.security_id = value ? value.value : "";
		} else {
			formErrors[name] = value ? false : true;
			this.setState({ formErrors, [name]: value });
		}
	};

	render() {
		const {
			name,
			hour,
			minute,
			employee,
			age,
			select,
			uploadedFile,
			imagePreview,
			playerList,
			loadingButton,
			formErrors,
			onLoadedData
		} = this.state;
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="card-header p-4">
					<div className="card-status bg-green" />
					<h3 className="card-title">
						<input
							type="text"
							style={{ width: "13rem" }}
							className={`form-control ${formErrors.name}`}
							placeholder="Grup Adı *"
							name="name"
							onChange={this.handleChange}
							value={name || ""}
						/>
					</h3>
					<div className="card-options mr-0">
						<div style={{ width: "5rem" }}>
							<Select
								value={hour}
								isSearchable={true}
								isDisabled={select.hours ? false : true}
								onChange={val => this.handleSelect(val, "hour")}
								placeholder="00"
								name="hour"
								autosize
								styles={formErrors.hour === true ? customStylesError : customStyles}
								options={select.hours}
								noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
							/>
						</div>
						<span
							className="mx-2 font-weight-bold d-flex align-items-center"
							style={{ fontSize: "1.3rem" }}>
							:
						</span>
						<div style={{ width: "5rem" }}>
							<Select
								value={minute}
								isSearchable={true}
								isDisabled={select.minutes ? false : true}
								onChange={val => this.handleSelect(val, "minute")}
								placeholder="00"
								name="minute"
								autosize
								styles={formErrors.minute === true ? customStylesError : customStyles}
								options={select.minutes}
								noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
							/>
						</div>
					</div>
				</div>
				<div className="card-body">
					<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
						<div className="loader" />
						<div className="dimmer-content">
							<div className="row">
								<div className="col-auto">
									<label
										htmlFor="image"
										className={`avatar ${
											uploadedFile ? "" : "btn-loading"
										} avatar-xxxl cursor-pointer disabled`}
										style={{
											border: "none",
											outline: "none",
											fontSize: ".875rem",
											backgroundImage: `url(${imagePreview})`
										}}>
										{!imagePreview ? "Fotoğraf ekle" : ""}
									</label>
									<input
										type="file"
										accept="image/*"
										name="image"
										id="image"
										hidden
										onChange={this.handleImage}
									/>
								</div>
								<div className="col d-flex flex-column justify-content-center">
									<div className="form-group">
										<label className="form-label">
											Öğrenci Yaşı:
											<span className="form-required">*</span>
										</label>
										<Select
											value={age}
											isSearchable={true}
											isDisabled={select.ages ? false : true}
											placeholder="Doğum yılı..."
											onChange={val => this.handleSelect(val, "age")}
											name="age"
											autosize
											styles={formErrors.age === true ? customStylesError : customStyles}
											options={select.ages}
											noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
										/>
									</div>
								</div>
								<div className="col d-flex flex-column justify-content-center">
									<div className="form-group">
										<label className="form-label">
											Sorumlu Antrenör:
											<span className="form-required">*</span>
										</label>
										<Select
											value={employee}
											isSearchable={true}
											isDisabled={select.employees ? false : true}
											placeholder="Seç..."
											onChange={val => this.handleSelect(val, "employee")}
											name="employee"
											autosize
											styles={formErrors.employee === true ? customStylesError : customStyles}
											options={select.employees}
											noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											components={{ Option: ImageOption }}
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-12 mt-5">
									<label className="form-label" style={{ fontSize: "1.15rem" }}>
										Öğrenciler
									</label>
									<div>
										<table className="table table-vcenter text-nowrap table-outline mb-0">
											<tbody>
												{Array.isArray(playerList)
													? playerList.map((el, key) => (
															<tr key={el.id.toString()}>
																<td className="w-4 text-muted">#{key + 1}</td>
																<td>{el.select(this.state)}</td>
																<td className="w-1 pl-0">{el.buttons}</td>
															</tr>
													  ))
													: null}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="card-footer">
					<div className="d-flex" style={{ justifyContent: "space-between" }}>
						<a
							href="javascript:void(0)"
							onClick={() => {
								showSwal({
									type: "info",
									title: "Emin misiniz?",
									text: "İşlemi iptal etmek istediğinize emin misiniz?",
									confirmButtonText: "Evet",
									cancelButtonText: "Hayır",
									cancelButtonColor: "#cd201f",
									showCancelButton: true,
									reverseButtons: true
								}).then(result => {
									if (result.value) this.props.history.push("/app/groups");
								});
							}}
							className="btn btn-link">
							İptal
						</a>
						<div className="d-flex" style={{ alignItems: "center" }}>
							<button
								style={{ width: 100 }}
								type="submit"
								disabled={!uploadedFile ? true : false}
								className={`btn btn-primary ml-3 ${loadingButton}`}>
								Kaydet
							</button>
						</div>
					</div>
				</div>
			</form>
		);
	}
}

export default withRouter(Edit);
