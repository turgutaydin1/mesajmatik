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

Kullanıcı oluşturulan mesajı paylaşmadan veya karta dönüştürmeden önce istediği gibi değiştirebilir. Kopyalama, sosyal medya paylaşımı ve görsel kart üretimi, kutuda o anda bulunan son düzenlenmiş metni kullanır.

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

Gemini yazar tanımı bağlayıcı olarak şudur:

> **“Manevi ve özel günler için doğal, akıcı ve düzgün Türkçe kullanan, Müslüman, ahlaklı ve özenli bir yazarsın. Tüm ürettiğin mesajlar İslami duyarlılıkta olsun.”**

Bu cümle Gemini prompt’unda aynen korunacaktır. Ayrıca prompt kurallarında bütün mesajın İslami duyarlılık, güzel ahlak ve dinî hassasiyet çerçevesinde kalması açıkça istenir.

**Arayüz, hitap alanı, gün sıralaması, kart, ikon, paylaşım veya yerel motor geliştirilirken bu çalışan Gemini taşıma/model yapısına dokunulmayacaktır.**

## 8. Mesaj üretim akışı

Mevcut güvenli akış:

1. Kullanıcı `Mesajı Oluştur` der.
2. Gemini ile tek API isteğinde yeni mesaj üretilir.
3. Gemini tamamlanmış ve geçerli cevap verirse mesaj gösterilir.
4. Gemini başarısızsa yerel üretici otomatik devreye girmez.
5. Kullanıcıya yerel mesaj üreticisiyle devam etmek isteyip istemediği sorulur.
6. Kullanıcı açıkça onaylarsa **MYÜM gelişmiş yerel mesaj motoru** çalışır.
7. Kullanıcı istemezse işlem biter.

**Otomatik fallback yasaktır.** MYÜM entegrasyonu bu onay kuralını değiştirmez.

## 9. Her tıklamada yeni mesaj zorunluluğu

Aynı gün, aynı üslup, aynı uzunluk, aynı hitap ve aynı imza kullanılsa bile her yeni tıklamada belirgin biçimde yeni mesaj üretilmelidir.

Mümkün olduğunca değişmesi gerekenler:

- giriş yapısı
- cümle ritmi
- vurgu sırası
- kullanılan fiiller
- paragraf akışı
- kapanış biçimi

Önceki mesaj çeşitliliği artırmak için bağlam olarak kullanılabilir; bunun için ikinci Gemini API çağrısı yapılmaz. MYÜM de son yerel mesajı bellekte tutarak birebir tekrar üretmemeye çalışır.

## 10. Türkçe, İslami duyarlılık ve içerik kalitesi

**Gemini ve MYÜM için ortak ana içerik kuralı:** Tüm mesajlar İslami duyarlılıkta, güzel ahlakı gözeten, dinî hassasiyetlere saygılı bir çerçevede olacaktır.

Mesajlarda:

- Türkçe ekler doğru kullanılmalı
- özne-yüklem uyumu korunmalı
- tekil/çoğul uyumu doğru olmalı
- zamirlerin gönderimi açık olmalı
- aynı dilek fiilleri gereksiz tekrarlanmamalı
- hazır ve mekanik kalıplar azaltılmalı
- dinî, tarihî, kurumsal veya toplumsal bilgi uydurulmamalı
- İslami kavramlar bağlam dışı veya anlamsız süs olarak kullanılmamalı
- ayet/hadis uydurulmamalı
- kaynaklı üslupta yalnız doğruluğu önceden kontrol edilmiş kaynak kayıtları kullanılmalı
- parantez içinde anlamsız sayı, token numarası veya teknik işaret bulunmamalı
- cümleler yarım bırakılmamalı
- dua, rahmet, mağfiret, şükür, ibadet ve güzel ahlak dili seçilen günün anlamıyla uyumlu olmalı

## 11. Mesaj uzunluğu

Yaklaşık hedefler:

- Kısa: 45–70 kelime
- Orta: 90–130 kelime
- Uzun: 150–210 kelime

Doğal anlatım kelime sayısından daha önemlidir. MYÜM bu aralıklara dinamik cümle ekleme/çıkarma ile yaklaşır.

## 12. Hitap ve imza düzeni

Hitap girilmişse ilk satırda bulunur ve ardından bir boş satır bırakılır.

İsim / kurum / şirket adı girilmişse mesaj sonunda bir boş satırdan sonra yalnızca imza yer alır.

**Paylaşım kartında imza/isim ana metinden ayrı ele alınacak ve sağa hizalı gösterilecektir.** Ana gövde iki yana yaslı kalırken imza hiçbir tasarım varyasyonunda sola veya ortaya alınmayacaktır.

