# Mesajmatik — Ana Proje Şartnamesi

Bu dosya Mesajmatik projesinin **ana ve bağlayıcı referansıdır**. Bundan sonraki tüm geliştirmelerde önce bu dosya esas alınacaktır. Yeni bir değişiklik yapılırken burada yazan ve çalışan kurallar bozulmayacak; ilgisiz özelliklere dokunulmayacaktır.

## 1. Projenin amacı

Mesajmatik; manevi günler ve özel zamanlar için kullanıcı seçimlerine göre özgün, doğal ve düzgün Türkçe mesajlar oluşturan, mesajı kullanıcı tarafından düzenlenebilir bırakan, kopyalama/paylaşma imkânı veren ve 1080×1080 sosyal medya paylaşım kartına dönüştüren mobil uyumlu web uygulamasıdır.

## 2. Kullanıcıdan alınan bilgiler

Uygulamada yalnızca şu ana girişler bulunacaktır:

- Özel gün / zaman
- Üslup
- Mesaj uzunluğu
- Hitap — boş gelen serbest metin alanı
- İsim / kurum / şirket adı

**Özel Vurgu / Anahtar Kelimeler alanı kaldırılmıştır ve yeniden eklenmeyecektir.** Kullanıcı oluşturulan mesaj üzerinde istediği ekleme veya düzeltmeyi doğrudan sonuç kutusunda yapabilir.

## 3. Hitap alanı — SABİT KURAL

- Hitap bir açılır seçim kutusu olmayacaktır.
- Hazır hitap seçenekleri gösterilmeyecektir.
- Alan ilk açılışta tamamen boş gelecektir.
- Kullanıcı isterse istediği hitabı kendisi yazacaktır.
- Kullanıcı boş bırakırsa mesaja hitap eklenmeyecektir.
- Girilen hitap varsa mesajın ilk satırında, kullanıcının yazdığı biçime mümkün olduğunca sadık kalınarak kullanılacaktır.

## 4. Oluşturulan mesajın düzenlenmesi

`Oluşturulan Mesaj` kutusu **düzenlenebilir** olacaktır; `readonly` yapılmayacaktır.

Kullanıcı Gemini tarafından oluşturulan mesajı paylaşmadan veya karta dönüştürmeden önce istediği gibi değiştirebilir. Kopyalama, sosyal medya paylaşımı ve görsel kart üretimi, kutuda o anda bulunan son düzenlenmiş metni kullanır.

## 5. Desteklenen günler ve sıralama

Özel Gün / Zaman açılır listesi **daima Türkçe A→Z alfabetik sırada** gösterilecektir:

- Arefe Günü
- Berat Kandili
- Cuma Günü
- Kadir Gecesi
- Kurban Bayramı
- Mevlid Kandili
- Miraç Kandili
- Ramazan Ayı
- Ramazan Bayramı
- Regaib Kandili

Yeni gün eklenirse liste yeniden A→Z sıralanacaktır.

## 6. Mesaj üslupları

- Samimi
- Resmî
- Kurumsal
- Dua ağırlıklı
- Ayet / Hadis ağırlıklı

Bu üsluplar yalnız birkaç kelime değiştirilerek birbirine benzetilmeyecek. Giriş, özne, cümle yapısı, ritim ve kapanış üsluba göre gerçekten değişmelidir.

## 7. Çalışan Gemini yapısı — KESİNLİKLE KORUNACAK

Halen çalışan yapı:

- Model: `gemini-3.6-flash`
- API: `generateContent`
- Google Apps Script üzerinden doğrudan çağrı
- **1 tıklama = 1 Gemini API isteği**
- Otomatik retry yok
- İkinci/üçüncü kalite kontrol API çağrısı yok
- `maxOutputTokens: 2048`
- `thinkingConfig.thinkingLevel: "minimal"`
- `finishReason` kontrol edilir
- `STOP` dışındaki tamamlanmamış cevaplar başarılı mesaj olarak gösterilmez
- Yarım cevap kullanıcıya nihai mesaj diye verilmez

