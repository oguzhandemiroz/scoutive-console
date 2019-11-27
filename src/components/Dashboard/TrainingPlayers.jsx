import React, { Component } from "react";
import { Link } from "react-router-dom";
import { nullCheck, fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import moment from "moment";

const noPlayers = () => (
    <div className="col-12 font-italic text-muted text-center mt-2">Gruba kayıtlı öğrenci bulunamadı...</div>
);

export class TrainingPlayers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                players: []
            }
        };
    }

    componentDidMount() {
        this.setState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    render() {
        const { data } = this.state;
        return (
            <div
                className="modal fade"
                id="trainingPlayers"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="trainingPlayersLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="trainingPlayersLabel">
                                Antrenmanda Olan Öğrenciler
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Kapat" />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Grup Bilgisi</label>
                                <div className="form-control-plaintext">{nullCheck(data.name)}</div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Öğrenciler</label>
                                <div className="row gutters-xs">
                                    {data.players.length > 0
                                        ? data.players
                                              .sort((a, b) => (b.status === 1 ? 1 : -1))
                                              .map((el, key) => {
                                                  return (
                                                      <div className="col-6 my-3" key={key.toString()}>
                                                          <div className="row">
                                                              <div className="col-auto">
                                                                  <span
                                                                      className="avatar"
                                                                      style={{ backgroundImage: `url(${el.image})` }}>
                                                                      {el.image
                                                                          ? ""
                                                                          : avatarPlaceholder(el.name, el.surname)}
                                                                  </span>
                                                              </div>
                                                              <div className="col pl-0">
                                                                  <Link
                                                                      to={"/app/players/detail/" + el.uid}
                                                                      className="text-inherit d-block">
                                                                      {fullnameGenerator(el.name, el.surname)}
                                                                  </Link>
                                                                  <div
                                                                      className={`badge ${
                                                                          el.status === 1
                                                                              ? "badge-success"
                                                                              : el.status === 0 || el.status === -1
                                                                              ? "badge-danger"
                                                                              : "badge-warning"
                                                                      }`}>
                                                                      {el.status === 1
                                                                          ? "Antrenmanda"
                                                                          : el.status === 0 || el.status === -1
                                                                          ? "Gelmedi"
                                                                          : "İzinli"}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  );
                                              })
                                        : noPlayers()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrainingPlayers;