Kişi adı olarak algılanan 2–4 kelimelik imzalarda yazım standardı `Ad SOYAD` olacaktır. Örnek: `hasan can` → `Hasan CAN`. Kurum/şirket ifadeleri kişi adı gibi zorla dönüştürülmeyecektir.

## 13. Teknik mimari — GÜNCEL

Güncel yapı:

`GitHub Pages index.html → çalışan Google Apps Script /exec adresine yönlendirme`

`Google Apps Script Kod.gs → arayüz + kart sistemi + google.script.run → Gemini API`

`Kod.gs içindeki istemci tarafı → kullanıcı onayı sonrasında MYÜM yerel mesaj motoru`

### Google Apps Script `Kod.gs`

- gerçek uygulama arayüzünü doğrudan üretir
- HTML içeriği `String.raw` ile gömülür
- kullanıcı seçimlerini toplar
- `google.script.run` ile sunucu fonksiyonunu çağırır
- `GEMINI_API_KEY` değerini Script Properties’ten okur
- Gemini API çağrısını yapar
- tamamlanmamış cevabı reddeder
- Gemini hata verirse kullanıcı onayı sonrasında MYÜM’ü tarayıcı tarafında çalıştırır
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
- MYÜM yeni fonksiyonlar halinde geliştirilir; Gemini sunucu fonksiyonları değiştirilmez
- Gemini yazar tanımı ve İslami duyarlılık kuralı her iki motorun da ortak içerik standardıdır

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

> **Bütün mesajlar İslami duyarlılık, güzel ahlak ve dinî hassasiyet çerçevesinde üretilmelidir.**

> **Çalışan Gemini yapısı, arayüz ve görsel geliştirmeleri sırasında bozulmayacaktır.**

> **Hitap alanı boş ve serbest metin olacaktır; hazır seçenek olmayacaktır.**

> **Özel Vurgu / Anahtar Kelimeler alanı bulunmayacaktır.**

> **Paylaşım kartı mesajın tamamını göstermeli, ana metni iki yana yaslı, imzayı sağa hizalı göstermelidir.**

> **Mobil görünüm telefon ekranına taşmadan çalışacaktır.**

## 20. Kullanıcıya görünen teknik ibareler — SON KARAR

- Başarılı Gemini mesajından sonra kullanıcıya yalnızca `Mesaj oluşturuldu.` bilgisi gösterilir.
- MYÜM kullanıcı onayıyla devreye girdiğinde `Yerel mesaj oluşturuldu.` bilgisi gösterilebilir.
- Kullanıcı arayüzünde `Gemini`, `gemini-3.6-flash`, model adı veya yapay zekâ üretici ibaresi gösterilmez.
- Teknik model bilgisi yalnız geliştirici/debug verisinde tutulabilir.
- GitHub Pages yönlendirmesi aktif Apps Script `/exec` adresinin doğru deployment kimliğini kullanacaktır.

## 21. 2026-08-28 ÇALIŞAN SÜRÜMÜ DONDURMA KAYDI

Bu tarihte çalışan sistem yeni geliştirmeler için **geri dönüş tabanı** kabul edilir.

- GitHub Pages doğrudan çalışan Apps Script deployment’ına açılmaktadır.
- Aktif `/exec` adresi README Bölüm 13’te kayıtlıdır.
- Gemini üretimi çalışmaktadır ancak kota nedeniyle yoğun kullanımda `429 quota exceeded` oluşabilmektedir.
- Gemini motoru kaldırılmamıştır ve MYÜM geliştirilirken taşıma/model ayarları değiştirilmemiştir.
- Gemini yazar tanımına Müslüman, ahlaklı ve İslami duyarlılık kuralı eklenmiştir.
- Son kullanıcıya görünen başarılı Gemini mesajı `Mesaj oluşturuldu.` şeklindedir.
- Gemini hata verirse mevcut sistem kullanıcı onayıyla MYÜM gelişmiş yerel motorunu çalıştırır.
- Kişi adı standardı `Ad SOYAD`dır.
- Kartlar 1080×1080, ana metin justify, imza sağ hizalıdır.
- Gün simgeleri Bölüm 15’te kayıtlı haritaya göre çalışır.
- Mobil görünüm mevcut haliyle çalışan kabul edilir ve MYÜM geliştirmesi sırasında değiştirilmez.

## 22. KOTASIZ YEREL MESAJ ÜRETİM MOTORU — MYÜM

### Amaç

