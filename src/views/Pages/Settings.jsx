import React, {Component} from "react";
import SettingsSchool from "../../components/Pages/SettingsSchool";
import SettingsEmployee from "../../components/Pages/SettingsEmployee";

export class Settings extends Component {
    getSettingsForType = () => {
        const type = parseInt(localStorage.getItem("sType"));
        return type === 1 ? (
            <SettingsSchool props={this.props} />
        ) : (
            <SettingsEmployee match={this.props.match} />
        );
    };
    render = () => this.getSettingsForType();
}

export default Settings;
