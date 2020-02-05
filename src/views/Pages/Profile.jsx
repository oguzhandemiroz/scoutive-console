import React, { Component } from "react";
import { Profile as SchoolProfile } from "../../components/Pages/ProfileSchool";
import { Detail as EmployeeProfile } from "../../components/Pages/ProfileEmployee";

export class Profile extends Component {
    getProfileForType = () => {
        const type = parseInt(localStorage.getItem("sType"));
        /* return type === 0 ? (
            <SchoolProfile props={this.props} />
        ) : (
            <EmployeeProfile match={this.props.match} />
        ); */
        return <SchoolProfile props={this.props} />;
    };

    render() {
        return this.getProfileForType();
    }
}

export default Profile;
