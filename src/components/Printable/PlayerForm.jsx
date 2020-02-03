import React, { Component } from "react";
import moment from "moment";
/* import "../../assets/css/paper.css";
import "../../assets/css/normalize.css"; */

const normalize = `/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */
html {
    line-height: 1.15;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}
body {
    margin: 0;
}
article,
aside,
footer,
header,
nav,
section {
    display: block;
}
h1 {
    font-size: 2em;
    margin: 0.67em 0;
}
figcaption,
figure,
main {
    display: block;
}
figure {
    margin: 1em 40px;
}
hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
}
pre {
    font-family: monospace, monospace;
    font-size: 1em;
}
a {
    background-color: transparent;
    -webkit-text-decoration-skip: objects;
}
abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
}
b,
strong {
    font-weight: inherit;
}
b,
strong {
    font-weight: bolder;
}
code,
kbd,
samp {
    font-family: monospace, monospace;
    font-size: 1em;
}
dfn {
    font-style: italic;
}
mark {
    background-color: #ff0;
    color: #000;
}
small {
    font-size: 80%;
}
sub,
sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
}
sub {
    bottom: -0.25em;
}
sup {
    top: -0.5em;
}
audio,
video {
    display: inline-block;
}
audio:not([controls]) {
    display: none;
    height: 0;
}
img {
    border-style: none;
}
svg:not(:root) {
    overflow: hidden;
}
button,
input,
optgroup,
select,
textarea {
    font-family: sans-serif;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
}
button,
input {
    overflow: visible;
}
button,
select {
    text-transform: none;
}
[type="reset"],
[type="submit"],
button,
html [type="button"] {
    -webkit-appearance: button;
}
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner,
button::-moz-focus-inner {
    border-style: none;
    padding: 0;
}
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring,
button:-moz-focusring {
    outline: 1px dotted ButtonText;
}
fieldset {
    padding: 0.35em 0.75em 0.625em;
}
legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
}
progress {
    display: inline-block;
    vertical-align: baseline;
}
textarea {
    overflow: auto;
}
[type="checkbox"],
[type="radio"] {
    box-sizing: border-box;
    padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
    height: auto;
}
[type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
}
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
}
::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
}
details,
menu {
    display: block;
}
summary {
    display: list-item;
}
canvas {
    display: inline-block;
}
template {
    display: none;
}
[hidden] {
    display: none;
} /*# sourceMappingURL=normalize.min.css.map */
`;

const papercss = `
@page {
    margin: 0;
}
body {
    margin: 0;
}
.sheet {
    margin: 0;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
}

/** Paper sizes **/
article.A3 .sheet {
    width: 297mm;
    height: 419mm;
}
article.A3.landscape .sheet {
    width: 420mm;
    height: 296mm;
}
article.A4 .sheet {
    width: 210mm;
    height: 296mm;
}
article.A4.landscape .sheet {
    width: 297mm;
    height: 209mm;
}
article.A5 .sheet {
    width: 148mm;
    height: 209mm;
}
article.A5.landscape .sheet {
    width: 210mm;
    height: 147mm;
}
article.letter .sheet {
    width: 216mm;
    height: 279mm;
}
article.letter.landscape .sheet {
    width: 280mm;
    height: 215mm;
}
article.legal .sheet {
    width: 216mm;
    height: 356mm;
}
article.legal.landscape .sheet {
    width: 357mm;
    height: 215mm;
}

/** Padding area **/
.sheet.padding-10mm {
    padding: 10mm;
}
.sheet.padding-15mm {
    padding: 15mm;
}
.sheet.padding-20mm {
    padding: 20mm;
}
.sheet.padding-25mm {
    padding: 25mm;
}
.sheet.padding-10mm-15mm {
    padding: 10mm 15mm;
}

/** For screen preview **/
@media screen {
    body {
        background: #e0e0e0;
    }
    .sheet {
        background: white;
        box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
        margin: 5mm auto;
    }
}

/** Fix for Chrome issue #273306 **/
@media print {
    article.A3.landscape {
        width: 420mm !important;
    }
    article.A3,
    article.A4.landscape {
        width: 297mm !important;
    }
    article.A4,
    article.A5.landscape {
        width: 210mm !important;
    }
    article.A5 {
        width: 148mm !important;
    }
    article.letter,
    article.legal {
        width: 216mm !important;
    }
    article.letter.landscape {
        width: 280mm !important;
    }
    article.legal.landscape {
        width: 357mm !important;
    }
    article {
        margin-top: -1.5rem !important;
    }
    @page {
        size: A4 !important;
    }
    
}
`;

const styling = `
@page {
    size: A4 !important;
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
        width: 18px;border: 2px solid darkgray;height: 18px;border-radius: 3px;display: inline-block;vertical-align: middle;margin-right: 5px;
    }
    .veliAyrac {
        border-top: 2px solid #000;
    }
`;

