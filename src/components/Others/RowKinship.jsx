import React, { Component } from "react";

export class RowKinship extends Component {
    createTasks(item) {
        return 
    }
	render() {
		const { select, customStyles } = this.props;
		return (
			<tr>
				<td className="pl-0 pr-0">
					<Select
						onChange={val => this.handleSelect(val, "kinship")}
						options={select}
						name="kinship"
						placeholder="Seç..."
						styles={customStyles}
						isClearable={true}
						isSearchable={true}
						isDisabled={select ? false : true}
						noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
						menuPlacement="top"
					/>
				</td>
				<td>
					<input type="text" className="form-control" />
				</td>
				<td className="pl-0">
					<input type="text" className="form-control" />
				</td>
				<td
					style={{
						width: "5.5rem",
						verticalAlign: "middle"
					}}
					className="pl-0 pr-0">
					<button type="button" className="btn btn-sm btn-icon btn-success mr-1">
						<i className="fe fe-plus" />
					</button>
					<button type="button" className="btn btn-sm btn-icon btn-danger">
						<i className="fe fe-minus" />
					</button>
				</td>
			</tr>
		);
	}
}

export default RowKinship;
