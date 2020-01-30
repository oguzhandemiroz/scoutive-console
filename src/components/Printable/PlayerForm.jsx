import React, { Component } from "react";
/* import "../../assets/css/paper.css";
import "../../assets/css/normalize.css";
 */
const styling = `
@page {
    size: A4;
}
    body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #fff !important;
        font-size: 15px !important;
        line-height: 160% !important;
        mso-line-height-rule: exactly !important;
        color: #000 !important;
        width: 100% !important;
    }

    @media only screen and (max-width: 560px) {
        body {
            font-size: 14px !important;
        }
    }

    body,
    table,
    td {
        font-family: Arial, sans-serif !important;
        vertical-align: middle;
    }

    table {
        border-collapse: collapse !important;
        width: 100% !important;
    }

    table:not(.main) {
        -premailer-cellpadding: 0 !important;
        -premailer-cellspacing: 0 !important;
    }

    .preheader {
        padding: 0 !important;
        font-size: 0 !important;
        display: none !important;
        max-height: 0 !important;
        mso-hide: all !important;
        line-height: 0 !important;
        color: transparent !important;
        height: 0 !important;
        max-width: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
        width: 0 !important;
    }

    .main {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
    }

    .wrap {
        width: 100% !important;
        max-width: 640px !important;
        text-align: left !important;
    }

    .box {
        background: #fff !important;
        border-radius: 3px !important;
        -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05) !important;
        border: 1px solid #f0f0f0 !important;
    }

    .box + .box {
        margin-top: 24px !important;
    }

    .content {
        padding: 40px 48px !important;
        font-size: 15px !important;
        line-height: 160% !important;
        mso-line-height-rule: exactly !important;
        color: #444 !important;
        width: 100% !important;
    }

    @media only screen and (max-width: 560px) {
        .content {
            padding: 24px !important;
        }
    }

    .h1,
    h1 {
        font-weight: 600 !important;
        margin: 0 0 0.5em !important;
    }

    .h1 a,
    h1 a {
        color: inherit !important;
    }

    .h1,
    h1 {
        font-size: 28px !important;
        font-weight: 600 !important;
        line-height: 130% !important;
    }

    .h3,
    h3 {
        font-size: 18px;
        font-weight: 600 !important;
        margin: 0 0 0.5em !important;
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 0 !important;
    }

    @media only screen and (max-width: 560px) {
        .h1,
        h1 {
            font-size: 24px !important;
        }
    }

    img {
        border: 0 none !important;
        line-height: 100% !important;
        outline: 0 !important;
        text-decoration: none !important;
        vertical-align: baseline !important;
        font-size: 0 !important;
    }

    a {
        color: #467fcf !important;
        text-decoration: none !important;
    }

    a:hover {
        text-decoration: underline !important;
    }

    a img {
        border: 0 none !important;
    }

    strong {
        font-weight: 600 !important;
    }

    .btn {
        text-decoration: none !important;
        white-space: nowrap !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        padding: 12px 32px !important;
        border-radius: 3px !important;
        color: #fff !important;
        line-height: 100% !important;
        display: block !important;
        border: 1px solid transparent !important;
        -webkit-transition: 0.3s background-color !important;
        transition: 0.3s background-color !important;
    }

    .btn:hover {
        text-decoration: none !important;
    }

    .btn-span {
        color: #fff !important;
        font-size: 16px !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        font-weight: 600 !important;
        line-height: 100% !important;
    }

    .text-muted {
        color: #9eb0b7 !important;
    }

    .text-muted-light {
        color: #bbc8cd !important;
    }

    .bg-blue {
        background-color: #467fcf !important;
        color: #fff !important;
    }

    a.bg-blue:hover {
        background-color: #3a77cc !important;
    }

    .border-blue {
        border-color: #467fcf !important;
    }

    .text-right {
        text-align: right !important;
    }

    .text-center {
        text-align: center !important;
    }

    .va-middle {
        vertical-align: middle !important;
    }

    .img-illustration {
        max-width: 240px !important;
        max-height: 160px !important;
        width: auto !important;
        height: auto !important;
    }

    .rounded {
        border-radius: 3px !important;
    }

    table.rounded {
        border-collapse: separate !important;
    }

    .w-auto {
        width: auto !important;
    }

    .font-sm {
        font-size: 13px !important;
    }

    .lh-1 {
        line-height: 100% !important;
    }

    .border {
        border: 1px solid #f0f0f0 !important;
    }

    .m-0 {
        margin: 0 !important;
    }
    .mt-0 {
        margin-top: 0 !important;
    }
    .mb-0 {
        margin-bottom: 0 !important;
    }
    .pt-0 {
        padding-top: 0 !important;
    }
    .pb-0 {
        padding-bottom: 0 !important;
    }

    .p-sm {
        padding: 8px !important;
    }

    .pt-sm {
        padding-top: 8px !important;
    }

    .px-sm {
        padding-right: 8px !important;
    }

    .px-sm {
        padding-left: 8px !important;
    }

    .pt-md {
        padding-top: 16px !important;
    }

    .pt-lg {
        padding-top: 24px !important;
    }

    .pb-md {
        padding-bottom: 16px !important;
    }

    .py-lg {
        padding-top: 24px !important;
    }

    .px-lg {
        padding-right: 24px !important;
    }

    .py-lg {
        padding-bottom: 24px !important;
    }

    .pb-lg {
        padding-bottom: 24px !important;
    }

    .px-lg {
        padding-left: 24px !important;
    }

    .py-xl {
        padding-top: 48px !important;
    }

    .pt-xl {
        padding-top: 48px !important;
    }
    .pb-xl {
        padding-bottom: 48px !important;
    }

    .py-xl {
        padding-bottom: 48px !important;
    }

    .address {
        margin-bottom: 1rem;
        font-style: normal;
        line-height: inherit;
        font-size: 14px;
        color: darkgray;
    }

    .markdown table thead th,
    .table thead th {
        background: rgba(48, 54, 69, 0.032);
        border-width: 1px;
        font-size: 0.7333333em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #7b7e88;
        vertical-align: bottom;
        border-bottom-color: rgba(123, 126, 136, 0.24);
        padding: 0.5rem;
        border-bottom: 1px solid rgba(123, 126, 136, 0.24);
    }.fs-7 {
        font-size: 7pt;
    }
    .fs-8 {
        font-size: 8pt;
    }.fs-9 {
        font-size: 9pt;
    } 
    .fs-10 {
        font-size: 10pt;
    } .fs-11 {
        font-size: 11pt;
    } .fs-12 {
        font-size: 12pt;
    }

    .markdown table td,
    .markdown table th,
    .table td,
    .table th {
        padding: 0.5rem;
        border-bottom: 1px solid rgba(123, 126, 136, 0.24);
    }

    .checkKutu {
        width: 16px;border: 2px solid darkgray;height: 16px;border-radius: 3px;display: inline-block;vertical-align: middle;margin-right: 5px;
    }
    .veliAyrac {
        border-top: 2px solid #000;
    }
`;

