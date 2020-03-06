import React, { Component } from "react";
import not_dashboard from "../../assets/images/illustrations/not_dashboard.svg";

export class NotPermissions extends Component {
    static defaultProps = {
        image: not_dashboard,
        imageWidth: "370px"
    };

    render() {
        const { content, image, imageAlt, title, imageWidth } = this.props;
        return (
            <div className="card">
                <div className="card-body text-center p-7">
                    <img src={image} alt={imageAlt} style={{ width: imageWidth }} />
                    <h5 className="mt-5 mb-1">{title}</h5>
                    {content && content()}
                </div>
            </div>
        );
    }
}

export default NotPermissions;
