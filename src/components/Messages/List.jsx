import React, { Component } from "react";

export class List extends Component {
    render() {
        return (
            <div>
                <table
                    id="player-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="no-sort">T.C.</th>
                            <th className="w-1 no-sort control" />
                            <th className="w-1 text-center no-sort">#</th>
                            <th className="name">AD SOYAD</th>
                            <th className="parents">VELİSİ</th>
                            <th className="fee">AİDAT</th>
                            <th className="point">GENEL PUAN</th>
                            <th className="foot">KULLANDIĞI AYAK</th>
                            <th className="position">MEVKİİ</th>
                            <th className="birthday">DOĞUM GÜNÜ</th>
                            <th className="groups">GRUP</th>
                            <th className="daily" title="Yoklama Durumu">
                                YOKLAMA DURUMU
                            </th>
                            <th className="no-sort action" />
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
