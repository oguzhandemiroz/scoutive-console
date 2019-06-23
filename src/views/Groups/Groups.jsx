import React, {Component} from "react";
import List from "../../components/Groups/List";
import All from "../../components/Groups/All";
import Detail from "../../components/Groups/Detail";
import Add from "../../components/Groups/Add";
import Edit from "../../components/Groups/Edit";
import {Link, withRouter} from "react-router-dom";

const RenderContent = ({component: Component, ...rest}) => <Component {...rest} />;

export class Groups extends Component {
    SwitchComponent = path => {
        const {match, location} = this.props;
        switch (path) {
            case "all":
                return <RenderContent component={All} />;
            case "detail":
                return (
                    <RenderContent
                        component={Detail}
                        gid={match.params.gid}
                        detail={location.state.detailGroup}
                    />
                );
            case "edit":
                return (
                    <RenderContent
                        component={Edit}
                        gid={match.params.gid}
                        detail={location.state.detailGroup}
                    />
                );
            case "create":
                return <RenderContent component={Add} />;
            default:
                break;
        }
    };
    render() {
        console.log(this.props);
        const {location} = this.props;
        const splitpath = location.pathname.split("/");
        const lastpath = splitpath[splitpath.length - 1];
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar</h1>
                </div>
                <div className="row">
                    <div className="col-lg-3 mb-4">
                        <Link to="/app/groups/create" className="btn btn-block btn-secondary mb-6">
                            <i className="fe fe-plus-square mr-2" />
                            Grup Ekle
                        </Link>
                        <List />
                        <div className="d-none d-lg-block mt-6">
                            <Link to="/app/groups/all" className="text-muted float-right">
                                Başa dön
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="card">{this.SwitchComponent(lastpath)}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Groups);