**Arayüz, hitap alanı, gün sıralaması, kart, ikon veya paylaşım düzeni değiştirilirken bu çalışan Gemini taşıma/model yapısına dokunulmayacaktır.**

## 8. Mesaj üretim akışı

1. Kullanıcı `Mesajı Oluştur` der.
2. Gemini ile tek API isteğinde yeni mesaj üretilir.
3. Gemini tamamlanmış ve geçerli cevap verirse mesaj gösterilir.
4. Gemini başarısızsa yerel üretici otomatik devreye girmez.
5. Kullanıcıya yerel mesaj üreticisiyle devam etmek isteyip istemediği sorulur.
6. Kullanıcı açıkça onaylarsa yerel üretici çalışır.
7. Kullanıcı istemezse işlem biter.

**Otomatik fallback yasaktır.**

## 9. Her tıklamada yeni mesaj zorunluluğu

Aynı gün, aynı üslup, aynı uzunluk, aynı hitap ve aynı imza kullanılsa bile her yeni tıklamada belirgin biçimde yeni mesaj üretilmelidir.

Mümkün olduğunca değişmesi gerekenler:

- giriş yapısı
- cümle ritmi
- vurgu sırası
- kullanılan fiiller
- paragraf akışı
- kapanış biçimi

Önceki mesaj yalnızca çeşitliliği artırmak için bağlam olarak verilebilir; bunun için ikinci API çağrısı yapılmaz.

## 10. Türkçe ve içerik kalitesi

Mesajlarda:

- Türkçe ekler doğru kullanılmalı
- özne-yüklem uyumu korunmalı
- tekil/çoğul uyumu doğru olmalı
- zamirlerin gönderimi açık olmalı
- aynı dilek fiilleri gereksiz tekrarlanmamalı
- hazır ve mekanik kalıplar azaltılmalı
- dinî, tarihî, kurumsal veya toplumsal bilgi uydurulmamalı
- parantez içinde anlamsız sayı, token numarası veya teknik işaret bulunmamalı
- cümleler yarım bırakılmamalı

## 11. Mesaj uzunluğu

Yaklaşık hedefler:

- Kısa: 45–70 kelime
- Orta: 90–130 kelime
- Uzun: 150–210 kelime

Doğal anlatım kelime sayısından daha önemlidir.

## 12. Hitap ve imza düzeni

Hitap girilmişse ilk satırda bulunur ve ardından bir boş satır bırakılır.

İsim / kurum / şirket adı girilmişse mesaj sonunda bir boş satırdan sonra yalnızca imza yer alır.

**Paylaşım kartında imza/isim ana metinden ayrı ele alınacak ve sağa hizalı gösterilecektir.** Ana gövde iki yana yaslı kalırken imza hiçbir tasarım varyasyonunda sola veya ortaya alınmayacaktır.

Kişi adı olarak algılanan 2–4 kelimelik imzalarda yazım standardı `Ad SOYAD` olacaktır. Örnek: `hasan can` → `Hasan CAN`. Kurum/şirket ifadeleri kişi adı gibi zorla dönüştürülmeyecektir.

## 13. Teknik mimari — GÜNCEL

Güncel yapı:

`GitHub Pages index.html → çalışan Google Apps Script /exec adresine yönlendirme`

`Google Apps Script Kod.gs → arayüz + kart sistemi + google.script.run → Gemini API`

### Google Apps Script `Kod.gs`

- gerçek uygulama arayüzünü doğrudan üretir
- HTML içeriği `String.raw` ile gömülür
- kullanıcı seçimlerini toplar
- `google.script.run` ile sunucu fonksiyonunu çağırır
- `GEMINI_API_KEY` değerini Script Properties’ten okur
- Gemini API çağrısını yapar
- tamamlanmamış cevabı reddeder
- mesaj, paylaşım ve kart sistemini çalıştırır

### GitHub `index.html`

