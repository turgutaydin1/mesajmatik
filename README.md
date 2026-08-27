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

Ana `Kopyala`, `Paylaş` ve `Görsel Kart` işlemleri ayrı ana işlem butonları olarak kalabilir.

Instagram için yanlış çalışan sahte metin paylaşım URL’si kullanılmayacak; yerel paylaşım veya görsel paylaşım yolu tercih edilecektir.

## 15. Paylaşım kartı — SABİT TASARIM KURALLARI

- Kart boyutu kesin olarak 1080×1080’dir.
- Tasarım sade, temiz ve manevi çizgide olacaktır.
- Gereksiz süs ve karmaşa kullanılmayacaktır.
- Görsel kalite düşük, düz ve tek tip bırakılmayacaktır; sade çizgi korunarak **daha rafine arka plan, çerçeve, ışık ve geometrik detaylar** kullanılabilir.
- `Tasarımı Değiştir` için en az **8 ayrı sade görsel varyasyon** bulunacaktır.
- Varyasyonlar yalnız renk tonu değiştiren kopyalar olmayacak; çerçeve, zemin, ince geometrik motif, vurgu ve kompozisyon detaylarında da fark bulunacaktır.
- Her özel gün/gece için ayrı ve tanınabilir simge olacaktır.
- Kart mevcut mesaj kutusundaki **son düzenlenmiş metni** kullanır; yeni mesaj üretmez.
- **Mesajın tamamı karta alınacaktır; metin kesilmeyecektir.**
- Metin uzun olduğunda yazı boyutu ve satır aralığı otomatik küçültülerek karta sığdırılacaktır.
- Mesajın son kısmını kesmek, `...` ile kırpmak veya belirli satır sayısından sonra durdurmak yasaktır.
- Hitap ve paragraf boşlukları mümkün olduğunca korunacaktır.
- **Kartın ana gövde metni iki yana yaslı (justify) olacaktır.**
- Paragrafın son satırı doğal biçimde sola hizalı kalabilir; diğer satırlar sol ve sağ sınırlara dengeli oturmalıdır.
- **İsim / kurum / şirket imzası kartın alt bölümünde sağa hizalı olacaktır.**
- İmza iki yana yaslanmayacak, sola veya ortaya hizalanmayacaktır.
- İmza için ana metinden görsel olarak ayrışan ancak abartısız tipografik vurgu kullanılabilir.
- Bu iki yana yaslı ana metin ve sağa hizalı imza düzeni sonraki tasarım değişikliklerinde bozulmayacaktır.

### Günlere özel simge zorunluluğu

Mevcut her gün için farklı simge tanımlanır. Yeni gün eklenirse ona da ayrı simge tanımlanması zorunludur.

### `Tasarımı Değiştir`

Bu buton:

- mesajı değiştirmez
- Gemini çağırmaz
- yerel mesaj üretmez
- yalnızca kartın görsel varyasyonunu değiştirir
- en az 8 farklı tasarım arasında dolaşır
- iki yana yaslı metin, sağa hizalı imza, tam metni gösterme ve güne özel simge kurallarını bozmaz

## 16. Geliştirme sırasında korunacak temel kural

**Çalışan bir özellik, başka bir özellik düzeltilirken değiştirilmez.**

Özellikle:

- kart değişikliği yapılırken Gemini motoruna dokunulmaz
- sosyal medya butonları değiştirilirken mesaj motoruna dokunulmaz
- gün sıralaması değiştirilirken API akışına dokunulmaz
- simge değiştirilirken metin hizası veya tam metin kuralı bozulmaz
- hitap alanı değiştirilirken Gemini taşıma/model ayarları değiştirilmez
- imza hizası değiştirilirken ana metnin iki yana yaslı yapısı bozulmaz
- kart tasarım çeşitliliği artırılırken mesaj üretimi, paylaşım akışı ve diğer çalışan alanlara dokunulmaz
- daha önce açıkça mutabık kalınmış tasarım/işlev kararları yeni bir talimat onları değiştirmedikçe korunur

Her değişiklik cerrahi ve sınırlı olmalıdır.

## 17. GitHub / Google Apps Script çalışma yöntemi

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

## 18. Değişmez ana kurallar

> **Her yeni mesaj isteği, aynı girdiler kullanılsa bile yeni ve belirgin biçimde farklı bir mesaj üretmelidir.**

> **Çalışan Gemini yapısı, arayüz ve görsel geliştirmeleri sırasında bozulmayacaktır.**

> **Hitap alanı boş ve serbest metin olacaktır; hazır seçenek olmayacaktır.**

> **Özel Vurgu / Anahtar Kelimeler alanı bulunmayacaktır; kullanıcı mesajı sonuç kutusunda kendisi düzenleyebilir.**

> **Paylaşım kartı mesajın tamamını göstermeli, ana metni iki yana yaslı, imzayı sağa hizalı göstermeli ve seçilen güne özel simge kullanmalıdır.**
