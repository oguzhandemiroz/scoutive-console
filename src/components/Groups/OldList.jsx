import React, { Component } from "react";
import { ListGroups } from "../../services/Group";
import { Link, withRouter } from "react-router-dom";
const $ = require("jquery");

export class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null
        };
    }

    componentDidMount() {
        try {
            const { uid } = this.state;
            ListGroups(uid).then(response => {
                if (response) {
                    let sortData = response.data;
                    sortData = sortData.sort((a, b) => {
                        return parseInt(a.start_time) > parseInt(b.start_time) ? 1 : -1;
                    });
                    this.setState({ list: sortData });
                    $('[data-toggle="tooltip"]').tooltip();
                }
            });
        } catch (e) {}
    }

    render() {
        const { list } = this.state;
        const { location, match } = this.props;
        return (
            <div className={`dimmer ${!list ? "active" : ""}`}>
                <div className="loader" />
                <div className="dimmer-content">
                    <div className="list-group list-group-transparent mb-0">
                        {Array.isArray(list)
                            ? list.map((el, key) => {
                                  return (
                                      <Link
                                          to={{
                                              pathname: "/app/groups/detail/" + el.group_id,
                                              state: {
                                                  type: "detail",
                                                  detailGroup: el
                                              }
                                          }}
                                          key={key.toString()}
                                          className={`list-group-item list-group-item-action d-flex ${
                                              match.params.gid === el.group_id.toString() ? "active" : ""
                                          }`}>
                                          <span className="icon mr-3">
                                              <i className="fe fe-grid" />
                                          </span>
                                          <span
                                              data-original-title={el.name}
                                              data-toggle="tooltip"
                                              className="text-truncate pr-2"
                                              style={{ flex: 1 }}>
                                              {el.name}
                                          </span>
                                          <span
                                              className="float-right tag tag-gray"
                                              data-toggle="tooltip"
                                              title={el.area ? el.area.name : "Kayıtlı Saha Yok"}>
                                              {el.start_time.slice(0, -3)} - {el.end_time.slice(0, -3)}
                                          </span>
                                      </Link>
                                  );
                              })
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(List);