- eski uygulama kodunu çalıştırmaz
- doğrudan canlı Apps Script `/exec` adresine yönlendirir
- GitHub Pages adresini açan kullanıcı gerçek çalışan Mesajmatik’e ulaşır
- yönlendirme adresi, aktif `/exec` deployment adresiyle birebir aynı tutulur
- yazım hatalı/eski deployment kimliği bırakılmaz
- mevcut çalışan deployment adresi: `https://script.google.com/macros/s/AKfycby9lM6959cBka4D83g_VGxBhszXbMmpf38x27Pp5KScYaT-xHWINKc-y5QkXEf0ph2E/exec`
- aynı mevcut Web App deployment’ı `Dağıt → Dağıtımları yönet → Kalem → Yeni sürüm → Dağıt` yoluyla güncellendiğinde bu `/exec` adresi korunur; yeni deployment oluşturulursa kimlik değişebilir

Eski popup, iframe, JSONP veya eski API köprüsü yeniden kullanılmayacaktır.

## 14. Sosyal medya paylaşımı

Desteklenecek platformlar:

- WhatsApp
- Instagram
- Facebook
- X
- Telegram
- cihazın desteklediği diğer uygulamalar

Sosyal medya platformları büyük metin butonlarıyla değil, **küçük, kompakt, ikon/logo ağırlıklı butonlarla** gösterilecektir.

- WhatsApp butonunda telefon ahizesi veya genel telefon simgesi kullanılmayacaktır; **tanınabilir WhatsApp konuşma balonu/telefon logosu** gösterilecektir.
- Sosyal ikonlar mobil ekranda taşmayacak, birbirini ezmeyecek ve dokunmatik kullanım için yeterli hedef alanına sahip olacaktır.

Ana `Kopyala`, `Paylaş` ve `Görsel Kart` işlemleri ayrı ana işlem butonları olarak kalabilir.

Instagram için yanlış çalışan sahte metin paylaşım URL’si kullanılmayacak; yerel paylaşım veya görsel paylaşım yolu tercih edilecektir.

## 15. Paylaşım kartı — SABİT TASARIM KURALLARI

- Kart boyutu kesin olarak 1080×1080’dir.
- Tasarım sade, temiz ve manevi çizgide olacaktır.
- Gereksiz süs ve karmaşa kullanılmayacaktır.
- `Tasarımı Değiştir` için en az **8 ayrı sade görsel varyasyon** bulunacaktır.
- Kart mevcut mesaj kutusundaki **son düzenlenmiş metni** kullanır; yeni mesaj üretmez.
- **Mesajın tamamı karta alınacaktır; metin kesilmeyecektir.**
- Metin uzun olduğunda yazı boyutu ve satır aralığı otomatik küçültülerek karta sığdırılacaktır.
- **Kartın ana gövde metni iki yana yaslı (justify) olacaktır.**
- **İsim / kurum / şirket imzası kartın alt bölümünde sağa hizalı olacaktır.**
- **Paylaşım kartının üzerinde `Mesajmatik`, Gemini, model adı, yapay zekâ etiketi veya watermark bulunmayacaktır.**
- Simge değişikliği kart altyapısını, metin alanını, imza hizasını veya tema sistemini değiştirmeyecektir.

### Günlere özel simge — GÜNCEL DONDURULMUŞ HARİTA

- Arefe Günü: `☾`
- Berat Kandili: `☾✦`
- Cuma Günü: `☪`
- Kadir Gecesi: `☾★`
- Kurban Bayramı: `☾✦✦`
- Mevlid Kandili: `✦☾`
- Miraç Kandili: `★☾★`
- Ramazan Ayı: `☾★`
- Ramazan Bayramı: `☾✦`
- Regaib Kandili: `✦☾✦`

Anlamı belirsiz ok, yön, teknik veya dinî çağrışımı olmayan semboller (`↟` vb.) kullanılmayacaktır.

### `Tasarımı Değiştir`

Bu buton:

