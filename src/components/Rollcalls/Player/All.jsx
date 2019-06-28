import React, { Component } from "react";

export class All extends Component {
	render() {
		return (
			<div className="card">
				<div className="card-body">
					<div className="card-status bg-gray" />
					<div className="text-wrap p-lg-6">
						<h2 className="mt-0 mb-4">Öğrenci Yoklaması</h2>
						<p>Bu sayfadan öğrencilerin yoklama kaydını tutabilirsiniz.</p>
						<p>
							Yoklama almak için önce grup seçiniz, daha sonra gruba kayıtlı olan öğrencilerinizin yoklama
							durumunu belirleyebilirsiniz.
						</p>
						<h3 id="setup-environment">Yoklama Rehberi</h3>
						<p>Yoklama işlemi yapabilmek için aşağıdaki maddeleri takip edebilirsiniz.</p>
						<ol>
							<li>Sol taraftaki menüden yoklama yapacağınız grubu seçebilirsiniz.</li>
							<li>Ekrana gelen grup detayında geçmişte yaptığınız yoklamaları görebilirsiniz.</li>
							<li>
								Yeni yoklama oluşturmak için, yeşil renkli "Yoklama Oluştur" düğmesine
								tıklayabilirsiniz.
							</li>
							<li>
								<p>Açılan sayfadan gruba dahil olan öğrencinin yoklama durumunu belirtebilirsiniz.</p>
								<p>
									Sisteme <b>"geldi"</b> veya <b>"izinli"</b> olarak giriş yapabilirsiniz.
									Gelmeyenleri işaretlemenize gerek yoktur.
								</p>
								<p>
									Yoklama tamamladığında sistem otomatik olarak işaretli olmayanları
									<b> "gelmedi"</b> şeklinde tanımlayacaktır.
								</p>
							</li>
							<li>
								Yoklamayı <u>gün sonunda</u> mavi renkli "Yoklamayı Tamamla" düğmesinden
								tamamlayabilirsiniz.
							</li>
						</ol>
						<p className="font-italic">
							<span className="text-red">Not:</span> Tamamlanan yoklamalarda değişiklik yapılamaz.
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default All;
