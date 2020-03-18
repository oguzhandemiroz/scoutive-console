import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import logo_circle from "../../assets/images/logo-circle.png";
import terms from "../../assets/images/illustrations/terms.svg";

export class Terms extends Component {
    render() {
        return (
            <div className="page">
                <div className="page-single">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 mx-auto">
                                <div className="text-center my-5">
                                    <Link className="header-brand" to="#" tabIndex="-1">
                                        <img style={{ width: "200px" }} src={logo} alt="Scoutive" />
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
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.3.</strong>
                                                </div>
                                                <div className="col">
                                                    Ücretler, ödeme koşulları, ücretlerin yürürlük tarihleri Site’de
                                                    veya Platform’un ilgili bölümlerinde ilan edilecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.4.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, isteğine bağlı olarak üyelik paketini
                                                    yükseltebilecek veya düşürebilecektir. Buna ilişkin talepler, Şirket
                                                    tarafından aksi belirtilmedikçe ilgili üyelik döneminin sonunda
                                                    gerçekleşecektir. Yapılan değişiklikler üyelik döneminin sona
                                                    ermesine dek uygulanmayacak, yeni ücretler ve ödeme koşulları yeni
                                                    üyelik döneminin başlamasıyla geçerli olacaktır. 5.5. Ücretsiz
                                                    deneme süresinin sona ermesinden sonra <strong>Kullanıcı</strong>
                                                    ’nın üyeliğinin hizmet seviyesi ve türü, işlevsellik, kampanyalar ya
                                                    da sözleşme süresine göre belirlenecek ücretli üyelik haline
                                                    gelecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.5.</strong>
                                                </div>
                                                <div className="col">
                                                    Ücretsiz deneme süresinin sona ermesinden sonra
                                                    <strong> Kullanıcı</strong>’nın üyeliğinin hizmet seviyesi ve türü,
                                                    işlevsellik, kampanyalar ya da sözleşme süresine göre belirlenecek
                                                    ücretli üyelik haline gelecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.6.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong> eksiksiz ve doğru faturalandırma ve
                                                    iletişim bilgileri temin etmekle ve söz konusu bilgilerdeki herhangi
                                                    bir değişikliği bildirmekle yükümlüdür. <strong>SCOUTIVE</strong>,
                                                    ödemeye ilişkin işlemler veya banka entegrasyonu ve ilgili
                                                    güncellemeleri gerçekleştirmek için <strong>Kullanıcı</strong>’nın
                                                    kredi kartı ve ödeme bilgilerini saklayabilecektir.
                                                    <strong> SCOUTIVE</strong> tarafından düzenlenecek faturalar üyelik
                                                    dönemine ilişkin ücretleri içerecektir. İlgili ücretlere ilişkin
                                                    vergi ve harçların ödenmesinden <strong>Kullanıcı </strong>
                                                    sorumludur. Yabancı para birimi üzerinden yapılan anlaşmalarda,
                                                    faturanın tanzim tarihindeki Merkez Bankası döviz alış kuru
                                                    üzerinden TL olarak düzenlenir. Hizmet bedeli
                                                    <strong> Kullanıcı</strong> tarafından faturanın kendisine
                                                    tebliğinden itibaren 30 (otuz) gün içinde <strong>SCOUTIVE</strong>
                                                    ’in Garanti Bankası Ortaköy Şubesinde (135) bulunan 6295542 nolu
                                                    hesabına (TR43 0006 2000 1350 0006 2955 42) yatırılacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>5.7.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>'nın işbu sözleşme kapsamında aldığı
                                                    hizmetin bedellerini zamanında ödememesi halinde SCOUTIVE’in ödeme
                                                    yapılana kadar hizmeti dondurma veya tamamen durdurma ve sözleşmeyi
                                                    tek taraflı derhal fesih hakları saklıdır. Böyle bir durumda
                                                    <strong> Kullanıcı</strong> herhangi bir hak öne süremeyeceğini
                                                    kabul ve beyan eder. <strong>SCOUTIVE</strong>’in işbu maddeye
                                                    dayanarak Sözleşmeyi haklı nedenle feshetmesi halinde,
                                                    <strong> Kullanıcı</strong> işbu Sözleşme’nin 6.6 maddesinde
                                                    belirtilen yükümlülüklerini yerine getirecektir.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 5 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 6 ### --> */}
                                            <div className="hr-text">Madde 6</div>
                                            <h3 className="mt-0">Sözleşmenin Süresi ve Fesih</h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.1.</strong>
                                                </div>
                                                <div className="col">
                                                    İşbu sözleşme elektronik ortamda kabul edildiği tarih itibarıyla
                                                    başlamaktadır ve işbu Sözleşme’ye uygun olarak satın alınan veya
                                                    deneme süresi ile <strong>SCOUTIVE</strong> tarafından bedelsiz
                                                    şekilde sağlanan tüm <strong>Kullanıcı</strong> abonelikleri bitene
                                                    kadar veya sonlandırılana kadar veya <strong>Kullanıcı</strong>’nın
                                                    hesabı kapatılana kadar devam edecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.2.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Ek-1</strong> de belirtilen ek hizmetlerin aşılması
                                                    durumunda deneme sürümünde olsa dahi hizmet kullanım bedeli
                                                    uygulanacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.3.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflardan biri işbu sözleşmeyi, sözleşmenin süresi dolmadan en az
                                                    1 (hafta) gün öncesinden feshettiğini yazılı olarak bildirimle işbu
                                                    Sözleşme’yi dilediği zaman herhangi bir gerekçe göstermeksizin ve
                                                    tazminat ödemeksizin feshedebilir. <strong>Kullanıcı </strong>
                                                    hesabının 6 ay boyunca pasif olması halinde,
                                                    <strong> SCOUTIVE</strong> işbu Sözleşme’yi tek taraflı olarak
                                                    feshedebilecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.4.</strong>
                                                </div>
                                                <div className="col">
                                                    İşbu Sözleşme’nin haklı gerekçe ile <strong>Kullanıcı </strong>
                                                    tarafından feshedilmesi halinde, fesih tarihine kadar olan hak ve
                                                    yükümlülükler ortadan kalkmaz, bu nedenle Sözleşme’nin fesih
                                                    tarihine kadar doğmuş olan tüm ücret ve masraflardan
                                                    <strong> Kullanıcı</strong> sorumludur. Sözleşme’nin
                                                    <strong> SCOUTIVE</strong> tarafından haklı gerekçe ile feshedilmesi
                                                    durumunda ise ilgili fesih tarihinden sonra, tüm ilgili aboneliğin
                                                    geri kalan süresini kapsayan herhangi bir ödenmemiş tutar
                                                    <strong> SCOUTIVE</strong>’e ödenmelidir. Hiçbir durumda herhangi
                                                    bir fesih, fesih tarihinden önceki dönem için
                                                    <strong> SCOUTIVE</strong>‘e ödenmesi gereken herhangi bir tutarı ve
                                                    ücreti ödeme yükümlülüğünü ortadan kaldırmayacaktır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.5.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflardan herhangi birinin, işbu sözleşme hükümlerini ihlal etmesi
                                                    halinde, ihlalin niteliğine göre hakları ihlal edilen Taraf ihlalin
                                                    sona erdirilmesini yazılı olarak bildirerek ihlalin giderilmesi için
                                                    3 günü aşmayacak bir süre verecektir. Bu süre içerisinde ihlal
                                                    giderilmezse, hakları ihlal edilen Taraf yazılı bildirim yapmak
                                                    kaydıyla işbu Sözleşmeyi feshedebilir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>6.6.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, işbu Sözleşme’de belirtilen hizmet
                                                    bedellerinin, madde 6.1’de yer alan hizmet süresi boyunca,
                                                    Sözleşmeye bağlı kalacağı taahhüdüne karşılık olarak belirlendiğinin
                                                    bilincinde olduğunu beyan eder. Bu nedenle, işbu sözleşmenin
                                                    <strong> Kullanıcı</strong> tarafından Madde 6’da belirtilen
                                                    sürelere uyulmaksızın feshedilmesi halinde,
                                                    <strong> Kullanıcı </strong> taahhüt ettiği ancak ücretlendirilmesi
                                                    gerçekleşmeyen kalan hizmet bedelinden veya sözleşme süresince
                                                    yararlandığı indirim bedelinden hangisi daha düşük ise bu bedeli
                                                    herhangi bir ihtara gerek olmaksızın <strong>SCOUTIVE </strong>
                                                    tarafından düzenlenecek hizmet faturası karşılığında ilk talepte ve
                                                    nakden <strong>SCOUTIVE</strong>’e ödeyeceğini gayri kabili rücu
                                                    olarak kabul, beyan ve taahhüt eder.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 6 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 7 ### --> */}
                                            <div className="hr-text">Madde 7</div>
                                            <h3 className="mt-0">
                                                Kişisel Verilerin Korunması, Sır Saklama ve Gizlilik Hükümleri
                                            </h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.1.</strong>
                                                </div>
                                                <div className="col">
                                                    İşbu sözleşme kapsamında <strong>Kullanıcı</strong> tarafından
                                                    <strong> SCOUTIVE</strong>’a yazılı olarak veya elektronik ortamda
                                                    teslim edilen her türlü veritabanı bilgileri ile
                                                    <strong> SCOUTIVE</strong> tarafından <strong>Kullanıcı</strong>'ya
                                                    sözlü, yazılı veya elektronik olarak teslim edilen uygulama,
                                                    yazılım, kod, program, eğitim, doküman, bilgi ve materyaller gizli
                                                    bilgi ve ifşa yasağı kapsamındadır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.2.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflar, gizli bilgiyi yalnızca veriliş amacına uygun ve bu amaçla
                                                    sınırlı olarak kullanacak ve ilgili tarafın yazılı izni olmaksızın
                                                    gizli bilgileri hiçbir gerekçe ile kısmen veya tamamen gerçek veya
                                                    tüzel üçüncü şahısların bilgisine sunmayacak veya herhangi bir
                                                    şekilde ifşa etmeyecektir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.3.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflar, gizli bilgiyi ancak zorunlu hallerde ve iş gereği bu gizli
                                                    bilgiyi öğrenmesi gereken personeline ve işbu sözleşme kapsamında
                                                    işbirliği yapılan üçüncü kişilere verebilecek ancak bu bilginin
                                                    gizli olduğu konusunda personelini ve üçüncü kişileri uyaracak ve
                                                    gizli bilginin korunması için gerekli her türlü önlemi alacaklardır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.4.</strong>
                                                </div>
                                                <div className="col">
                                                    Gizli bilginin tarafların bir kusuru olmaksızın kamuya mal olması,
                                                    gizli bilginin tarafların dışında bir kaynak tarafından kamuya ifşa
                                                    edilmesi, gizli bilginin yürürlükte olan mevzuat veya verilmiş
                                                    mahkeme kararı ya da idari emir gereğince açıklanmasının kanunen
                                                    zorunlu olması ve gizli bilginin zaten önceden kamuya ifşa olması
                                                    halleri gizli bilgi ve ifşa yasağı kapsamı dışındadır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.5.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, Veri Sorumlusu sıfatı ile 6698 sayılı
                                                    Kanun kapsamında öngörülmüş her türlü yükümlülüğü eksiksiz yerine
                                                    getireceğini kabul, beyan ve taahhüt eder.
                                                    <strong> Kullanıcı</strong>, elde etmiş olduğu ve Sözleşme
                                                    kapsamında paylaşacağı kişisel verilerin 3. Kişilere aktarılması ve
                                                    işlenmesi için gerekli izinlerin veri sahiplerinden 6698 sayılı
                                                    Kanun’a uygun olarak alındığını kabul beyan ve taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.6.</strong>
                                                </div>
                                                <div className="col">
                                                    Sözleşmede yer alan hizmetlerin ifası sırasında
                                                    <strong> SCOUTIVE</strong>’in “Veri İşleyen” sıfatını haiz olması
                                                    koşulu ile <strong>SCOUTIVE</strong>, 6698 sayılı Kanun’da Veri
                                                    İşleyen tanımı kapsamında yüklenen tüm sorumluluk ve yükümlülükleri
                                                    yerine getirmeyi kabul etmektedir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.7.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>SCOUTIVE</strong>, 6698 sayılı Kanun ‘da tanımlı olduğu
                                                    şekilde kendi kusuru nedeniyle kişisel verilerin amacı dışında
                                                    kullanılması veya yine kusuru dahilinde 3. kişilere kanunsuz olarak
                                                    ifşa edilmiş olması halleri dışında doğrudan veya dolaylı hiçbir
                                                    zararın muhatabı değildir.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.8.</strong>
                                                </div>
                                                <div className="col">
                                                    Herhangi bir resmi kurumun <strong>SCOUTIVE</strong>’e işbu Sözleşme
                                                    kapsamında sahip olduğu kişisel verilerin hukuka aykırı olarak elde
                                                    edilmesi veya hukuka uygun olarak muhafazasının sağlanmaması gibi
                                                    6698 Sayılı Kanun kapsamında Veri Sorumlusu’na ilişkin
                                                    yükümlülüklerin ihlalinden kaynaklı olarak idari para cezası
                                                    öngörmesi halinde <strong>Kullanıcı</strong>, işbu idari para cezası
                                                    bedelini <strong>SCOUTIVE</strong>’e ilk talepte nakden ödeyeceğini
                                                    kabul beyan ve taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>7.9.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>SCOUTIVE</strong>, herhangi bir resmi kurumdan madde 7.8.
                                                    kapsamında gelecek bildirim neticesinde tüm tazminat talebi hakları
                                                    saklı kalmak kaydıyla Sözleşmeyi derhal feshetmeye yetkilidir.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 7 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 8 ### --> */}
                                            <div className="hr-text">Madde 8</div>
                                            <h3 className="mt-0">Lisans ve Telif Hakları</h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>8.1.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, Scoutive Servisinde kullanılan ve tüm
                                                    hakları münhasıran <strong>SCOUTIVE</strong>’e ait olan web
                                                    sitesini, yazılımları, programları, sistem mimarisini ve sistem
                                                    kodlarını sadece işbu sözleşme süresince ve sözleşme hükümlerine
                                                    uygun olarak kullanacağını, yazılımlara ait kaynak kodlarını, ara
                                                    yüzleri, sistem mimarisini ve sistem kodlarını tamamen veya kısmen,
                                                    doğrudan veya dolaylı olarak herhangi bir şekilde kopyalamayacağını,
                                                    çoğaltmayacağını, satmayacağını, ücretli veya ücretsiz olarak
                                                    devretmeyeceğini, değiştirmeyeceğini, yaymayacağını, umuma
                                                    sunmayacağını, herhangi bir şekilde üçüncü şahısların kullanımına
                                                    açmayacağını, içeriğinde değişiklik yapmayacağını, kaynak kodu
                                                    dönüştürme veya ters mühendislik işlemleri uygulamayacağını ve işbu
                                                    sözleşme kapsamı dışında kullanmayacağını, işbu madde hükmüne aykırı
                                                    hareket etmesi <strong>SCOUTIVE</strong>’in uğrayacağı tüm zararları
                                                    karşılayacağını kabul ve taahhüt eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>8.2.</strong>
                                                </div>
                                                <div className="col">
                                                    <strong>Kullanıcı</strong>, Scoutive Servisine ilişkin teknik ve
                                                    ticari fikirleri hukuka aykırı olarak kullanmayacağını, üçüncü
                                                    kişilerle paylaşılmayacağını, haksız rekabet teşkil edecek şekilde
                                                    kopyalamayacağını ve benzer ürünler üretmeyeceğini kabul ve taahhüt
                                                    eder.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>8.3.</strong>
                                                </div>
                                                <div className="col">
                                                    İşbu sözleşmenin feshedilme veya sona erme tarihinden itibaren
                                                    geçerli olmak üzere, sözleşmenin diğer hükümlerine bakılmaksızın,
                                                    <strong>Kullanıcı</strong> artık Yazılımın herhangi bir bölümünü
                                                    kullanma hakkına sahip olmayacaktır.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 8 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### MADDE 9 ### --> */}
                                            <div className="hr-text">Madde 9</div>
                                            <h3 className="mt-0">Mücbir Sebepler</h3>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>9.1.</strong>
                                                </div>
                                                <div className="col">
                                                    Taraflar, deprem, sel, yangın, doğal afet, savaş, seferberlik,
                                                    sıkıyönetim, grev, lokavt, isyan, ayaklanma, terör ve benzeri mücbir
                                                    sebeplerin ortaya çıkması nedeniyle işbu sözleşme kapsamındaki
                                                    yükümlülüklerini yerine getirememeleri halinde sorumlu
                                                    olmayacaklardır.
                                                </div>
                                            </div>
                                            <div className="row gutters-xs mb-2">
                                                <div className="col-auto">
                                                    <strong>9.2.</strong>
                                                </div>
                                                <div className="col">
                                                    Mücbir sebep durumunun 30 (otuz) günden fazla devam etmesi halinde
                                                    taraflar bir araya gelerek, işbu sözleşmenin devamını, askıya
                                                    alınmasını veya feshedilmesini müzakere edeceklerdir. Fesih halinde
                                                    taraflar, mücbir sebepler nedeniyle işbu sözleşmenin uygulanamamış
                                                    hükümleri nedeniyle birbirlerinden herhangi bir talepte
                                                    bulunmayacaktır.
                                                </div>
                                            </div>
                                            {/* <!-- ### MADDE 9 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### EK-1 ### --> */}
                                            <div className="hr-text">Ek</div>
                                            <h3 className="mt-0">Ek-1</h3>
                                            <strong>Gönderim Hacmi Kullanım Ücreti</strong>
                                            <p>
                                                <strong>Kullanıcı</strong>’nın aylık olarak 250 adet SMS gönderim hakkı
                                                bulunmaktadır. 250 adet SMS’in aşılması durumunda gönderilecek SMS’ler
                                                Ek Hizmetlerimiz kapsamında değerlendirilecektir.
                                            </p>
                                            <strong>İsteğe Bağlı Ek Hizmetler</strong>
                                            <p>
                                                <strong>SCOUTIVE</strong> talebinize göre teklifte belirtilen hizmet
                                                bedelinden ayrı olarak aşağıda detayları belirtilen alanlarda hizmet
                                                verebilir.
                                            </p>
                                            {/* <!-- ### EK-1 ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### Ek Paketler (SMS) ### --> */}
                                            <div className="hr-text">Ek Paketler</div>
                                            <h3 className="mt-0">Ek Paketler (SMS)</h3>
                                            <table className="table text-dark table-vcenter">
                                                <thead>
                                                    <tr>
                                                        <td align="center" className="font-weight-600" colSpan="4">
                                                            SMS BAKİYE AŞIM DURUMUNDA
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>PAKET</th>
                                                        <th>PAKET ADETİ</th>
                                                        <th>PAKET TUTARI (+KDV)</th>
                                                        <th>PAKET TUTARI (KDV DAHİL)</th>
                                                    </tr>
                                                    <tr>
                                                        <td>100'lük Paket</td>
                                                        <td>
                                                            <strong>100</strong> Adet
                                                        </td>
                                                        <td className="font-weight-600">10 TL+KDV</td>
                                                        <td className="font-weight-600">11,80 TL</td>
                                                    </tr>
                                                    <tr>
                                                        <td>250'lik Paket</td>
                                                        <td>
                                                            <strong>250</strong> Adet
                                                        </td>
                                                        <td className="font-weight-600">20 TL+KDV</td>
                                                        <td className="font-weight-600">23,60 TL</td>
                                                    </tr>
                                                    <tr>
                                                        <td>500'lük Paket</td>
                                                        <td>
                                                            <strong>500</strong> Adet
                                                        </td>
                                                        <td className="font-weight-600">35 TL+KDV</td>
                                                        <td className="font-weight-600">41,30 TL</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {/* <!-- ### Ek Paketler (SMS) ### --> */}

                                            <div className="w-100 h-2"></div>

                                            {/* <!-- ### Teşekkürler ### --> */}
                                            <div className="hr-text hr-text-center">Teşekkürler</div>

                                            <div className="row leading-normal mt-5">
                                                <div className="col-12 text-center mb-2">
                                                    <div
                                                        className="avatar avatar-md avatar-transparent"
                                                        style={{ backgroundImage: `url(${logo_circle})` }}></div>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <h4 className="text-body mb-0">Scoutive</h4>
                                                    <a
                                                        className="small text-muted d-block"
                                                        href="mailto:info@scoutive.net">
                                                        info@scoutive.net
                                                    </a>
                                                    <a className="small text-muted d-block" href="tel:08508001234">
                                                        0850 800 1234
                                                    </a>
                                                </div>
                                            </div>
                                            {/* <!-- ### Teşekkürler ### --> */}
                                        </div>
                                    </div>
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