- mesajı değiştirmez
- Gemini çağırmaz
- yerel mesaj üretmez
- yalnızca kartın görsel varyasyonunu değiştirir
- iki yana yaslı metin, sağa hizalı imza ve tam metni gösterme kurallarını bozmaz

## 16. Mobil görünüm — SABİT KURAL

Uygulama cep telefonunda masaüstü sayfasının küçültülmüş hali gibi görünmeyecektir.

- Sayfa yatay taşma yapmayacaktır.
- Ana uygulama kartı telefon ekranına oturacaktır.
- Form alanları mobilde tek sütuna düşecektir.
- Giriş alanları okunabilir yazı boyutunda olacaktır.
- `Kopyala`, `Paylaş` ve `Görsel Kart` butonları dar ekranda sıkışmayacaktır.
- Sosyal medya ikonları ekrana sığacaktır.
- 1080×1080 kart önizlemesi ekran genişliğine orantılı küçülecektir.

## 17. Geliştirme sırasında korunacak temel kural

**Çalışan bir özellik, başka bir özellik düzeltilirken değiştirilmez.**

Özellikle:

- kart değişikliği yapılırken Gemini motoruna dokunulmaz
- sosyal medya butonları değiştirilirken mesaj motoruna dokunulmaz
- gün sıralaması değiştirilirken API akışına dokunulmaz
- simge değiştirilirken metin hizası veya tam metin kuralı bozulmaz
- yerel motor geliştirilirken mevcut Gemini yolu, kart, mobil görünüm, paylaşım, yönlendirme ve imza sistemi bozulmaz
- yeni motor önce ayrı fonksiyon/modül olarak geliştirilir ve test edilir; çalışan üretim akışına doğrudan gömülmez

Her değişiklik cerrahi ve sınırlı olmalıdır.

## 18. GitHub / Google Apps Script çalışma yöntemi

Ana dosyalar:

- `APPS_SCRIPT_KODU.gs` — Google Apps Script `Kod.gs` için ana kaynak
- `index.html` — yalnızca canlı Apps Script uygulamasına yönlendirme
- `README.md` — ana şartname ve bağlayıcı karar kaydı

Google Apps Script GitHub ile otomatik senkronize değildir.

`APPS_SCRIPT_KODU.gs` değiştirildiğinde:

1. GitHub güncellenir.
2. Güncel dosya yeniden GitHub’dan okunur.
3. Kullanıcıya **tam ve güncel Kod.gs içeriği** doğrudan verilir.
4. Kullanıcı Apps Script’e yapıştırır ve yeni sürüm dağıtır.

Parça kod verilip kullanıcının doğru yeri bulması istenmeyecektir.

## 19. Değişmez ana kurallar

> **Her yeni mesaj isteği, aynı girdiler kullanılsa bile yeni ve belirgin biçimde farklı bir mesaj üretmelidir.**

> **Çalışan Gemini yapısı, arayüz ve görsel geliştirmeleri sırasında bozulmayacaktır.**

> **Hitap alanı boş ve serbest metin olacaktır; hazır seçenek olmayacaktır.**

> **Özel Vurgu / Anahtar Kelimeler alanı bulunmayacaktır.**

> **Paylaşım kartı mesajın tamamını göstermeli, ana metni iki yana yaslı, imzayı sağa hizalı göstermelidir.**

> **Mobil görünüm telefon ekranına taşmadan çalışacaktır.**

## 20. Kullanıcıya görünen teknik ibareler — SON KARAR

- Başarılı mesaj üretiminden sonra kullanıcıya yalnızca `Mesaj oluşturuldu.` bilgisi gösterilir.
- Kullanıcı arayüzünde `Gemini`, `gemini-3.6-flash`, model adı veya yapay zekâ üretici ibaresi gösterilmez.
- Teknik model bilgisi yalnız geliştirici/debug verisinde tutulabilir.
- GitHub Pages yönlendirmesi aktif Apps Script `/exec` adresinin doğru deployment kimliğini kullanacaktır.

