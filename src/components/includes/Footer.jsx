import React, { Component } from "react";
import {} from "react-router-dom";

class Footer extends Component {
	render() {
		return (
			<div id="footer">
				<footer class="footer">
					<div class="container">
						<div class="row align-items-center flex-row-reverse">
							<div class="col-auto ml-lg-auto">
								<div class="row align-items-center">
									<div class="col-auto">
										<ul class="list-inline list-inline-dots mb-0">
											<li class="list-inline-item">
												<a
													target="_blank"
													href="https://scoutive.net/ScoutivePrivacyPolicy.pdf">
													Gizlilik Sözleşmesi
												</a>
											</li>
											<li class="list-inline-item">
												<a target="_blank" href="https://scoutive.net/#faq">
													S.S.S
												</a>
											</li>
										</ul>
									</div>
									<div class="col-auto">
										<a
											target="_blank"
											href="https://scoutive.net/#footer"
											class="btn btn-outline-primary btn-sm">
											İletişime Geç
										</a>
									</div>
								</div>
							</div>
							<div class="col-12 col-lg-auto mt-3 mt-lg-0 text-center">
								Copyright © 2019{" "}
								<a target="_blank" href="https://scoutive.net">
									Scoutive
								</a>
								. Tüm hakları saklıdır.
							</div>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

export default Footer;
