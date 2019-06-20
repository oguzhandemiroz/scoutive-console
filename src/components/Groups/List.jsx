import React, { Component } from "react";
import { ListGroups } from "../../services/Group";
import { Link, withRouter } from "react-router-dom";

export class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			list: null
		};

		console.log(this.props);
	}

	componentWillMount() {
		try {
			const { uid } = this.state;
			ListGroups(uid).then(response => {
				if (response) {
					this.setState({ list: response.data });
				}
			});
		} catch (e) {}
	}

	render() {
		const { list } = this.state;
		const { location, match } = this.props;
		return (
			<div>
				<div className="list-group list-group-transparent mb-0">
					{Array.isArray(list)
						? list.map((el, key) => {
								return (
									<Link
										to={"/app/groups/" + el.group_id}
										key={key.toString()}
										className={`list-group-item list-group-item-action ${
											match.params.gid === el.group_id.toString() ? "active" : ""
										}`}>
										<span className="icon mr-3">
											<i className="fe fe-grid" />
										</span>
										<span>{el.name}</span>
										<span className="float-right">{el.time.slice(0, -3)}</span>
									</Link>
								);
						  })
						: null}
				</div>
			</div>
		);
	}
}

export default withRouter(List);