## 21. 2026-08-28 ÇALIŞAN SÜRÜMÜ DONDURMA KAYDI

Bu tarihte çalışan mevcut sistem yeni geliştirmeler için **geri dönüş tabanı** kabul edilir.

- GitHub Pages doğrudan çalışan Apps Script deployment’ına açılmaktadır.
- Aktif `/exec` adresi README Bölüm 13’te kayıtlıdır.
- Gemini üretimi çalışmaktadır ancak ücretsiz/kısıtlı kota nedeniyle yoğun kullanımda `429 quota exceeded` oluşabilmektedir.
- Gemini motoru kaldırılmamıştır ve yerel motor geliştirilirken değiştirilmeyecektir.
- Son kullanıcıya görünen başarı mesajı `Mesaj oluşturuldu.` şeklindedir.
- Gemini hata verirse mevcut sistem kullanıcı onayıyla eski basit yerel fallback’i çalıştırabilir; bu davranış yeni yerel motor hazır olana kadar korunur.
- Kişi adı standardı `Ad SOYAD`dır.
- Kartlar 1080×1080, ana metin justify, imza sağ hizalıdır.
- Gün simgeleri Bölüm 15’te kayıtlı haritaya göre çalışır.
- Mobil görünüm mevcut haliyle çalışan kabul edilir ve yerel motor geliştirmesi sırasında değiştirilmez.

## 22. YENİ HEDEF — KOTASIZ YEREL MESAJ ÜRETİM MOTORU

### Amaç

Gemini/API kotasına bağlı olmadan, sunucuya veya ücretli yapay zekâ servisine istek göndermeden, Mesajmatik’in kendi kodu içinde çok sayıda doğal Türkçe mesaj üretebilen bir motor geliştirilecektir.

Bu motorun çalışma adı: **Mesajmatik Yerel Üretim Motoru (MYÜM)**.

### Temel karar

İlk aşamada tarayıcıya birkaç GB yapay zekâ modeli indiren gerçek bir yerel LLM kullanılmayacaktır. Bunun nedeni mobil cihaz uyumluluğu, ilk indirme boyutu, RAM ihtiyacı, WebGPU desteği ve düşük donanımlı telefonlarda kararlılık riskidir.

Bunun yerine Mesajmatik’in ihtiyacına özel bir **doğal dil üretim motoru (NLG)** geliştirilecektir. Bu motor klasik sabit mesaj listesi olmayacaktır.

### MYÜM çalışma prensibi

Motor bir mesajı tek parça hazır şablondan seçmeyecek; aşağıdaki katmanlardan dinamik olarak kuracaktır:

1. gün/gece bağlamı
2. seçilen üslup
3. hedef uzunluk
4. hitap
5. giriş cümlesi ailesi
6. ana tema/vurgu dizisi
7. dua/dilek cümlesi ailesi
8. bağlaç ve geçiş yapısı
9. kapanış cümlesi ailesi
10. imza

Her katmanda birden fazla cümle iskeleti, kelime alternatifi ve cümle düzeni bulunacaktır. Ağırlıklı seçim + tekrar önleme ile aynı girdilerde farklı sonuçlar üretilecektir.

### Türkçe kalite katmanı

Motor yalnız rastgele kelime birleştirmeyecektir. Aşağıdaki kontroller yapılacaktır:

- kişi/kurum anlatımına göre tekil-çoğul uyumu
- üsluba göre `diliyorum / dileriz / temenni ederim / temenni ederiz` seçimi
- yinelenen `diliyorum`, `olsun`, `vesile olsun` gibi kalıpların azaltılması
- art arda aynı fiil veya aynı cümle başlangıcının engellenmesi
- noktalama ve boşluk temizliği
- hitap/imza yerleşimi
- hedef kelime aralığına yaklaşma
- önceki üretilen mesajla yüksek benzerlik varsa yeniden kompozisyon

### Üslup motorları

