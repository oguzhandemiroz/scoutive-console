import React, {Component} from "react";
import {showSwal} from "../../components/Alert.jsx";

export class Add extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Ekle</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-auto m-auto">
                                        <label
                                            htmlFor="image"
                                            className="avatar avatar-xxxl cursor-pointer"
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                fontSize: ".875rem"
                                            }}>
                                            Fotoğraf Ekle
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            id="image"
                                            hidden
                                            onChange={this.handleImage}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Adı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control`}
                                        onChange={this.handleChange}
                                        placeholder="Adı"
                                        name="name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Soyadı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control`}
                                        onChange={this.handleChange}
                                        placeholder="Soyadı"
                                        name="surname"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        T.C. Kimlik No
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control`}
                                        onChange={this.handleChange}
                                        placeholder="T.C. Kimlik No"
                                        name="securityNo"
                                        maxLength="11"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Branşı
                                        <span className="form-required">*</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Aidat
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control`}
                                        onChange={this.handleChange}
                                        placeholder="Aidat"
                                        name="fee"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Genel Puanı
                                        <span className="form-required">*</span>
                                    </label>
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <input
                                                type="range"
                                                className="form-control custom-range"
                                                step="0.1"
                                                min="1"
                                                max="5"
                                            />
                                        </div>
                                        <div className="col-auto">
                                            <input
                                                type="number"
                                                className="form-control w-8"
                                                value="1.2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                onChange={this.handleChange}
                                                name="email"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Telefonu
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                onChange={this.handleChange}
                                                name="phone"
                                                placeholder="Telefon (05xx)"
                                                maxLength="11"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Doğum Tarihi
                                                <span className="form-required">*</span>
                                            </label>
                                            <div className="row gutters-xs">
                                                <div className="col-4" />
                                                <div className="col-4" />
                                                <div className="col-4" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Adresi</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                rows={6}
                                                placeholder="Adres"
                                                defaultValue={""}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Vücut Metrikleri (Boy & Kilo)
                                            </label>
                                            <div className="row gutters-xs">
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="height"
                                                        placeholder="Boy (cm)"
                                                        min={0}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="weight"
                                                        placeholder="Kilo (kg)"
                                                        id="weight"
                                                        min={0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Cinsiyeti</label>
                                            <div className="selectgroup w-100">
                                                <label className="selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue={0}
                                                        className="selectgroup-input"
                                                        defaultChecked
                                                    />
                                                    <span className="selectgroup-button">
                                                        Erkek
                                                    </span>
                                                </label>
                                                <label className="selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        defaultValue={1}
                                                        className="selectgroup-input"
                                                    />
                                                    <span className="selectgroup-button">Kız</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Kan Grubu</label>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Kullandığı Ayak
                                                <span className="form-required">*</span>
                                            </label>
                                            <div className="custom-controls-stacked">
                                                <label className="custom-control custom-radio custom-control-inline">
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name="example-inline-radios"
                                                        value="option1"
                                                        checked
                                                    />
                                                    <span className="custom-control-label">Sağ</span>
                                                </label>
                                                <label className="custom-control custom-radio custom-control-inline">
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name="example-inline-radios"
                                                        value="option2"
                                                    />
                                                    <span className="custom-control-label">Sol</span>
                                                </label>
                                                <label className="custom-control custom-radio custom-control-inline">
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name="example-inline-radios"
                                                        value="option3"
                                                    />
                                                    <span className="custom-control-label">
                                                        Sağ & Sol
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Ayak Numarası
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={`form-control`}
                                                onChange={this.handleChange}
                                                placeholder="Ayak Numarası"
                                                name="foot_no"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">
                                            Acil Durumda İletişim
                                            <span className="form-required">*</span>
                                        </label>
                                        <div id="parent">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0">Yakınlık</th>
                                                        <th>Adı ve Soyadı</th>
                                                        <th className="pl-0">Telefon</th>
                                                        <th
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0">
                                                            Ekle/Sil
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="pl-0 pr-0" />
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td className="pl-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                width: "5.5rem",
                                                                verticalAlign: "middle"
                                                            }}
                                                            className="pl-0 pr-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-success mr-1">
                                                                <i className="fe fe-plus" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-danger">
                                                                <i className="fe fe-minus" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Vücut Ölçüleri</label>
                                        <div id="school">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0">Tür</th>
                                                        <th>Değer</th>
                                                        <th
                                                            style={{width: "5.5rem"}}
                                                            className="pl-0">
                                                            Ekle/Sil
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="pl-0 pr-0" />
                                                        <td className="pl-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                width: "5.5rem",
                                                                verticalAlign: "middle"
                                                            }}
                                                            className="pl-0 pr-0">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-success mr-1">
                                                                <i
                                                                    className="fe fe-plus"
                                                                    id="addSchool"
                                                                />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-danger">
                                                                <i className="fe fe-minus" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-right">
                                <div className="d-flex" style={{justifyContent: "space-between"}}>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                            showSwal({
                                                type: "info",
                                                title: "Emin misiniz?",
                                                text:
                                                    "İşlemi iptal etmek istediğinize emin misiniz?",
                                                confirmButtonText: "Evet",
                                                cancelButtonText: "Hayır",
                                                cancelButtonColor: "#cd201f",
                                                showCancelButton: true,
                                                reverseButtons: true
                                            }).then(result => {
                                                if (result.value)
                                                    this.props.history.push("/app/players");
                                            });
                                        }}
                                        className="btn btn-link">
                                        İptal
                                    </a>
                                    <div className="d-flex" style={{alignItems: "center"}}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="addContinuously"
                                                className="custom-switch-input"
                                            />
                                            <span className="custom-switch-indicator" />
                                            <span className="custom-switch-description">
                                                Sürekli ekle
                                            </span>
                                        </label>
                                        <span className="mx-2">
                                            <span
                                                className="form-help"
                                                data-toggle="popover"
                                                data-placement="top"
                                                data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Personeller"</b> sayfasına yönlendirilirsiniz.</p>'>
                                                ?
                                            </span>
                                        </span>
                                        <button
                                            style={{width: 100}}
                                            type="submit"
                                            className={`btn btn-primary ml-3`}>
                                            Ekle ve Bitir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Add;
