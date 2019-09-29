import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import deletePlayer from "../PlayerAction/DeletePlayer";
import freezePlayer from "../PlayerAction/FreezePlayer";
import refreshPlayer from "../PlayerAction/RefreshPlayer";
import activatePlayer from "../PlayerAction/ActivatePlayer";

export class ActionButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: {}
		};
	}

	renderActionButton = () => {
		const { uid } = this.state;
		const { data, renderButton, history, dropdown } = this.props;
		const { to, name, is_trial, status, group } = data;
		const fullname = name;

		const dropdownDivider = key => <div role="separator" className="dropdown-divider" key={key.toString()} />;
		const lock = (
			<span className="ml-1">
				(<i className="fe fe-lock mr-0" />)
			</span>
		);

		const actionMenu = [
			{
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/payment/${to}`,
					onClick: () => history.push(`/app/players/payment/${to}`)
				},
				childText: "Ödeme Al",
				child: {
					className: "dropdown-icon fa fa-hand-holding-usd"
				},
				lock: false,
				condition: !is_trial
			},
			{
				divider: key => dropdownDivider(key),
				condition: !is_trial && status === 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item cursor-not-allowed disabled",
					onClick: () => console.log("Ödeme İkazı")
				},
				childText: "Ödeme İkazı",
				child: {
					className: "dropdown-icon fa fa-exclamation-triangle"
				},
				lock: lock,
				condition: !is_trial && status !== 0
			},
			{
				divider: key => dropdownDivider(key),
				condition: !is_trial && status !== 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => freezePlayer(uid, to, fullname, history)
				},
				childText: "Kaydı Dondur",
				child: {
					className: "dropdown-icon fa fa-snowflake"
				},
				lock: false,
				condition: !is_trial && status === 1
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => history.push(`/app/players/trial/activate/${to}`)
				},
				childText: "Kaydı Başlat",
				child: {
					className: "dropdown-icon fa fa-play-circle"
				},
				lock: false,
				condition: is_trial === 1 && status === 1
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => activatePlayer(uid, to, fullname, history)
				},
				childText: "Kaydı Aktifleştir",
				child: {
					className: "dropdown-icon fa fa-redo"
				},
				lock: false,
				condition: !is_trial && status === 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => refreshPlayer(uid, to, fullname, history)
				},
				childText: "Kaydı Yenile",
				child: {
					className: "dropdown-icon fa fa-sync-alt"
				},
				lock: false,
				condition: !is_trial && status === 2
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => deletePlayer(uid, to, fullname, history)
				},
				childText: "Kaydı Sil",
				child: {
					className: "dropdown-icon fa fa-user-times"
				},
				lock: false,
				condition: status !== 0
			},
			{
				divider: key => dropdownDivider(key),
				condition: status !== 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () => this.props.vacationButton({ name: fullname, uid: to }),
					"data-toggle": "modal",
					"data-target": "#vacationModal"
				},
				childText: "İzin Yaz",
				child: {
					className: "dropdown-icon fa fa-coffee"
				},
				lock: false,
				condition: !is_trial && status === 1
			},
			{
				divider: key => dropdownDivider(key),
				condition: !is_trial && status === 1
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item cursor-not-allowed disabled",
					onClick: () => console.log("Not (Puan) Ver")
				},
				childText: "Not (Puan) Ver",
				child: {
					className: "dropdown-icon fa fa-notes-medical"
				},
				lock: lock,
				condition: !is_trial && status === 1
			},
			{
				divider: key => dropdownDivider(key),
				condition: !is_trial && status === 1
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item cursor-not-allowed disabled",
					onClick: () => console.log("Veliye Mesaj Gönder")
				},
				childText: "Veliye Mesaj Gönder",
				child: {
					className: "dropdown-icon fa fa-paper-plane"
				},
				lock: lock,
				condition: true
			},
			{
				divider: key => dropdownDivider(key),
				condition: true
			},
			{
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/edit/${to}`,
					onClick: () => history.push(`/app/players/edit/${to}`)
				},
				childText: "Düzenle",
				child: {
					className: "dropdown-icon fa fa-pen"
				},
				lock: false,
				condition: is_trial === 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item",
					onClick: () =>
						this.props.groupChangeButton({
							name: fullname,
							uid: to,
							group: typeof group === "string" ? group : group ? group.label : null,
							group_id: group ? group.value : null
						}),
					"data-toggle": "modal",
					"data-target": "#groupChangeModal"
				},
				childText: "Grup Değişikliği",
				child: {
					className: "dropdown-icon fa fa-user-cog"
				},
				lock: false,
				condition: !is_trial && status !== 0
			},
			{
				divider: key => dropdownDivider(key),
				condition: !is_trial && status !== 0
			},
			{
				tag: "button",
				elementAttr: {
					className: "dropdown-item cursor-not-allowed disabled",
					onClick: () => console.log("Öğrenci Belgesi")
				},
				childText: "Öğrenci Belgesi",
				child: {
					className: "dropdown-icon fa fa-id-card-alt"
				},
				lock: lock,
				condition: true
			},
			{
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/fee-detail/${to}`,
					onClick: () => history.push(`/app/players/fee-detail/${to}`)
				},
				childText: "Tüm Aidat Bilgisi",
				child: {
					className: "dropdown-icon fa fa-receipt"
				},
				lock: false,
				condition: true
			},
			{
				tag: "Link",
				elementAttr: {
					className: "dropdown-item",
					to: `/app/players/detail/${to}`,
					onClick: () => history.push(`/app/players/detail/${to}`)
				},
				childText: "Tüm Bilgileri",
				child: {
					className: "dropdown-icon fa fa-info-circle"
				},
				lock: false,
				condition: true
			}
		];

		return (
			<div className={`btn-block ${dropdown ? "dropdown" : "dropup"}`} id="action-dropdown">
				{renderButton ? (
					renderButton()
				) : (
					<button
						type="button"
						id="player-action"
						className="btn btn-gray-dark btn-block dropdown-toggle"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false">
						İşlem
					</button>
				)}
				<div
					className="dropdown-menu dropdown-menu-right"
					aria-labelledby="player-action"
					x-placement="top-end">
					<a className="dropdown-item disabled text-azure" href="javascript:void(0)">
						<i className="dropdown-icon fa fa-user text-azure" />
						{fullname}
					</a>
					<div role="separator" className="dropdown-divider" />
					{actionMenu.map((el, key) => {
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
		return <>{this.renderActionButton()}</>;
	}
}

export default ActionButton;