Her üslup ayrı kompozisyon kurallarına sahip olacaktır:

- **Samimi:** sıcak, kişisel, doğal ve kısa geçişli cümleler
- **Resmî:** ölçülü, saygılı, protokol dili
- **Kurumsal:** kurum adına çoğul anlatım ve temsil dili
- **Dua ağırlıklı:** dua yapısı merkezde; aynı dua fiili tekrar ettirilmez
- **Ayet/Hadis ağırlıklı:** yalnız önceden doğrulanmış ve kod içinde güvenilir kaynak kaydı bulunan sınırlı alıntılar kullanılabilir; motor kendi ayet/hadis metnini uyduramaz

### Çeşitlilik hedefi

Amaç yalnız 10–20 mesajı döndürmek değildir. Cümle aileleri, vurgu dizileri, sıralama ve geçiş kombinasyonları sayesinde her gün × üslup × uzunluk için çok yüksek kombinasyon sayısı üretilecektir.

Motor son üretilen mesajların kısa özet/imza hariç yapısal izlerini tarayıcı belleğinde tutarak art arda aynı kompozisyonu seçmemeye çalışacaktır.

### Kota ve maliyet

MYÜM:

- API çağrısı yapmaz
- Gemini kotası tüketmez
- kullanıcı sayısı arttıkça harici yapay zekâ maliyeti oluşturmaz
- çalışması için API anahtarı gerektirmez
- temel üretim için internet bağlantısına ihtiyaç duymaz; uygulama sayfası yüklendikten sonra üretim kodu tarayıcıda çalışabilir

### Geliştirme güvenliği

MYÜM ilk aşamada **mevcut `localMessage()` fonksiyonunun yerine doğrudan yazılmayacaktır**.

Önce ayrı bir fonksiyon/modül olarak hazırlanacaktır; örnek: `generateLocalSmartMessage()`.

Mevcut çalışan Gemini ve basit fallback korunacaktır. Yeni motor yeterli kaliteye ulaştığında hangi sırada kullanılacağı ayrıca kararlaştırılacaktır.

Olası ilerideki akış seçenekleri:

- Yerel motor ana üretici, Gemini isteğe bağlı kalite modu
- Gemini ana üretici, kota/hata halinde yerel akıllı motor
- Kullanıcıya `Yerel / Yapay Zekâ` seçimi

Bu seçimlerden hiçbiri test edilmeden mevcut üretim akışına uygulanmayacaktır.

### Gerçek yerel LLM seçeneği — İLERİ AŞAMA

İleride WebGPU/WASM üzerinde küçük bir Türkçe/multilingual LLM çalıştırma seçeneği ayrıca değerlendirilebilir. Ancak bu yöntem birkaç yüz MB–GB model indirme, yüksek RAM, cihaz uyumluluğu ve mobil performans sorunları nedeniyle MYÜM’den ayrı bir ileri aşamadır ve mevcut web uygulamasının temel çözümü olarak kabul edilmez.

## 23. YEREL MOTOR GELİŞTİRME SIRASI

1. Mevcut çalışan kod değişmeden korunacak.
2. MYÜM sözlük/cümle aileleri ayrı veri yapısında hazırlanacak.
3. Samimi + Kısa ile ilk prototip yapılacak.
4. Aynı girdide en az 20–30 üretim alınarak tekrar oranı ve Türkçe kalite kontrol edilecek.
5. Sonra Resmî, Kurumsal, Dua ve Ayet/Hadis üslupları eklenecek.
6. Orta ve Uzun kompozisyon motorları eklenecek.
7. Tüm 10 özel gün için bağlamlar tamamlanacak.
8. Önceki mesajla benzerlik önleme ve kalite filtresi eklenecek.
9. Ayrı test tamamlandıktan sonra mevcut uygulamaya kontrollü biçimde bağlanacak.
10. Entegrasyon sırasında Gemini, kart, mobil, paylaşım ve GitHub yönlendirme sistemi değiştirilmeden korunacak.
