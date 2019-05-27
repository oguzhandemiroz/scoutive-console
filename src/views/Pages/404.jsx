import React, {Component} from "react";

class _404 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <h4>
                {this.props.location.pathname}
                <span className="text-muted"> bulunamadı...</span>
            </h4>
        );
    }
}

export default _404;
