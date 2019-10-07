import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

export class FastMenu extends Component {
	renderFABsMenu = () => {
		const dropdownDivider = key => <div role="separator" className="dropdown-divider" key={key.toString()} />;
		const lock = (
			<span className="ml-1">
				(<i className="fe fe-lock mr-0" />)
			</span>
		);

		const fabsMenu = [
			{
				name: "add-player",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/add`
				},
				childText: "Öğrenci Ekle",
				child: {
					className: "mr-2 fa fa-user-plus"
				},
				lock: false,
				condition: true
			},
			{
				name: "add-employee",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/employees/add`
				},
				childText: "Personel Ekle",
				child: {
					className: "mr-2 fa fa-user-tie"
				},
				lock: false,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},
			{
				name: "unpaid",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/reports/unpaid/players`
				},
				childText: "Ödeme Yapmayanlar",
				child: {
					className: "mr-2 fa fa-hand-holding"
				},
				lock: false,
				condition: true
			},
			{
				name: "payment",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/payment`
				},
				childText: "Ödeme Al",
				child: {
					className: "mr-2 fa fa-hand-holding-usd"
				},
				lock: false,
				condition: true
			},
			{
				name: "salary",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/employees/salary`
				},
				childText: "Maaş Öde",
				child: {
					className: "mr-2 fa fa-money-bill-wave"
				},
				lock: false,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},

			{
				name: "rollcall-player",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/rollcalls/player`
				},
				childText: "Öğrenci Yoklaması",
				child: {
					className: "mr-2 fa fa-user-clock"
				},
				lock: false,
				condition: true
			},
			{
				name: "rollcall-employee",
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/rollcalls/employee`
				},
				childText: "Personel Yoklaması",
				child: {
					className: "mr-2 fa fa-business-time"
				},
				lock: false,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},
			{
				name: "help",
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => console.log("help")
				},
				childText: "Yardım",
				child: {
					className: "mr-2 fa fa-life-ring"
				},
				lock: false,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},
			{
				name: "contact-us",
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => console.log("contact-us")
				},
				childText: "İletişime Geç",
				child: {
					className: "mr-2 fa fa-phone-alt"
				},
				lock: false,
				condition: true
			},
			{
				name: "comment",
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => console.log("comment")
				},
				childText: "Görüş Bildir",
				child: {
					className: "mr-2 fa fa-comments"
				},
				lock: false,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},
			{
				name: "bug",
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => console.log("bug")
				},
				childText: "Hata Bildir",
				child: {
					className: "mr-2 fa fa-bug text-red"
				},
				lock: false,
				condition: true
			},
			{
				name: "changelog",
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => console.log("changelog")
				},
				childText: "Sürüm Notları",
				child: {
					className: "mr-2 fa fa-code-branch text-indigo"
				},
				lock: false,
				condition: true
			}
		];

		return (
			<div id="FABs_v2">
				<div class="dropdown-menu show position-static">
					<h6 class="dropdown-header">
						<i className="fa fa-bolt mr-2 text-rss" /> Hızlı Erişim Menüsü
					</h6>
					<div class="dropdown-divider"></div>
					{fabsMenu.map((el, key) => {
						if (el.condition) {
							if (el.tag === "Link") {
								return (
									<Link {...el.elementAttr} key={key.toString()}>
										<i {...el.child} /> {el.childText}
										{el.lock}
									</Link>
								);
							} else if (el.tag === "button") {
								return (
									<button {...el.elementAttr} key={key.toString()}>
										<i {...el.child} /> {el.childText}
										{el.lock}
									</button>
								);
							} else {
								return el.divider(key);
							}
						}
					})}
				</div>
			</div>
		);
	};

	render() {
		return this.renderFABsMenu();
	}
}

export default withRouter(FastMenu);
