import React, { Component } from "react";
import { getCookie, setCookie } from "../../assets/js/core";
const $ = require("jquery");

export class WarningModal extends Component {
	agree = () => {
		setCookie("RollcallsAgree", "OK", 1, "D");
	};

	componentDidMount() {
		if (getCookie("RollcallsAgree") !== "OK") $("#myModal").modal();
	}
	render() {
		return (
			<div className="modal fade" tabIndex="-1" role="dialog" id="myModal">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title text-dark">Uyarı!</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
						</div>
						<div className="modal-body text-dark" style={{ fontSize: 16 }}>
							<p>
								Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak
								giriş yapabilirsiniz.
							</p>
							<p>
								Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme{" "}
								<b>"gelmedi"</b> şeklinde tanımlanır.
							</p>
							<p>
								<b className="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz.
								Tamamlanan yoklamalarda değişiklik{" "}
								<b>
									<u>
										<i>yapılamaz.</i>
									</u>
								</b>
							</p>
						</div>
						<div className="modal-footer">
							<button onClick={this.agree} type="button" className="btn btn-primary" data-dismiss="modal">
								Anladım
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default WarningModal;