export class PlayerForm extends Component {
    render() {
        return (
            <body className="A4">
                <style>{styling}</style>
                <section className="sheet padding-10mm-15mm">
                    <table>
                        <tr>
                            <td valign="middle" align="center" colspan="3">
                                <img
                                    height="75"
                                    src="https://www.fenerbahce.org/FB/media/FB/Images/Clubs/CorporateIdentity/mobile-emblem-info.png"
                                    alt=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="fs-10 pt-sm">
                                <strong>2020-2021 {"{Halkalı Beşiktaş Futbol Okulu}"} Öğrenci Bilgi Formu</strong>
                            </td>
                            <td className="fs-9 pt-sm" align="right">
                                {"{Kardelen YILDIRIM}"} <strong className="fs-10">{"{0507 878 19 02}"}</strong>
                            </td>
                        </tr>
                    </table>

                    <table border="1" cellpadding="2" className="fs-9" style={{ marginTop: "5px" }}>
                        <tr>
                            <th align="center" rowspan="2" className="fs-10">
                                Öğrenci Bilgi Formu
                            </th>
                            <th align="right">Okula Başlama Tarihi</th>
                            <td width="235"></td>
                        </tr>
                        <tr>
                            <th align="right">Bugünün Tarihi</th>
                            <td width="235"></td>
                        </tr>
                        <tr>
                            <th colspan="3" className="fs-10">
                                Öğrencinin Genel Bilgileri
                            </th>
                        </tr>
                        <tr>
                            <th align="right">Adı ve Soyadı *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">T.C. Kimlik Numarası *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Aidat *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Cinsiyet</th>
                            <td align="center">
                                <span className="checkKutu"></span>
                                <strong>Kız</strong>
                            </td>
                            <td align="center">
                                <span className="checkKutu"></span>
                                <strong>Erkek</strong>
                            </td>
                        </tr>
                        <tr>
                            <th align="right">Doğum Tarihi (Gün/Ay/Yıl) *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Telefon Numarası</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Email</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th valign="top" align="right" height="60">
                                Adres *
                            </th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Kan Grubu</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Boy ve Kilo</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Kullandığı Ayak</th>
                            <td align="center">
                                <span className="checkKutu"></span>
                                <strong>Sağ</strong>
                            </td>
                            <td align="center">
                                <span className="checkKutu"></span>
                                <strong>Sol</strong>
                            </td>
                        </tr>
                        <tr>
                            <th align="right">Ayak Numarası</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Giydiği Beden (XS, S, M, L, XL)</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="center" colspan="3" className="fs-10">
                                Veli Bilgileri
                            </th>
                        </tr>
                        <tr>
                            <th align="right">Yakınlık (Anne, Baba, Diğer) *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Adı ve Soyadı *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Telefon Numarası *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Email</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr className="veliAyrac">
                            <th align="right">Yakınlık (Anne, Baba, Diğer) *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Adı ve Soyadı *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Telefon Numarası *</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <th align="right">Email</th>
                            <td colspan="2"></td>
                        </tr>
                        <tr>
                            <td
                                align="right"
                                style={{ borderRight: 0, borderRightColor: "#fff", borderRightStyle: "solid" }}>
                                <div className="checKutu"></div>
                            </td>
                            <td
                                align="left"
                                className="fs-9"
                                style={{ lineHeight: 1.4, borderLeftColor: "#fff" }}
                                colspan="2">
                                Yukarıdaki bilgiler dahilinde gerektiğinde veliyle ve öğrenciyle iletişime
                                <br />
                                geçilmesini kabul ediyor ve onaylıyorum.
                            </td>
                        </tr>
                        <tr>
                            <th valign="top" align="right" height="75">
                                Adı Soyadı
                                <br />
                                İmza
                            </th>
                            <td align="left" colspan="2"></td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td align="center">
                                <div className="fs-8" style={{ fontWeight: 600 }}>
                                    (*) Zorunlu Alanlar
                                </div>
                                <div
                                    className="fs-7"
                                    style={{ borderTop: 1, borderTopColor: "#fff", borderTopStyle: "lightgray" }}>
                                    <i>
                                        Bu form <strong>Scoutive</strong> tarafından otomatik oluşturulmuştur.
                                    </i>
                                </div>
                            </td>
                        </tr>
                    </table>
                </section>
            </body>
        );
    }
}

export default PlayerForm;
