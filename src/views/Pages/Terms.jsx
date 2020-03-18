import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import terms from "../../assets/images/illustrations/terms.svg";

export class Terms extends Component {
    render() {
        return (
            <div className="page">
                <div className="page-single">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 mx-auto">
                                <div className="text-center mb-4">
                                    <Link className="header-brand" to="#" tabIndex="-1">
                                        <img id="ScoutiveLogo" src={logo} alt="Scoutive" />
                                    </Link>
                                </div>

                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 text-center p-6">
                                                <img src={terms} alt="Üyelik Sözleşmesi" style={{ width: "215px" }} />
                                            </div>
                                        </div>
                                        <div className="text-wrap text-justify py-6 px-0 px-md-5 px-lg-6">
                                            <div className="text-center display-4 mb-6">ÜYELİK SÖZLEŞMESİ</div>

                                            {/* <!-- ### MADDE 1 ### --> */}
                                            <div className="hr-text">Madde 1</div>
                                            <h3 className="mt-0">Taraflar</h3>
                                            <p>
                                                İş bu Kullanıcı Sözleşmesi <strong>(“Sözleşme”)</strong>, Nispetiye
                                                Mahallesi Gazi Güçnar Sokak Uygur İş Merkezi No: 4 İç Kapı No: 2
                                                Beşiktaş/İstanbul adresinde mukim OĞUZHAN DEMİRÖZ
                                                <strong> (“SCOUTIVE”)</strong> ile www.scoutive.app adresinde yer alan
                                                siteye <strong>(“Site”)</strong> kullanıcı olarak kaydolan kişi
                                                <strong> (“Kullanıcı”)</strong> arasında aşağıda belirtilen hüküm ve
                                                şartlar çerçevesinde elektronik ortamda imzalanmıştır. Sözleşme’de
                                                belirtilen usuller doğrultusunda sona erdirilmediği sürece yürürlükte
                                                kalmaya devam edecektir.
                                            </p>
                                            <p>
                                                <strong>SCOUTIVE</strong> ve <strong>Kullanıcı</strong> ayrı
                                                <strong> “Taraf”</strong> ve birlikte <strong>“Taraflar”</strong> olarak
                                                anılacaktır.
                                            </p>
                                            {/* <!-- ### MADDE 1 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 2 ### --> */}
                                            <div className="hr-text">Madde 2</div>
                                            <h3 className="mt-0">Tanımlar</h3>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>İlgili Kişi</strong>
                                                </div>
                                                <div className="col">
                                                    İşbu sözleşme hükümleri çerçevesinde, <strong>Kullanıcı</strong>'nın
                                                    <strong> SCOUTIVE</strong>
                                                    tarafından sunulan CRM sistemine bilgileri işlenen ve hizmet
                                                    kapsamında olması halinde e-posta ve SMS yoluyla bilgilendirme
                                                    yapacağı <strong>Kullanıcı</strong> ile bilgilerini rıza göstererek
                                                    paylaşmış ve bilgilerinin işlenmesine, aktarılmasına onay vermiş
                                                    kişileri,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Scoutive Servisi</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>SCOUTIVE</strong>’in sunduğu altyapı ve yazılım desteği ile
                                                    Kullanıcı'nın İlgili Kişilerin bilgilerini kaydedebildiği,
                                                    düzenleyebildiği, analiz edebildiği ve SMS ve e-posta gönderebildiği
                                                    bulut tabanlı yönetim sistemini,
                                                </div>
                                            </div>

                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Site</strong>
                                                </div>
                                                <div className="col">
                                                    www.scoutive.app alan adı üzerinden yayın yapan ve Scoutive
                                                    servisinin internet üzerinden kullanılmasına olanak sağlayan
                                                    <strong> SCOUTIVE</strong>’e ait web sitesini,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Ücretler</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>'nın işbu sözleşme hükümleri çerçevesinde
                                                    SCOUTIVE hizmet ve servisleri karşılığında ödeyeceği ücretleri,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Hizmet</strong>
                                                </div>
                                                <div className="col">
                                                    SCOUTIVE’in işbu sözleşme kapsamında <strong>Kullanıcı</strong>'ya
                                                    sağlayacağı hizmetleri,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Ek Protokol</strong>
                                                </div>
                                                <div className="col">
                                                    Ek hizmetlerin talep edilmesi halinde, talep edilen ek hizmetlerin
                                                    ayrıntılarını ve ücretlerini içeren protokolü,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>6698 Sayılı Kanun</strong>
                                                </div>
                                                <div className="col">
                                                    6698 Sayılı Kişisel Verilerin Korunması Kanunu’nu,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Kişisel Veri</strong>
                                                </div>
                                                <div className="col">
                                                    Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü
                                                    bilgiyi,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Veri sorumlusu</strong>
                                                </div>
                                                <div className="col">
                                                    Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri
                                                    kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan
                                                    gerçek veya tüzel kişiyi,
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-3">
                                                <div className="text-left text-md-right col-12 col-lg-2 col-md-2">
                                                    <strong>Veri işleyen</strong>
                                                </div>
                                                <div className="col">
                                                    6698 sayılı Kanun kapsamında Veri sorumlusunun verdiği yetkiye
                                                    dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel
                                                    kişiyi ifade eder.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 2 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 3 ### --> */}
                                            <div className="hr-text">Madde 3</div>
                                            <h3 className="mt-0">Sözleşmenin Konusu</h3>
                                            <p>
                                                İşbu sözleşmenin konusu <strong>Kullanıcı</strong>'nın veritabanını
                                                yönetimi amacı ile <strong>SCOUTIVE</strong>’in yazılım ve altyapı
                                                desteği ile bilgilendirme amaçlı SMS ve/veya e-posta hizmeti sunmasına
                                                ilişkin tarafların karşılıklı hak ve yükümlülüklerinin düzenlenmesidir.
                                            </p>
                                            {/* <!-- ### MADDE 3 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 4 ### --> */}
                                            <div className="hr-text">Madde 4</div>
                                            <h3 className="mt-0">Kullanım Koşulları</h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.1.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong> Scoutive Servisini kullanabilmek için
                                                    <a href="https://scoutive.app/auth/register" target="_blank">
                                                        https://scoutive.app/auth/register
                                                    </a>
                                                    linki üzerinden sayfada yer alan bilgileri doldurarak üye olacaktır.
                                                    Üyelik için siteye girilen gerekli hesap bilgilerinin güvenliği
                                                    tamamen <strong>Kullanıcı</strong>'nın sorumluluğunda olup, bu
                                                    bilgilerinin <strong>Kullanıcı</strong> tarafından gerektiği gibi
                                                    korunmaması sebebiyle üçüncü kişilerin eline geçmesi neticesinde
                                                    Sisteme yapılan yetkisiz girişlerden ve Scoutive Servisinin yetkisiz
                                                    kullanımından dolayı <strong>SCOUTIVE</strong>’in sorumluluğu
                                                    bulunmayacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.2.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>'ya tahsis edilen bu hesaba, İlgili Kişi
                                                    verileri münhasıran <strong>Kullanıcı</strong> tarafından yüklenir.
                                                    Kullanıcı, <strong>SCOUTIVE</strong>’in, <strong>Kullanıcı</strong>
                                                    'nın aldığı Scoutive hizmeti konusunda İlgili Kişi’den 6698 Sayılı
                                                    Kanun kapsamında Veri İşleyen sıfatını haiz olması nedeniyle
                                                    herhangi bir onay alamayacağını ve bu hususta bir talepte
                                                    bulunmayacağını kabul ve taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.3.</strong>
                                                </div>
                                                <div className="col">
                                                    Scoutive Sistemine yüklenen verilerin hukuka uygun ve İlgili
                                                    Kişi’nin bilgisi, eğer gerekliyse açık rızası ile elde edilmiş
                                                    olması münhasıran 6698 Sayılı Kanun kapsamında Veri Sorumlusu
                                                    sıfatını haiz <strong>Kullanıcı</strong>'nın sorumluluğundadır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.4.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, Scoutive Servisi ile yapacağı tüm
                                                    gönderimlerde, İlgili Kişi’nin gönderimi yapan gerçek veya tüzel
                                                    kişi olarak kendisini tanıyabileceği ölçüde tanıtıcı bilgiler
                                                    bulunduracağını, anonim veya göndericisi belli olmayan veya İlgili
                                                    Kişi tarafından anlaşılmayacak tarzda içerikler barındıran gönderim
                                                    yapmayacağını taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.5.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, İlgililere göndereceği e-posta/SMS
                                                    mesajların yalnızca bilgilendirme amaçlı olduğunu; reklam amaçlı
                                                    ticari içeriğe yer vermeyeceğini, yer alan içeriklerin hukuka, kamu
                                                    düzenine, genel ahlaka, rekabet kurallarına, üçüncü kişilere ait
                                                    fikri ve sınai hakları ihlal etmeyeceğini kabul ve taahhüt eder.
                                                    <strong> Kullanıcı</strong>, <strong>SCOUTIVE</strong>’in gönderilen
                                                    iletinin içeriğinin hukuka uygunluğunu denetlemekle yükümlü
                                                    olmadığını ve bu hususta doğabilecek her türlü zararın tazmininden
                                                    münhasıran sorumlu olduğunu peşinen kabul, beyan ve taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.6.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>SCOUTIVE</strong>, <strong>Kullanıcı</strong>'nın Scoutive
                                                    Servisini en iyi ve optimum düzeyde kullanması ve gönderimlerinin
                                                    herhangi bir aksaklık olmaksızın yapılması için gerekli teknik alt
                                                    yapıyı sağlayacaktır. <strong>SCOUTIVE</strong>, işbu sözleşmenin
                                                    konusunu oluşturan taahhütlerini, erişim sağlayıcılar, yer
                                                    sağlayıcılar veya telekomünikasyon altyapısında ya da GSM
                                                    operatörleri tarafında meydana gelebilecek teknik arızalar veya
                                                    <strong> SCOUTIVE</strong>’in kontrolü dışında ortaya çıkabilecek
                                                    internet altyapısında yaşanabilecek arızalar ya da idari veya adli
                                                    karar sonucu internet erişiminin tamamen veya kısmen engellenmesi ve
                                                    benzer teknik problemler ya da nedeniyle zamanında
                                                    gerçekleştirememesinden hiçbir surette sorumlu tutulamaz. Bununla
                                                    birlikte hizmetin aksamasına veya zamanında yerine getirilememesine
                                                    neden olan üçüncü kişiler kaynaklı teknik arızaların sona ermesinden
                                                    itibaren, eksik veya zamanında yapılamayan hizmet ve taahhütler
                                                    SCOUTIVE tarafından yerine getirilecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.7.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>SCOUTIVE</strong>, <strong>Kullanıcı</strong> tarafından
                                                    Scoutive Servisine yüklenen verilerin yedeğini haftalık olarak
                                                    yapacaktır. Bununla birlikte, <strong>SCOUTIVE</strong>’in kusuruna
                                                    dayanmayan bir sebeple, <strong>Kullanıcı</strong>'nın veya yetkili
                                                    personelinin hatasından veya üçüncü kişiler kaynaklı teknik bir
                                                    arızadan dolayı verilerin bozulması veya silinmesi durumunda, son
                                                    yedekleme tarihi ile veri kaybının gerçekleştiği tarih arasındaki
                                                    veri kaybından <strong>SCOUTIVE</strong> sorumlu değildir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.8.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>TARAFLAR</strong>, işbu Sözleşme çerçevesinde yapmış
                                                    oldukları işlemler ve sundukları hizmetler nedeniyle elde ettikleri
                                                    verilerin, ilgili mevzuat hükümleri saklı kalmak kaydıyla
                                                    muhafazasından ve hukuka aykırı olarak bunlara erişilmesini ve
                                                    işlenmesini önlemek amacıyla gerekli tedbirlerin alınmasından
                                                    sorumludur.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.9.</strong>
                                                </div>
                                                <div className="col">
                                                    Scoutive Servisinin yazılımında veya alt yapısında bulunan hatalar
                                                    veya aksaklıklar nedeniyle, gönderilemeyen bilgilendirme SMS ve
                                                    e-postalarından <strong>SCOUTIVE</strong> sorumlu olup, münhasıran
                                                    bu duruma ilişkin olarak hatalı, eksik veya yanlış gönderilen veya
                                                    hiç gönderilemeyen SMS ve e-postaların tekrar gönderilmesinden ek
                                                    bir ücret talep edilmeyecektir. Ayrıca <strong>SCOUTIVE </strong>
                                                    kendi kusuruyla sebep olduğu doğrudan zararlardan Kullanıcı
                                                    tarafından ispat edilmesi halinde sorumlu olacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.10.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong> işbu sözleşme konusu hizmetlerle alakalı
                                                    her türlü talep ve uyarılarını <strong>SCOUTIVE</strong>’e yazılı
                                                    olarak (faks veya e-posta) iletecektir. Yazılı olarak yapılmayan
                                                    uyarı ve talepler nedeniyle işbu sözleşme konusu hizmette meydana
                                                    gelebilecek aksaklıklardan ve gecikmelerden
                                                    <strong> SCOUTIVE </strong> sorumlu olmayacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>4.11.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflardan her biri, işbu madde hükümlerinde belirlenen
                                                    yükümlülüklerini veya taahhütlerini kendi kusurları ile ihlal etmesi
                                                    nedeniyle diğer tarafın uğradığı zararları tazmin edeceğini ve
                                                    eylemleri nedeniyle üçüncü kişilerin talebi üzerine veya resen
                                                    başlatılan hukuki, idari ve cezai süreçler sonucunda diğer tarafın
                                                    yaptırıma uğraması halinde, bunları kendisine rücu etme hakkının
                                                    saklı olduğunu kabul, taahhüt ve beyan ederler.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 4 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 5 ### --> */}
                                            <div className="hr-text">Madde 5</div>
                                            <h3 className="mt-0">Ücretlendirme ve Ödeme</h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.1.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong> geçerli olan kur üzerinden KDV ile
                                                    birlikte, işbu sözleşmeye uygun olarak ücretleri ödeyecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.2.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong> işbu Sözleşme kapsamındaki Site’de veya
                                                    Platform’da belirtilen tüm ücretleri belirtilen ödeme koşulları ve
                                                    araçları ile tam ve eksiksiz olarak ödemelidir. Site’de veya
                                                    Platform’da aksine belirtilen durumların haricinde ücretler, mevcut
                                                    kullanım oranlarına değil, alınan hizmetlere dayalıdırlar, ödeme
                                                    yükümlülükleri iptal edilemez ve üyelik dönemi boyunca Sözleşme’nin
                                                    feshi de dahil olmak üzere üyeliğin herhangi bir nedenle sona ermesi
                                                    halinde ödenen ücretler geri alınamaz. Yenilenecek dönemlerde sitede
                                                    ilan edilen güncel fiyatlar geçerli olacaktır.
                                                </div>
                                            </div>

                                            {/* <!-- ### MADDE 5 ### --> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center text-muted">
                                    <a href="#" onClick={() => this.props.history.goBack()}>
                                        Geriye dön
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Terms;
