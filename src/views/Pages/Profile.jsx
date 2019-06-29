import React, {Component} from "react";
import {Profile as SchoolProfile} from "../../components/Pages/Profile";
import {Detail as EmployeeProfile} from "../../components/Employees/Detail";

export class Profile extends Component {
    getProfileForType = () => {
        const type = parseInt(localStorage.getItem("sType"));
        return type === 0 ? (
            <SchoolProfile match={this.props.match} />
        ) : (
            <EmployeeProfile match={this.props.match} />
        );
    };

    render() {
        return this.getProfileForType();
    }
}

export default Profile;
