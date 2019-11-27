import React, { Component } from "react";
import ActionButton from "./ActionButton";
import { fullnameGenerator, nullCheck, formatDate, formatPhone, formatMoney } from "../../services/Others";
import Vacation from "../EmployeeAction/Vacation";
import Password from "../EmployeeAction/Password";
import AdvancePayment from "../EmployeeAction/AdvancePayment";

export class PersonCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			employee: {}
		};
	}

	render() {
		const { employee } = this.state;
		const { data, history } = this.props;
		return (
			<div className="col-lg-4 col-sm-12 col-md-12">
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">Genel Bilgiler</h3>
					</div>
					<div className="card-body">
						<div className={`dimmer ${data.loading}`}>
							<div className="loader" />
							<div className="dimmer-content">
								<div className="media mb-5">
									<span
										className="avatar avatar-xxl mr-4"
										style={{ backgroundImage: `url(${data.image})` }}
									/>
									<div className="media-body">
										<h4 className="m-0">{fullnameGenerator(data.name, data.surname)}</h4>
										<p className="text-muted mb-0">{data.position ? data.position.label : "—"}</p>
										<ul className="social-links list-inline mb-0 mt-2">
											<li className="list-inline-item">
												<a
													className="employee_email"
													href={
														data.email
															? `mailto:${nullCheck(data.email)}`
															: ""
												}
													data-original-title={nullCheck(data.email)}
													data-toggle="tooltip">
													<i className="fa fa-envelope" />
												</a>
											</li>
											<li className="list-inline-item">
												<a
													className="employee_phone"
													href={
														data.phone
															? `tel:+90${nullCheck(data.phone)}`
															: ""
													}
													data-original-title={formatPhone(data.phone)}
													data-toggle="tooltip">
													<i className="fa fa-phone" />
												</a>
											</li>
										</ul>
									</div>
								</div>
								<div className="form-group">
									<label className="form-label">T.C. Kimlik Numarası</label>
									<div className="form-control-plaintext">{nullCheck(data.security_id)}</div>
								</div>
								<div className="form-group">
									<label className="form-label">Branşı</label>
									<div className="form-control-plaintext">
										{data.branch ? data.branch.label : "—"}
									</div>
								</div>
								<div className="form-group">
									<label className="form-label">
										Maaşı
										<span className="ml-1 align-self-center">
											<span
												className="form-help"
												data-toggle="popover"
												data-trigger="hover"
												data-placement="top"
												data-html="true"
												data-content='<p>Maaş bölümünü sadece yöneticinin yetkilendirdiği kişiler görüntüleyebilir.</p><p>Yönetici ise maaşları şifreleri ile görüntüleyebilir.</p><b>"—"</b>: Belirtilmedi.'>
												?
											</span>
										</span>
									</label>
									<div className="form-control-plaintext">
										<span>{formatMoney(data.salary)}</span>
									</div>
								</div>
								<div className="form-group">
									<label className="form-label">İşe Başlama Tarihi</label>
									<div className="form-control-plaintext">{formatDate(data.start_date, "LL")}</div>
								</div>
								{data.end_date ? (
									<div className="form-group">
										<label className="form-label">İşten Ayrılma Tarihi</label>
										<div className="form-control-plaintext">{formatDate(data.end_date, "LL")}</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
					<div className="card-footer">
						<ActionButton
							advancePaymentButton={employee =>
								this.setState({
									employee: employee
								})
							}
							vacationButton={employee =>
								this.setState({
									employee: employee
								})
							}
							passwordButton={employee =>
								this.setState({
									employee: employee
								})
							}
							history={history}
							data={{
								to: data.to,
								name: fullnameGenerator(data.name, data.surname),
								status: data.status
							}}
						/>

						<Vacation data={employee} history={history} />
						<Password data={employee} history={history} />
						<AdvancePayment data={employee} history={history} />
					</div>
				</div>
			</div>
		);
	}
}

export default PersonCard;
