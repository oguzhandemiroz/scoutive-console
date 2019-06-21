import React, { Component } from "react";

export class All extends Component {
	render() {
		return (
			<div className="card-body">
				<div className="card-status bg-gray" />
				<div className="text-wrap p-lg-6">
					<h2 className="mt-0 mb-4">Gruplar</h2>
					<p>Bu sayfadan grup oluşturabilir, görüntüleyebilir ve düzenleyebilirsin.</p>
					<p>
						Grubu düzenlemek için önce görüntülemen gerekir. Sol menüden grup seçebilir ve
						görüntüleyebilirsin.
					</p>
				</div>
			</div>
		);
	}
}

export default All;