export class PlayerForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sname: localStorage.getItem("sName"),
            simage: localStorage.getItem("sImage")
        };
    }

    render() {
        const { sname, simage } = this.state;
        const { name, phone, fee } = this.props.match.params;
        return (
            <article className="A4">
                <style>{papercss}</style>
                <style>{normalize}</style>
                <style>{styling}</style>
                <section className="sheet padding-10mm-15mm">
                    <table>
                        <tbody>
                            <tr>
                                <td className="vertical-middle text-center" colSpan="3">
                                    <img className="avatar avatar-xxl" height="75" src={simage} alt="" />
                                </td>
                            </tr>
                            <tr>
                                <td className="fs-10 pt-sm">
                                    <strong>
                                        {moment().format("YYYY")}-
                                        {moment()
                                            .add(1, "years")
                                            .format("YYYY")}{" "}
                                        {sname} Öğrenci Bilgi Formu
                                    </strong>
                                </td>
                                <td className="fs-9 pt-sm text-right text-uppercase">
                                    {name} <strong className="fs-10">{phone}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table border="1" cellPadding="2" className="fs-9" style={{ marginTop: "5px" }}>
                        <tbody>
                            <tr>
                                <th rowSpan="2" className="fs-10 text-center">
                                    Öğrenci Bilgi Formu
                                </th>
                                <th className="text-right">Okula Başlama (Aidat Ödeme) Tarihi</th>
                                <td width="165"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Bugünün Tarihi</th>
                                <td width="165"></td>
                            </tr>
                            <tr>
                                <th colSpan="3" className="fs-10 text-center">
                                    Öğrencinin Genel Bilgileri
                                </th>
                            </tr>
                            <tr>
                                <th className="text-right">Adı ve Soyadı *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">T.C. Kimlik Numarası *</th>
                                <td colSpan="2"></td>
                            </tr>
                            {fee === "1" ? (
                                <tr>
                                    <th className="text-right">Aidat *</th>
                                    <td colSpan="2"></td>
                                </tr>
                            ) : null}
                            <tr>
                                <th className="text-right">Cinsiyet</th>
                                <td className="text-center">
                                    <span className="checkKutu"></span>
                                    <strong>Kız</strong>
                                </td>
                                <td className="text-center">
                                    <span className="checkKutu"></span>
                                    <strong>Erkek</strong>
                                </td>
                            </tr>
                            <tr>
                                <th className="text-right">Doğum Tarihi (Gün/Ay/Yıl) *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Telefon Numarası</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Email</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th valign="top" className="text-right" height="60">
                                    Adres *
                                </th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Kan Grubu</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Boy ve Kilo</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Kullandığı Ayak</th>
                                <td className="text-center">
                                    <span className="checkKutu"></span>
                                    <strong>Sağ</strong>
                                </td>
                                <td className="text-center">
                                    <span className="checkKutu"></span>
                                    <strong>Sol</strong>
                                </td>
                            </tr>
                            <tr>
                                <th className="text-right">Ayak Numarası</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Giydiği Beden (XS, S, M, L, XL)</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th colSpan="3" className="fs-10 text-center">
                                    Veli Bilgileri
                                </th>
                            </tr>
                            <tr>
                                <th className="text-right">Yakınlık (Anne, Baba, Diğer) *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Adı ve Soyadı *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Telefon Numarası *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Email</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr className="veliAyrac">
                                <th className="text-right">Yakınlık (Anne, Baba, Diğer) *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Adı ve Soyadı *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Telefon Numarası *</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <th className="text-right">Email</th>
                                <td colSpan="2"></td>
                            </tr>
                            <tr>
                                <td
                                    className="text-right"
                                    style={{ borderRight: 0, borderRightColor: "#fff", borderRightStyle: "solid" }}>
                                    <div className="checkKutu"></div>
                                </td>
                                <td
                                    className="fs-9 text-left"
                                    style={{ lineHeight: 1.4, borderLeftColor: "#fff" }}
                                    colSpan="2">
                                    Yukarıdaki bilgiler dahilinde gerektiğinde veliyle ve öğrenciyle iletişime
                                    <br />
                                    geçilmesini kabul ediyor ve onaylıyorum.
                                </td>
                            </tr>
                            <tr>
                                <th valign="top" className="text-right" height="75">
                                    Adı Soyadı
                                    <br />
                                    İmza
                                </th>
                                <td className="text-left" colSpan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            <tr>
                                <td className="text-center">
                                    <div className="fs-8">(*) Zorunlu Alanlar</div>
                                    <div
                                        className="fs-7"
                                        style={{
                                            borderTopWidth: 1,
                                            borderTopColor: "lightgray",
                                            borderTopStyle: "solid"
                                        }}>
                                        <i>
                                            Bu form <strong>Scoutive</strong> tarafından otomatik oluşturulmuştur.
                                        </i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </article>
        );
    }
}

export default PlayerForm;