Gemini/API kotasına bağlı olmadan, ücretli yapay zekâ servisine istek göndermeden, Mesajmatik’in kendi kodu içinde çok sayıda doğal Türkçe ve İslami duyarlılığa sahip mesaj üreten motor geliştirilmektedir.

Motorun çalışma adı: **Mesajmatik Yerel Üretim Motoru (MYÜM)**.

### Mimari karar

İlk aşamada tarayıcıya birkaç GB yapay zekâ modeli indiren gerçek bir yerel LLM kullanılmayacaktır. Bunun yerine Mesajmatik’in dar ve belirli kullanım alanına özel bir **doğal dil üretim motoru (NLG)** kullanılacaktır.

Bu motor sabit 10–20 mesaj arasından seçim yapan eski fallback değildir. Mesajı dinamik katmanlardan kurar.

### MYÜM katmanları

1. seçilen gün/gece için doğru İslami tema ve kavramlar
2. seçilen üsluba özel giriş ailesi
3. günün temasını işleyen vurgu ailesi
4. dua/dilek ve güzel ahlak cümleleri
5. hedef uzunluğa göre ek cümle seçimi
6. kapanış ailesi
7. hitap
8. imza
9. son mesajı tekrar etmeme kontrolü

### Ortak içerik standardı

MYÜM, Gemini’deki şu ilkenin yerel karşılığını uygular:

> **“Manevi ve özel günler için doğal, akıcı ve düzgün Türkçe kullanan, Müslüman, ahlaklı ve özenli bir yazarsın. Tüm ürettiğin mesajlar İslami duyarlılıkta olsun.”**

Yerel motorda bu bir prompt değildir; gün temaları, cümle bankaları ve kalite kuralları doğrudan bu ilkeye göre tasarlanır.

### Gün bağlamları

MYÜM her gün için ayrı tema kaydı kullanır:

- Arefe: arınma, dua, hazırlık, kulluk
- Berat: bağışlanma, tövbe, dua, gönül muhasebesi
- Cuma: dua, kardeşlik, rahmet, bereket
- Kadir: Kur'an, dua, ibadet, af dileme
- Kurban Bayramı: teslimiyet, paylaşma, kardeşlik, infak
- Mevlid: Peygamber sevgisi, güzel ahlak, rahmet, sünnete bağlılık
- Miraç: namaz, kulluk, dua, manevi yükseliş
- Ramazan: oruç, Kur'an, sabır, infak, kulluk
- Ramazan Bayramı: şükür, kardeşlik, sevinç, paylaşma
- Regaib: rahmet, dua, tövbe, Allah'a yöneliş

### Üslup motorları

- **Samimi:** sıcak, doğal, kişisel dua ve temenniler
- **Resmî:** ölçülü, saygılı, birlik ve toplumsal hayır vurgusu
- **Kurumsal:** kurum adına çoğul anlatım; çalışanlar/mensuplar ve ailelere yönelik dil
- **Dua ağırlıklı:** `Allah'ım / Rabbimiz / Ya Rabbi` yapısı merkezde; ibadet, af, şifa, güzel ahlak ve kulluk duaları
- **Ayet/Hadis ağırlıklı:** yerel motor yalnız kod içinde önceden doğrulanmış kaynak kayıtlarını kullanır; kendiliğinden ayet/hadis uydurmaz

### MYÜM kaynaklı üslupta ilk doğrulanmış kayıt kümesi

İlk sürümde doğrudan uzun alıntı yerine anlamı açık biçimde özetlenen ve sure/ayet numarası verilen kayıtlar kullanılır:

- Bakara 2/186 — Allah'ın kullarına yakınlığı ve duaya karşılık vermesi
- İnşirah 94/5-6 — zorlukla beraber kolaylık
- Ra'd 13/28 — kalplerin Allah'ı anmakla huzur bulması
- Zümer 39/53 — Allah'ın rahmetinden ümit kesmeme
- Bakara 2/152 — Allah'ı anma ve şükretme

Kaynak kütüphanesi genişletilirken doğrulanmamış metin eklenmeyecektir.

### Uzunluk motoru

- Kısa: 45–70 kelime
- Orta: 90–130 kelime
- Uzun: 150–210 kelime

MYÜM önce temel kompozisyonu kurar; hedef altındaysa uygun yeni cümleler ekler, hedefin belirgin üstündeyse kapanışı koruyarak ara cümleleri azaltır.

### Kota ve maliyet

MYÜM mesaj üretirken:

- Gemini API çağrısı yapmaz
- API kotası tüketmez
- API anahtarı kullanmaz
- harici yapay zekâ maliyeti oluşturmaz
- mesaj üretimi istemci tarafında yapılır

## 23. MYÜM İLK ENTEGRASYON DURUMU — 2026-08-28

