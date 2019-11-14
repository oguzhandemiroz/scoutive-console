import React, { Component } from "react";

export class Maintenance extends Component {
    render() {
        return (
            <div class="container">
                <h1>
                    <i className="fa fa-server"></i>
                </h1>
                <p>
                    <strong>Bakımdayız!</strong>
                </p>

                <p>
                    Köklü bir değişiklik ile geliyoruz. <br />
                    Bu süreç içerisinde sizlere hizmet veremeyeceğimiz için üzgünüz. <br />
                    Sabrınız için teşekkürler...
                </p>

                <div id="suggestions">
                    <a href="mailto:destek@scoutive.net">destek@scoutive.net</a> —
                    <a href="tel:+908508001234">0850 800 1234</a>
                </div>
            </div>
        );
    }
}

export default Maintenance;
