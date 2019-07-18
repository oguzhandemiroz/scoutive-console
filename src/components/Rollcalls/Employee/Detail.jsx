import React, { Component } from "react";
import { ListEmployee } from "../../../services/Employee";
import { ListRollcallType } from "../../../services/Rollcalls";
import { CompleteRollcall, CreateRollcall } from "../../../services/Rollcalls";
import { Link } from "react-router-dom";
import { showSwal, Toast } from "../../Alert";
import moment from "moment";
import "moment/locale/tr";

const statusType = {
	"-1": { icon: "x", color: "danger" },
	"0": { icon: "x", color: "danger" },
	"1": { icon: "check", color: "success" },
	"2": { icon: "alert-circle", color: "warning" },
	"3": { icon: "alert-circle", color: "warning" }
};

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="5" className="text-center text-muted font-italic">
			{loading ? (
				<div className={`dimmer active`}>
					<div className="loader" />
					<div className="dimmer-content" />
				</div>
			) : (
				"Kayıt bulunamadı..."
			)}
		</td>
	</tr>
);

export class EmployeesRollcalls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			employees: null,
			onLoadedData: false,
			loadingButton: false
		};
	}

	renderEmployeeList = () => {
		const { uid, employees } = this.state;
		const { rcid } = this.props.match.params;
		ListRollcallType(
			{
				uid: uid,
				rollcall_id: rcid
			},
			"employees"
		).then(response => {
			if (response) {
				const data = response.data;
				const status = response.status;
				const dataList = [];
				if (status.code === 1020) {
					data.map(el => {
						dataList.push({
							uid: el.uid,
							name: el.name,
							surname: el.surname,
							position: el.position,
							phone: el.phone,
							image: el.image,
							status: el.status
						});
					});
					this.setState({
						employees: dataList,
						onLoadedData: true
					});
				}
			}
		});
	};

	componentDidMount() {
		this.renderEmployeeList();
	}

	takeRollcall = (to, type) => {
		try {
			const { uid } = this.state;
			const data = {
				status: parseInt(type),
				uid: uid,
				to: to
			};

			CreateRollcall(data).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						Toast.fire({
							type: "success",
							title: "İşlem başarılı..."
						});
					}
				}
			});
		} catch (e) {}
	};

	/*completeRollcall = () => {
		try {
			const { uid } = this.state;
			this.setState({ loadingButton: true });
			showSwal({
				type: "warning",
				title: "Uyarı",
				html: "Yoklamayı gün sonunda tamamlayınız. Tamamlanan yoklamalarda değişiklik <b><u>yapılamaz</u></b>",
				showCancelButton: true,
				cancelButtonColor: "#cd201f",
				cancelButtonText: "İptal",
				confirmButtonText: "Devam et",
				allowEnterKey: false
			}).then(result => {
				if (result.value) {
					CompleteRollcall(uid).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								showSwal({
									title: "Başarılı",
									html: `<b>${moment().format("LLL")}</b> tarihli yoklama tamamlanmıştır`,
									type: "success",
									confirmButtonText: "Tamam"
								});
							}
						}
					});
				}

				this.setState({ loadingButton: false });
			});
		} catch (e) {
			this.setState({ loadingButton: false });
		}
	};*/

	render() {
		const { employees, onLoadedData } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">
						Yoklamalar &mdash; Personel &mdash; Yoklama Geçmişi (#{this.props.match.params.rcid || 0})
					</h1>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-azure" />
								<h3 className="card-title">Personel Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b class="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
										!
									</span>
								</div>
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-striped table-outline table-vcenter text-nowrap card-table mb-0">
										<thead>
											<tr>
												<th className="pl-0 w-1" />
												<th>Ad Soyad</th>
												<th>Pozisyon</th>
												<th>Telefon</th>
												<th className="w-1">İşlem</th>
											</tr>
										</thead>
										<tbody>
											{employees
												? employees.length > 0
													? employees.map((el, key) => {
															console.log(el);
															const name = el.name || "";
															const surname = el.surname || "";
															return (
																<tr key={key.toString()}>
																	<td className="text-center">
																		<div
																			className="avatar d-block"
																			style={{
																				backgroundImage: `url(${el.image})`
																			}}
																		/>
																	</td>
																	<td>
																		<Link
																			className="text-inherit"
																			to={`/app/employees/detail/${el.uid}`}>
																			{name + " " + surname}
																		</Link>
																	</td>
																	<td>{el.position}</td>
																	<td>
																		{el.phone ? (
																			<a
																				href={`tel:${el.phone}`}
																				title={el.phone}>
																				{el.phone}
																			</a>
																		) : (
																			"—"
																		)}
																	</td>
																	<td className="text-center">
																		<div
																			className={`text-${statusType[el.status].color}`}
																			style={{ fontSize: 20 }}>
																			<i
																				className={`fe fe-${statusType[el.status].icon}`}
																			/>
																		</div>
																	</td>
																</tr>
															);
													  })
													: noRow()
												: noRow(true)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EmployeesRollcalls;