İlk MYÜM sürümü `APPS_SCRIPT_KODU.gs` içine eklenmiştir.

Uygulananlar:

1. Eski üç sabit yerel cümlelik fallback kaldırılmıştır.
2. `localMessage()` artık MYÜM kompozisyon motorunu çağırmaktadır.
3. 10 özel günün her biri için ayrı tema bilgisi tanımlanmıştır.
4. Samimi, Resmî, Kurumsal, Dua ve Ayet/Hadis ağırlıklı üsluplar için ayrı cümle aileleri oluşturulmuştur.
5. Kısa/Orta/Uzun hedefleri için dinamik cümle ekleme/çıkarma yapılmaktadır.
6. Hitap ve `Ad SOYAD` imza sistemi aynen korunmaktadır.
7. Son yerel mesaj istemci belleğinde tutulur ve birebir aynı gövdenin art arda gelmemesi için yeniden kompozisyon denenir.
8. Gemini önce çalışmaya devam eder; MYÜM yalnız Gemini hata verip kullanıcı açıkça onayladığında devreye girer.
9. Kart, mobil görünüm, paylaşım, GitHub yönlendirmesi ve Gemini API taşıma ayarları değiştirilmemiştir.

Bu ilk sürüm **başlangıç motorudur**. Sonraki geliştirmede amaç; daha büyük cümle aileleri, daha güçlü benzerlik kontrolü, Türkçe ek/ifade kalite filtresi ve günlere daha özgü kompozisyon yapıları eklemektir.

## 24. MYÜM GELİŞTİRME SIRASI

1. İlk entegre sürümden tüm gün × üslup × uzunluk kombinasyonlarında örnek çıktılar alınacak.
2. Dilbilgisi ve doğal Türkçe hataları temizlenecek.
3. Gün bazında özel cümle aileleri genişletilecek; yalnız genel kandil cümlelerine dayanılmayacak.
4. Her üslubun giriş, orta bölüm ve kapanış ritmi daha da ayrıştırılacak.
5. Basit birebir tekrar kontrolüne ek olarak kelime/ifade benzerliği kontrolü eklenecek.
6. Aynı mesaj içinde tekrar eden `diliyorum / niyaz ediyorum / nasip eylesin / vesile olsun` yapıları dengelenecek.
7. Ayet/Hadis ağırlıklı güvenilir kaynak kütüphanesi kontrollü biçimde genişletilecek.
8. MYÜM kalitesi yeterli seviyeye geldiğinde Gemini’ye bağımlılığı azaltacak nihai üretim sırası ayrıca kararlaştırılacak.
9. Bu karar verilene kadar Gemini ana yol, MYÜM onaylı kota/hata alternatifi olarak kalacaktır.
10. Tüm geliştirmelerde çalışan kart, mobil, paylaşım, GitHub yönlendirme ve isim standardı korunacaktır.

## 25. MYÜM HAM METİN API YOLU — 2026-09-03

Google Apps Script `doGet(e)` içine mevcut web arayüzünü bozmadan ayrı bir ham metin üretim yolu eklenmiştir.

- Normal `/exec` adresi parametresiz açıldığında mevcut Mesajmatik web arayüzü aynen açılır.
- `?ping=1` davranışı aynen korunur.
- `?action=generate` kullanıldığında yalnızca MYÜM tarafından üretilen ham mesaj metni döner.
- Bu yol Gemini çağırmaz, Gemini kotası tüketmez ve `GEMINI_API_KEY` kullanmaz.
- Kestirmeler, otomasyonlar veya başka istemciler dönen metni doğrudan okuyabilir.
- Desteklenen parametreler: `gun`, `uslup`, `uzunluk`, `hitap`, `imza`.
- Geçersiz veya eksik değerlerde güvenli varsayılanlar kullanılır: `Cuma Günü`, `samimi`, `kisa`.
- `imza` kişi adıysa mevcut `Ad SOYAD` standardı uygulanır; kurum/şirket ifadeleri olduğu gibi korunur.

Örnek çağrı:

`/exec?action=generate&gun=Cuma%20Günü&uslup=samimi&uzunluk=kisa`

Hitap ve imza ile örnek:

`/exec?action=generate&gun=Berat%20Kandili&uslup=dua&uzunluk=orta&hitap=Kıymetli%20Dostum&imza=Turgut%20Aydın`

Bu API yolu mevcut web uygulamasındaki `Mesajı Oluştur → Gemini → hata halinde kullanıcı onayıyla MYÜM` akışını değiştirmez; yalnızca harici istemciler için ek bir yerel üretim girişidir.
